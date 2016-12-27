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
var theChart; //Global
var numPoints=0; //Global
var lastPlotted=0;
var numCalled=0;
var newData = [];



/**
 * Add points to the map and set timeout to do it again
 */
function addPointsToLap() {
    var seriesIndex=0;
    if(numPoints>=AwareMap.lapXYPoints[0].length) {
	if(numPoints-AwareMap.lapXYPoints[1].length) {
	    if(numPoints==AwareMap.lapXYPoints[0].length) {
		newData = [];
	    }

	    seriesIndex=1;
	    point=AwareMap.lapXYPoints[1][numPoints-AwareMap.lapXYPoints[0].length];
	}
	else 
	    return;
    }
    else {
	point=AwareMap.lapXYPoints[0][numPoints];
    }

    //    if($('#debugContainer').is(":visible"))
    //    	$('#debugContainer').append("<p>"+theChart.series[seriesIndex].data.length+"</p>");
    
    newData.push(point);


    // add the point
    theChart.series[seriesIndex].setData(newData);
    //    theChart.redraw()
    lastPlotted=numPoints;
    numPoints++;
    
    // call it again after one millisecond
    setTimeout(addPointsToLap, 1);    

}


function initialiseAwareMap() {
    $("#debugContainer").hide();
    var docHeight=$(window).height();
    var docWidth=$(window).width();
    var heightPercentage=60;
    if(docWidth>=800) heightPercentage=80;
    var maxPlotHeight=Math.round((heightPercentage*docHeight)/100);
    $('#divMap-1').height(maxPlotHeight); 
    $('#divMap-1').width(maxPlotHeight); 
    $("#mapRadio").buttonset();

    AwareMap.pulserPoints=getCalPulserPositionList();

    
    
    $('#runInput').change(function(e) {
	    e.stopPropagation();
	  
	  if($('#debugContainer').is(":visible"))
	      $('#debugContainer').append("<p>run input changed</p>");
	  //	  actuallyDrawMap();	  
	  reloadAndDraw();
       });
    
    $('select').on('change', function() {
	    reloadAndDraw();
	});

    $("input:radio[name=mapRadio]").click(function() { 
	    if($('#debugContainer').is(":visible"))
		$('#debugContainer').append("<p>color clicked... drawPlots</p>");
	    actuallyDrawMap();
	});

    $("input:radio[name=showRun]").click(function() {
	    if($('#debugContainer').is(":visible"))
                $('#debugContainer').append("<p>Show run clicked... drawPlots</p>");
	    //	    actuallyDrawMap();
	    reloadAndDraw();
        });


    $("input:radio[name=showAbove]").click(function() {
	    if($('#debugContainer').is(":visible"))
                $('#debugContainer').append("<p>Show above clicked... drawPlots</p>");
	    //	    actuallyDrawMap();
	    reloadAndDraw();
        });

    $("#checkboxPri-1, #checkboxPri-2, #checkboxPri-3, #checkboxPri-4, #checkboxPri-5, #checkboxPri-6, #checkboxPri-7, #checkboxPri-8, #checkboxPri-9").click(function(){
	    reloadAndDraw();
	});



    //    reloadAndDraw();

    setRunToLastRun();
}


