/**
 * A simple javascript module for getting telemetry data in JSON format and
 * plotting using the <a href="www.flotcharts.org">Flot Library</a>.
 * @file awareMap
 * @author Ryan Nichol <r.nichol@ucl.ac.uk>
 */


///Here are the UI thingies



//////////////////////////////////////////////////////////////////////////////
/////                                                                    /////
/////   awareMap.js                                                      /////
/////                                                                    /////
/////   Simple javascript for plotting ANITA's position                  /////
/////                                                                    /////
/////   December 2014, r.nichol@ucl.ac.uk                                /////
//////////////////////////////////////////////////////////////////////////////

AwareMap = new Object();


function initialiseAwareMap() {
    $("#debugContainer").hide();
    var docHeight=$(window).height();
    var docWidth=$(window).width();
    var heightPercentage=60;
    if(docWidth>=800) heightPercentage=80;
    var maxPlotHeight=Math.round((heightPercentage*docHeight)/100);
    $('#divMap-1').height(maxPlotHeight); 
    $("#mapRadio").buttonset();

    AwareMap.gotRunSourceMap=false;
    AwareMap.pulserPoints=getCalPulserPositionList();



    $("input:radio[name=mapRadio]").click(function() { 
        if($('#debugContainer').is(":visible"))
	    $('#debugContainer').append("<p>color clicked... drawPlots</p>");
	actuallyDrawMap();
    });

    
    function handlePosSumFile(jsonObject) {
	AwareMap.object=jsonObject;
	AwareMap.lapXYPoints = new Array();

	AwareMap.lapXYPoints[0] = new Array(); // lap 1
	AwareMap.lapXYPoints[1] = new Array(); // lap 2
	
	var lapNum=0;

	for(var i=0;i<jsonObject.poslist.length;i++) {
	    if(jsonObject.poslist[i].run>382) 
		lapNum=1;	    
	    AwareMap.lapXYPoints[lapNum].push(getXYFromLatLong(jsonObject.poslist[i].latitude,jsonObject.poslist[i].longitude));
	}
	if(false) {
	    getRunSourceMap();
	}
	else {
	    actuallyDrawMap();
	}
	
    }

    posSumUrl="output/ANITA4/map/posSum.json";
       
    $.ajax({
	url: posSumUrl,
	type: "GET",
	dataType: "json",
	success: handlePosSumFile,
	error: handleAjaxError
    });
	

}

function getRunSourceMap() {
    AwareMap.runNumber=65;

    function handleMapRunFile(jsonObject) {
		AwareMap.gotRunSourceMap=true;
		AwareMap.mapRun=jsonObject;
		AwareMap.mapRunPoints = new Array();
		for(var i=0;i<jsonObject.poslist.length;i++) {
			AwareMap.mapRunPoints.push(getXYFromLatLong(jsonObject.poslist[i].sourceLat,jsonObject.poslist[i].sourceLon));
		}
		actuallyDrawMap();	
    }


    mapRunUrl="output/ANITA4/map/mapRun"+AwareMap.runNumber+".json";
       
    $.ajax({
	url: mapRunUrl,
	type: "GET",
	dataType: "json",
	success: handleMapRunFile,
	error: handleAjaxError
    });


}



