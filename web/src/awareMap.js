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


    AwareMap.pulserPoints=getCalPulserPositionList();

    $("input:radio[name=mapRadio]").click(function() { 
        if($('#debugContainer').is(":visible"))
	    $('#debugContainer').append("<p>color clicked... drawPlots</p>");
	actuallyDrawMap();
    });

    
    function handlePosSumFile(jsonObject) {
	AwareMap.object=jsonObject;
	AwareMap.xyPoints = new Array();
	for(var i=0;i<jsonObject.poslist.length;i++) {
	    AwareMap.xyPoints.push(getXYFromLatLong(jsonObject.poslist[i].latitude,jsonObject.poslist[i].longitude));
	}
	actuallyDrawMap();
	
    }

    posSumUrl="output/ANITA3/map/posSum.json";
       
    $.ajax({
	url: posSumUrl,
	type: "GET",
	dataType: "json",
	success: handlePosSumFile,
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
	  images: {show: true}, bars: {show: false}, points: {show: false}, lines: {show: false}},	
	{ data: AwareMap.xyPoints, 
	  images: {show: false}, bars: {show: false}, points: {show: true}, lines: {show: false}},
	{ data: AwareMap.pulserPoints, 
	  images: {show: false}, bars: {show: false}, points: {show: true, symbol:"cross"}, lines: {show: false}}
    ];
    
   

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

	    if(item.seriesIndex==1) {		
    		var d = new Date(AwareMap.object.poslist[item.dataIndex].unixTime*1000);	    
    		$("#divMapInfo").html("<ul>"
    				      +"<li>Date: "+d.toUTCString()+"</li>"
    				      +"<li>Run: "+AwareMap.object.poslist[item.dataIndex].run+"</li>"
    				      +"<li>Event: "+AwareMap.object.poslist[item.dataIndex].eventNumber+"</li>"
    				      +"<li>Rate: "+AwareMap.object.poslist[item.dataIndex].eventRate+"</li>"
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
    var RadiusOfEarth=6378.1; //Metres
    //Negative longitude is west
 //    //All latitudes assumed south
    var absLat=Math.abs(latitude);
    r=RadiusOfEarth*Math.cos((90.-TrueScaleLat)*Math.PI/180.)*Math.tan((90-absLat)*Math.PI/180);
    var y=r*Math.cos(longitude*Math.PI/180.);
    var x=r*Math.sin(longitude*Math.PI/180.);    
    return [x,y];
}



function getCalPulserPositionList() {
    var sipleDomeLatLon=[-81.65232,-149.00016];
    var waisLatLon=[-79.46562,-112.1125];
    AwareMap.pulserNames=["Siple Dome","WAIS"];

    var pulserArray=new Array();
    pulserArray.push(getXYFromLatLong(sipleDomeLatLon[0],sipleDomeLatLon[1]));
    pulserArray.push(getXYFromLatLong(waisLatLon[0],waisLatLon[1]));
    return pulserArray;
}