function reloadAndDraw() {
   
    AwareMap.gotRunSourceMap=false;

    function handlePosSumFile(jsonObject) {
	AwareMap.object=jsonObject;
	AwareMap.lapXYPoints = new Array();

	AwareMap.lapXYPoints[0] = new Array(); // lap 1
	AwareMap.lapXYPoints[1] = new Array(); // lap 2
	AwareMap.lapXYPoints[2] = new Array(); // lap 3
	AwareMap.lapXYPoints[3] = new Array(); // lap 4
	
	AwareMap.lapIndex = new Array();
	AwareMap.lapIndex[0] = new Array();
	AwareMap.lapIndex[1] = new Array();
	AwareMap.lapIndex[2] = new Array();
	AwareMap.lapIndex[3] = new Array();
      

	var lapNum=0;

	for(var i=0;i<jsonObject.poslist.length;i++) {
	    if(jsonObject.poslist[i].run>324) 
		lapNum=2;	   
	    else if(jsonObject.poslist[i].run>169) 
		lapNum=1;	    
	    if(jsonObject.poslist[i].latitude<-70) {
		AwareMap.lapXYPoints[lapNum].push(getXYFromLatLong(jsonObject.poslist[i].latitude,jsonObject.poslist[i].longitude));
		AwareMap.lapIndex[lapNum].push(i);
	    }
	}
	if(true) {
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
    
    if($('#showRunYes').is(':checked')) { }
    if($('#showRunNo').is(':checked')) { 
	//	alert("no is checked"); 
	AwareMap.gotRunSourceMap=false;
	AwareMap.mapRunPoints=[];
	AwareMap.mapRunIndex=[];
	    //return;
	actuallyDrawMap();
	return;
    }

    AwareMap.showFakeTheta=false;
    if($('#showAboveYes').is(':checked')) {
	AwareMap.showFakeTheta=true;
    }

    var prisToShow = [false,false,false,false,false,false,false,false,false,false];
    for(var pri=1;pri<=9;pri++) {
	if($("#checkboxPri-"+pri).is(':checked')) prisToShow[pri]=true;
    }
    




   AwareMap.runNumber=getRunFromForm();




    if($('#debugContainer').is(":visible"))
	$('#debugContainer').append("<p>getRunSourceMap "+prisToShow+"</p>");


    function handleMapRunFile(jsonObject) {
		AwareMap.gotRunSourceMap=true;
		AwareMap.mapRun=jsonObject;
		AwareMap.mapRunPoints = new Array();
		AwareMap.mapRunIndex = new Array();		
		
	
		if($('#debugContainer').is(":visible"))
		    $('#debugContainer').append("<p>poslist "+jsonObject.poslist.length+"</p>");
		
		for(var i=0;i<jsonObject.poslist.length;i++) {
		   //		   if(jsonObject.poslist[i].priority<5)

		    if(jsonObject.poslist[i].fakeTheta && !AwareMap.showFakeTheta) continue;
		    
		    if(prisToShow[jsonObject.poslist[i].priority] ) {
			AwareMap.mapRunPoints.push(getXYFromLatLong(jsonObject.poslist[i].sourceLat,jsonObject.poslist[i].sourceLon));
			AwareMap.mapRunIndex.push(i);
		    }
		}
		if($('#debugContainer').is(":visible"))
		    $('#debugContainer').append("<p>mapRunPoints "+AwareMap.mapRunPoints.length+"</p>");

		actuallyDrawMap();	
    }


    mapRunUrl="output/ANITA4/map/mapRun"+AwareMap.runNumber+".json";
       

    if($('#debugContainer').is(":visible"))
	$('#debugContainer').append("<p>mapRunUrl "+mapRunUrl+"</p>");

    $.ajax({
	url: mapRunUrl,
	type: "GET",
	dataType: "json",
	success: handleMapRunFile,
	error: handleAjaxError
    });


}



function actuallyDrawMap() {
    AwareMap.pngName=getBackgroundImageName();
    AwareMap.xMin=-3333.5;
    AwareMap.xMax=+3333.5;
    AwareMap.yMin=-3333.5;
    AwareMap.yMax=+3333.5;

    

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
    

    var highchartsObj = {
        chart: {
            type: 'line',
            plotBackgroundImage: AwareMap.pngName,
	    renderTo: 'divMap-1',
	    zoomType:'xy',
	    animation:false
        },
	title:{
	    text:''
	},
	subTitle:{
	    text:''
	},
	xAxis: { min: AwareMap.xMin, 
		 max: AwareMap.xMax, 
		 lineWidth: 0,
		 minorGridLineWidth: 0,
		 lineColor: 'transparent',
		 labels: {
		enabled: false
	    },
		 minorTickLength: 0,
		 tickLength: 0 },
	yAxis: { min: AwareMap.yMin, 
		 max: AwareMap.yMax, 
		 lineWidth: 0,
		 minorGridLineWidth: 0,
		 lineColor: 'transparent',
		 gridLineColor: 'transparent',
		 labels: {
		enabled: false
	    },
		 minorTickLength: 0,
		 tickLength: 0,
		 title: {
		text:null
	    }},
	legend: {
            enabled: false
        }, 
	plotOptions: {
            series: {
                animation: {
                    duration: 0
                }
            }
        },
	tooltip: { enabled: false},
		plotOptions: {
		    series: {
			states: {
			    hover: {
				enabled: false
			    }
			}
		    }
		}
    };


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
	selection: {mode: "xy"},
	colors: [ 'black','red','orange','green','blue','black','purple']
	
    };

	
    for(var lap=0;lap<AwareMap.lapXYPoints.length;lap++) {	
    	for(var i=0;i<AwareMap.lapXYPoints[lap].length;i++) {	    
    	    data[lap].data.push(AwareMap.lapXYPoints[lap][i]);
    	}
    }



    highchartsObj.series=data;
   
    
    function doPlot() {
	var graph = $.plot.image.loadDataImages(data, options, function () {
	    $.plot(mapPlotCan, data, options);
	})
    }

	
    mapPlotCan.bind("plothover", function (event, pos, item) {		
    	if (item) {	   
	    //	    if($('#debugContainer').is(":visible"))
	    //		$('#debugContainer').append("<p>item"+item.seriesIndex+"drawPlots</p>");
	    

	    
	    if(item.seriesIndex<4) {		
		var index = AwareMap.lapIndex[item.seriesIndex-1][item.dataIndex];

    		var d = new Date(AwareMap.object.poslist[index].unixTime*1000);
		var cartCos=getCartesianCoords(AwareMap.object.poslist[index].latitude,
					       AwareMap.object.poslist[index].longitude,
					       AwareMap.object.poslist[index].altitude);

		var pulserDist = new Array();
		pulserDist[0]=getDistance(cartCos,AwareMap.pulserCartArray[0]); //m
 		pulserDist[1]=getDistance(cartCos,AwareMap.pulserCartArray[1]); //m
 		pulserDist[2]=getDistance(cartCos,AwareMap.pulserCartArray[2]); //m
		// 		pulserDist[3]=getDistance(cartCos,AwareMap.pulserCartArray[3]); //m
		var minPulser=0;
		if(pulserDist[1]<pulserDist[0]) minPulser=1;
		if(pulserDist[2]<pulserDist[1] && pulserDist[2]<pulserDist[0]) minPulser=2;
		//		if(pulserDist[3]<pulserDist[2] && pulserDist[3]<pulserDist[1] && pulserDist[3]<pulserDist[0]) minPulser=3;

		var pulserTime=new Array();
		for(var i=0;i<pulserDist.length;i++) {
		    pulserTime[i]=1e9*(pulserDist[i]/C_LIGHT);
		    pulserDist[i]/=1000;
		}


    		$("#divMapInfo").html("<ul>"
				      //				      +"<li>item"+item.seriesIndex+"drawPlots</li>"
   				      +"<li>Date: "+d.toUTCString()+"</li>"
    				      +"<li>Run: "+AwareMap.object.poslist[index].run+"</li>"
    				      +"<li>Event: "+AwareMap.object.poslist[index].eventNumber+"</li>"
    				      +"<li>Rate: "+AwareMap.object.poslist[index].eventRate+"Hz.</li>"
    				      +"<li>"+AwareMap.pulserNames[minPulser]+"</li>"
				      +"<ul><li>Dist = "+pulserDist[minPulser].toFixed(2)+"km</li>"
				      +"<li>Time = "+pulserTime[minPulser].toFixed(0)+"ns</li>"
    				      +"</ul>");		
	    }
	    else if(item.seriesIndex==5) {
		$("#divMapInfo").html("<ul>"				      
				      //				      +"<li>item"+item.seriesIndex+"drawPlots</li>"
				      +"<li>Pulser: "+AwareMap.pulserNames[item.dataIndex]+"</li></ul>");
	    }
	    else if(item.seriesIndex==6) {
	       var mapIndex=AwareMap.mapRunIndex[item.dataIndex];
	       var d = new Date(AwareMap.mapRun.poslist[mapIndex].unixTime*1000);
	       $("#divMapInfo").html("<ul>"    				     
				     //				     +"<li>item"+item.seriesIndex+"drawPlots</li>"
				     +"<li>Date: "+d.toUTCString()+"</li>"
				     +"<li>Run: "+AwareMap.mapRun.poslist[mapIndex].run+"</li>"
				     +"<li>Event: "+AwareMap.mapRun.poslist[mapIndex].eventNumber+"</li>"
				     +"<li>Trigger Time: "+AwareMap.mapRun.poslist[mapIndex].triggerTimeNs+"ns</li>"
				     +"<li>Priority: "+AwareMap.mapRun.poslist[mapIndex].priority+"</li>"
				     +"<li>Source Latitude: "+AwareMap.mapRun.poslist[mapIndex].sourceLat+"</li>"
				     +"<li>Source Longitude: "+AwareMap.mapRun.poslist[mapIndex].sourceLon+"</li>"
				     +"<li>Heading: "+AwareMap.mapRun.poslist[mapIndex].heading+"</li>"
				     +"<li>Peak Phi: "+AwareMap.mapRun.poslist[mapIndex].phiWave*(180/Math.PI)+"</li>"
				     +"<li>Peak Theta: "+AwareMap.mapRun.poslist[mapIndex].thetaWave*(180/Math.PI)+"</li>"
				     +"<li>Fake Theta: "+AwareMap.mapRun.poslist[mapIndex].fakeTheta+"</li>"
				     +"</ul>");
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
    //    var hicalLatLon=[-78.9914,+141.048,37000];
    var hicalLatLon=[-79+(44.25/60),+87+(42.92/60),36000];
    var hical2LatLon=[-77+(52.65/60.), +117+(3.18/60.),35000];
    AwareMap.pulserNames=["Siple Dome","WAIS","LDB","HiCal1","HiCal2"];    
    AwareMap.pulserArray=new Array();
    AwareMap.pulserArray.push(getXYFromLatLong(sipleDomeLatLon[0],sipleDomeLatLon[1]));
    AwareMap.pulserArray.push(getXYFromLatLong(waisLatLon[0],waisLatLon[1]));
    AwareMap.pulserArray.push(getXYFromLatLong(ldbLatLon[0],ldbLatLon[1]));
    //    AwareMap.pulserArray.push(getXYFromLatLong(hicalLatLon[0],hicalLatLon[1]));
    //    AwareMap.pulserArray.push(getXYFromLatLong(hical2LatLon[0],hical2LatLon[1]));
    AwareMap.pulserCartArray=new Array();
    AwareMap.pulserCartArray.push(getCartesianCoords(sipleDomeLatLon[0],sipleDomeLatLon[1],sipleDomeLatLon[2]));
    AwareMap.pulserCartArray.push(getCartesianCoords(waisLatLon[0],waisLatLon[1],waisLatLon[2]));
    AwareMap.pulserCartArray.push(getCartesianCoords(ldbLatLon[0],ldbLatLon[1],ldbLatLon[2]));
    //    AwareMap.pulserCartArray.push(getCartesianCoords(hicalLatLon[0],hicalLatLon[1],hicalLatLon[2]));
    //    AwareMap.pulserCartArray.push(getCartesianCoords(hical2LatLon[0],hical2LatLon[1],hical2LatLon[2]));
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




/**
 * The UI interface function that gets the run from the runInput form.
 * @returns {number}
 */
function getRunFromForm() {
    return document.getElementById("runInput").value;
    //    return AwareEvent.runNumber;
} 

function getBackgroundImageName() {
    var mapType=document.getElementById("bedmapType").value;
    var mapSize=document.getElementById("bedmapSize").value;
    var pngName="antarctica"+mapType+mapSize+".png"
	//    $('#debugContainer').append("<p>"+pngName+"</p>");
    return pngName;
}


/**
 * The UI interface function that sets the run on the runInput form.
 */
function setRunOnForm(thisRun) {
    document.getElementById("runInput").value=thisRun;
} 


/**
 * The UI interface function that sets the maximum run on the runInput form.
 */
function setLastRun(thisRun) {
    document.getElementById("runInput").max=thisRun;
}    

function setRunToLastRun(){
    if($('#debugContainer').is(":visible"))
        $('#debugContainer').append("<p>setRunToLastRun</p>");

    var tempString="output/ANITA4/lastRun";
    function actuallyUpdateLastRun(runString) {
        $('#debugContainer').append("<p>setRunToLastRun "+runString+"</p>");
        setRunOnForm(Number(runString));
	reloadAndDraw();
    }

    $.ajax({
            url: tempString,
                type: "GET",
                dataType: "text",
                success: actuallyUpdateLastRun
                });

}