function actuallyDrawMap() {
    if ( $('#mapRadio :checked').attr('id') == 'mapLow' ) {
	AwareMap.pngName="antarcticaIceMap_small.png";
	AwareMap.xMin=-3333.5;
	AwareMap.xMax=+3333.5;
	AwareMap.yMin=-3333.5;
	AwareMap.yMax=+3333.5;
    } else if ( $('#mapRadio :checked').attr('id') == 'mapHigh' ) {
	AwareMap.pngName="antarcticaIceMap.png";
	AwareMap.xMin=-3333.5;
	AwareMap.xMax=+3333.5;
	AwareMap.yMin=-3333.5;
	AwareMap.yMax=+3333.5;
    } else {
	AwareMap.pngName="antarcticaIceMapOld.png";
	AwareMap.xMin=-3000;
	AwareMap.xMax=+3000;
	AwareMap.yMin=-2500;
	AwareMap.yMax=+2500;	
    }
    

    mapPlotCan=$("#divMap-1");
//   



    var data = [ 
	{ data: [[AwareMap.pngName, AwareMap.xMin,AwareMap.yMin,AwareMap.xMax,AwareMap.yMax]],
	  images: {show: true}, bars: {show: false}, points: {show: false}, lines: {show: false}}
    ];
    	
    for(var lap=0;lap<AwareMap.lapXYPoints.length;lap++) {
	var LapData={ 
	    data: AwareMap.lapXYPoints[lap], 
	    images: {show: false}, 
	    bars: {show: false}, 
	    points: {show: true}, 
	    lines: {show: false}};
	data.push(LapData);
    }
    



    var PulserData= { data: AwareMap.pulserPoints, 
		      images: {show: false}, 
		      bars: {show: false}, 
		      points: {show: true, symbol:"triangle"}, 
		      lines: {show: false}};
    data.push(PulserData);
    
    if(AwareMap.gotRunSourceMap) {
	//At some point will do soemthing 
	var MapRun={ data: AwareMap.mapRunPoints, 
		     images: {show: false}, 
		     bars: {show: false}, 
		     points: {show: true, symbol:"cross"}, 
		     lines: {show: false}};
	data.push(MapRun);
    }
    
   

    var options = {
	series: { images: { show: true } },
	xaxis: { min: AwareMap.xMin, max: AwareMap.xMax },
	yaxis: { min: AwareMap.yMin, max: AwareMap.yMax },
	lines: { show: true },
	grid: { hoverable: true, clickable: true },
	selection: {mode: "xy"}
	
    };
    
    function doPlot() {
	var graph = $.plot.image.loadDataImages(data, options, function () {
	    $.plot(mapPlotCan, data, options);
	})
    }

	
    mapPlotCan.bind("plothover", function (event, pos, item) {		
    	if (item) {	   
	    if($('#debugContainer').is(":visible"))
		$('#debugContainer').append("<p>item"+item.seriesIndex+"drawPlots</p>");
	    

	    
	    if(item.seriesIndex==2) {		
    		var d = new Date(AwareMap.object.poslist[item.dataIndex].unixTime*1000);
		var cartCos=getCartesianCoords(AwareMap.object.poslist[item.dataIndex].latitude,
					       AwareMap.object.poslist[item.dataIndex].longitude,
					       AwareMap.object.poslist[item.dataIndex].altitude);

		var pulserDist = new Array();
		pulserDist[0]=getDistance(cartCos,AwareMap.pulserCartArray[0]); //m
 		pulserDist[1]=getDistance(cartCos,AwareMap.pulserCartArray[1]); //m
 		pulserDist[2]=getDistance(cartCos,AwareMap.pulserCartArray[2]); //m
		var minPulser=0;
		if(pulserDist[1]<pulserDist[0]) minPulser=1;
		if(pulserDist[2]<pulserDist[1] && pulserDist[2]<pulserDist[0]) minPulser=2;

		var pulserTime=new Array();
		for(var i=0;i<pulserDist.length;i++) {
		    pulserTime[i]=1e9*(pulserDist[i]/C_LIGHT);
		    pulserDist[i]/=1000;
		}


    		$("#divMapInfo").html("<ul>"
    				      +"<li>Date: "+d.toUTCString()+"</li>"
    				      +"<li>Run: "+AwareMap.object.poslist[item.dataIndex].run+"</li>"
    				      +"<li>Event: "+AwareMap.object.poslist[item.dataIndex].eventNumber+"</li>"
    				      +"<li>Rate: "+AwareMap.object.poslist[item.dataIndex].eventRate+"</li>"
    				      +"<li>"+AwareMap.pulserNames[minPulser]+"</li>"
				      +"<ul><li>Dist = "+pulserDist[minPulser].toFixed(2)+"km</li>"
				      +"<ul><li>Time = "+pulserTime[minPulser].toFixed(0)+"ns</li></ul>"
    				      +"</ul>");		
	    }
	    else if(item.seriesIndex==2) {
		$("#divMapInfo").html("<ul>"+"<li>Pulser: "+AwareMap.pulserNames[item.dataIndex]+"</li></ul>");
	    }
   	}
        });

 // This is where the zoom function is bound to the time plot
    mapPlotCan.bind("plotselected", function (event, ranges) {
        if($('#debugContainer').is(":visible"))
	    $('#debugContainer').append("<p>plotselected</p>");
	options.xaxis.min=ranges.xaxis.from;
	options.xaxis.max=ranges.xaxis.to;
	options.yaxis.min=ranges.yaxis.from;
	options.yaxis.max=ranges.yaxis.to;
	doPlot();
    });



    mapPlotCan.bind("plotunselected", function (event, ranges) {
	options.xaxis.min=AwareMap.xMin
	options.xaxis.max=AwareMap.xMax;
	options.yaxis.min=AwareMap.yMin;
	options.yaxis.max=AwareMap.yMax;
	doPlot();
    });

    doPlot();

}




