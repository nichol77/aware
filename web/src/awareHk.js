//////////////////////////////////////////////////////////////////////////////
/////                                                                    /////
/////   awareHk.js                                                       /////
/////                                                                    /////
/////   Simple javascript for getting housekeeping data in JSON format   /////
/////   and plotting using the flot library.                             /////
/////                                                                    /////
/////   March 2013, r.nichol@ucl.ac.uk                                   /////
//////////////////////////////////////////////////////////////////////////////



/* Globals */
var instrumentName;
var runNumber;
var startTime;
var duration;

var dpList = new Array();

function drawHk(canName,varNameKey,colour) {
    var dataArray = [];
    var dataArrayErrors = [];
    var countData=0;
    for(var index=0;index<dpList.length;index++) {
	var dp2=dpList[index];
	var dpName=new String(dp2.name);
	var n=dpName.indexOf(varNameKey);
	if(n>=0) {
	    dataArray.push([countData,dp2.mean]);
	    dataArrayErrors.push(dp2.stdDev);
	    countData++;
	}
    }
    
    //    $.plot($("#"+canName), [ {data : dataArray, bars: { show: true }} ]);
    
    var data3_points = {
	//do not show points	
	radius: 0,
	errorbars: "y", 
	yerr: {show:true, upperCap: "-", lowerCap: "-", radius: 5}
    };
    

	
    for (var i = 0; i < dataArray.length; i++) {
	dataArrayErrors[i] = dataArray[i].concat(dataArrayErrors[i])
	    }
    
    var data = [
		// bars with errors
    {data: dataArray, color: colour, bars: {show: true, align: "center", barWidth: 1}},
    {data: dataArrayErrors, color: colour, lines: {show: false }, points: data3_points}
    ];

    $.plot($("#"+canName), data );



}




function drawL1Hk(canName) {    
    drawHk(canName,"singleChannelRate","orange");	
}



function drawThresholdHk(canName) {
    drawHk(canName,"singleChannelThreshold","green");
	
}


function setDpList(jsonObject) {
    dpList=jsonObject.runsum.varList;
}


 

function drawRunSummaryHkJSON(l1Name,threshName,instrument,run) {
    
    var dataurl=getHkName(instrument,run);

    function onDataReceived(jsonObject) {
	setDpList(jsonObject);
	drawL1Hk(l1Name);
	drawThresholdHk(threshName);
    }

    
    $.ajax({
	    url: dataurl,
		type: "GET",
		dataType: "json",
		success: onDataReceived
		}); 
}
