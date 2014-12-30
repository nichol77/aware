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


function initialiseAwareMap() {
    $("#debugContainer").show();
    var docHeight=$(window).height();
    var docWidth=$(window).width();
    var heightPercentage=60;
    if(docWidth>=800) heightPercentage=80;
    var maxPlotHeight=Math.round((heightPercentage*docHeight)/100);
    $('#divMap-1').height(maxPlotHeight); 


    
    function handlePosSumFile(jsonObject) {
	var xyPoints = new Array();
	for(var i=0;i<jsonObject.poslist.length;i++) {
	    xyPoints.push(getXYFromLatLong(jsonObject.poslist[i].latitude,jsonObject.poslist[i].longitude));
	}
	actuallyDrawMap(xyPoints);
	
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

function actuallyDrawMap(xyPoints) {

    var data = [ 
    { data: [["antarcticaIceMap.png", -3000,-2500,+3000,+2500]],
      images: {show: true}, bars: {show: false}, points: {show: false}, lines: {show: false}},

    { data: xyPoints, 
      images: {show: false}, bars: {show: false}, points: {show: true}, lines: {show: false}}
    ];
    
   

    var options = {
	series: { images: { show: true } },
	xaxis: { min: -3000, max: 3000 },
	yaxis: { min: -2500, max: 2500 },
	lines: { show: true },
	grid: { hoverable: true, clickable: true },
	
    };
    
    var graph = $.plot.image.loadDataImages(data, options, function () {
						$.plot($("#divMap-1"), data, options);
					    });
    




}




function getXYFromLatLong(latitude, longitude) {       	
    var TrueScaleLat=71;
    var CentralMeridian=0;
    var RadiusOfEarth=6378.1; //Metres
    //    var xOffest=375;
    //    var yOffset=312.5;
    //    var scale=271.5/2.19496e+06;
    //Negative longitude is west
 //    //All latitudes assumed south
    var absLat=Math.abs(latitude);
    r=RadiusOfEarth*Math.cos((90.-TrueScaleLat)*Math.PI/180.)*Math.tan((90-absLat)*Math.PI/180);
    var y=r*Math.cos(longitude*Math.PI/180.);
    var x=r*Math.sin(longitude*Math.PI/180.);    
    return [x,y];
}