function getXYFromLatLong(latitude, longitude) {       	
    var TrueScaleLat=71;
    var CentralMeridian=0;
    var RadiusOfEarth=6378.1; //Kilometres
    //Negative longitude is west
 //    //All latitudes assumed south
    var absLat=Math.abs(latitude);
    r=RadiusOfEarth*Math.cos((90.-TrueScaleLat)*Math.PI/180.)*Math.tan((90-absLat)*Math.PI/180);
    var y=r*Math.cos(longitude*Math.PI/180.);
    var x=r*Math.sin(longitude*Math.PI/180.);    
    return [x,y];
}



function getCalPulserPositionList() {
    var ldbLatLon=[-77.8543044,+167.1932148,-22];
    var sipleDomeLatLon=[-81.65232,-149.00016,650];
    var waisLatLon=[-79.46562,-112.1125,1775.68];
    AwareMap.pulserNames=["Siple Dome","WAIS","LDB"];    
    AwareMap.pulserArray=new Array();
    AwareMap.pulserArray.push(getXYFromLatLong(sipleDomeLatLon[0],sipleDomeLatLon[1]));
    AwareMap.pulserArray.push(getXYFromLatLong(waisLatLon[0],waisLatLon[1]));
    AwareMap.pulserArray.push(getXYFromLatLong(ldbLatLon[0],ldbLatLon[1]));
    AwareMap.pulserCartArray=new Array();
    AwareMap.pulserCartArray.push(getCartesianCoords(sipleDomeLatLon[0],sipleDomeLatLon[1],sipleDomeLatLon[2]));
    AwareMap.pulserCartArray.push(getCartesianCoords(waisLatLon[0],waisLatLon[1],waisLatLon[2]));
    AwareMap.pulserCartArray.push(getCartesianCoords(ldbLatLon[0],ldbLatLon[1],ldbLatLon[2]));
    return AwareMap.pulserArray;
}


var R_EARTH=6.378137E6;
var GEOID_MAX=6.378137E6; // parameters of geoid model
var GEOID_MIN=6.356752E6;
var C_LIGHT=299792458; //meters
var FLATTENING_FACTOR=(1./298.257223563);

function getGeoid(theta) {
    var c=Math.cos(theta);
    return GEOID_MIN*GEOID_MAX/Math.sqrt(GEOID_MIN*GEOID_MIN-
					 (GEOID_MIN*GEOID_MIN-GEOID_MAX*GEOID_MAX)*c*c);    
}   ///<Returns the geoid radiuus as a function of theta (the polar angle?)
  
function getLat(theta) {      
    return (90.-(theta*180./Math.PI)); 
} ///< Converts polar angle to latitude
  
function getLon(phi){ 
    //Need to fix this somehow
    var phi_deg = phi*180./Math.PI;
    if (phi_deg>270)
	phi_deg-=360;	
    return (90.-phi_deg);
} ///< Converts a azimuthal angle to longitude

function getThetaFromLat(lat) {       
    return (90.- lat)*Math.PI/180.; 
} ///< Converts latitude to polar angle

function getPhiFromLon(lon){ 
    //Need to fix this somehow
    var phi_deg = 90. - lon;
    if(phi_deg<0) phi_deg+=360;
    return phi_deg*Math.PI/180.;
} ///<Converts longitude to azimuthal angle
  

function getCartesianCoords(lat, lon, alt)
{
    if(lat<0) lat*=-1;
    //Note that x and y are switched to conform with previous standards
    lat*=Math.PI/180.;
    lon*=Math.PI/180.;
    //calculate x,y,z coordinates
    var C2=Math.pow(Math.cos(lat)*Math.cos(lat)+(1-FLATTENING_FACTOR)*(1-FLATTENING_FACTOR)*Math.sin(lat)*Math.sin(lat),-0.5);
    var Q2=(1-FLATTENING_FACTOR)*(1-FLATTENING_FACTOR)*C2;
    var p = new Array();
    p[1]=(R_EARTH*C2+alt)*Math.cos(lat)*Math.cos(lon);
    p[0]=(R_EARTH*C2+alt)*Math.cos(lat)*Math.sin(lon);
    p[2]=(R_EARTH*Q2+alt)*Math.sin(lat);
    return p;
}

function getDistance(p1,p2)
{
    return Math.sqrt((p1[0]-p2[0])*(p1[0]-p2[0])+(p1[1]-p2[1])*(p1[1]-p2[1])+(p1[2]-p2[2])*(p1[2]-p2[2]));
}   
