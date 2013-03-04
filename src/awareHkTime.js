//////////////////////////////////////////////////////////////////////////////
/////                                                                    /////
/////   awareHkTime.js                                                   /////
/////                                                                    /////
/////   Simple javascript for getting housekeeping data in JSON format   /////
/////   and plotting using the flot library.                             /////
/////                                                                    /////
/////   March 2013, r.nichol@ucl.ac.uk                                   /////
//////////////////////////////////////////////////////////////////////////////



/* Globals */
var globCanName;
var stationName;
var runNumber;
var year=2013;
var datecode=123;
var timesWaited=0;
var setDatecode=0;
var plotName;
var startTime;
var duration;

var timeList;// = new Array();
var varList;
var datasets = new Object();
    
var timeArray=[];

function fillFullTimeArray(jsonObject) {
    for(var index=0;index<jsonObject.full.timeList.length;index++) {
	var timePoint=jsonObject.full.timeList[index];
	timeArray.push(timePoint*1000); ///< Javascript needs the number in milliseconds
    }
}

function addFullVariableToDataset(jsonObject) {
    
//    var canContainer = $("#titleContainer"); 

    var varPoint=jsonObject.full;
    var varName=varPoint.name;
    var dataList = new Object();
    dataList.label=varPoint.label;
    dataList.data= new Array();

//    canContainer.append("<p>");
    var varTimeList=varPoint.timeList;	    
    for(var index=0;index<varTimeList.length;index++) {
	var dataPoint=varTimeList[index];
	dataList.data.push([timeArray[index],dataPoint,0]); ///< No stdDev for full files
//	canContainer.append("{"+timeArray[index]+","+dataPoint+"},");
    }
//    canContainer.append("</p>");
    datasets[ varName ]=dataList;

}


function drawSimpleHkTime(canName,varNameKey) {
    for(var index=0;index<timeList.length;index++) {
	var timePoint=timeList[index];
	timeArray.push(timePoint.startTime*1000); ///< Javascript needs the number in milliseconds
    }

    //    document.write(timeArray.length+"<br>");
    //    document.write(varList.length+"<br>");

    
    for(var varIndex=0;varIndex<varList.length;varIndex++) {
	var varPoint=varList[varIndex];
	var varName = new String(varPoint.name);
	var varLabel = new String(varPoint.label);
	//	document.write(varName+"<br>");
	if(varName.indexOf(varNameKey)>=0) {
	    //	    document.write(varNameKey);
	    ///Got a variable
	    var dataList = new Object();
	    dataList.label=varLabel;
	    dataList.data= new Array();
	    
	    var varTimeList=varPoint.timeList;	    
	    for(var index=0;index<varTimeList.length;index++) {
		var dataPoint=varTimeList[index];
		dataList.data.push([timeArray[index],dataPoint.mean,dataPoint.stdDev]); ///< Need to add stdDev
	    }
	    datasets[ varName ]=dataList;
	}
	
    }

    actuallyDrawTheStuff(canName);
}


function actuallyDrawTheStuff(canName) {
    var i = 0;
    $.each(datasets, function(key, val) {
	val.color = i;
//	var point={ show: true, radius: 0,  errorbars: "y", yerr: {show:true}  }
//	val.points = point;
	++i;
    });
    
    var plotCan=$("#"+canName);
    // insert checkboxes 
    var countNum=0;
    var choiceContainer = $("#choices");
    $.each(datasets, function(key, val) {
	if(countNum%4==0) {
	    choiceContainer.append("<br />");
	}
	choiceContainer.append("<input type='checkbox' name='" + key +
			       "' checked='checked' id='id" + key + "'></input>" +
			       "<label for='id" + key + "'>"
			       + val.label + "</label>");
	countNum++;
	   });

    choiceContainer.find("input").click(plotAccordingToChoices);

    var options = {
	yaxis: { },
	xaxis: {mode: "time"},
	lines: { show: true },
	legend:{container: $("#divLabel")},
	selection : { mode : "xy" }
    }
    var plot;	

    function plotAccordingToChoices() {

	var data = [];

	choiceContainer.find("input:checked").each(function () {
	    var key = $(this).attr("name");
	    if (key && datasets[key]) {
		data.push(datasets[key]);
	    }
	});
	
	if (data.length > 0) {
	    plot=$.plot(plotCan, data, options);
	}

    }
    
    
    plotCan.bind("plotselected", function (event, ranges) {
	options.xaxis.min=ranges.xaxis.from;
	options.xaxis.max=ranges.xaxis.to;
	options.yaxis.min=ranges.yaxis.from;
	options.yaxis.max=ranges.yaxis.to;
	plotAccordingToChoices();
    });

    plotCan.bind("plotunselected", function (event, ranges) {
	var newxaxis= { mode: "time"};
	options.xaxis = newxaxis;
	var newyaxis = {};
	options.yaxis=newyaxis;
	plotAccordingToChoices();
    });
	
  

    plotAccordingToChoices();


}


function setTimeAndVarList(jsonObject) {
    timeList=jsonObject.timeSum.timeList;
    varList=jsonObject.timeSum.varList;
}

///Here are the UI thingies
function getRunFromForm() {
    runNumber=document.getElementById("runInput").value;
    return runNumber;
} 

function getNextRun(nextFunction) {
    runNumber=document.getElementById("runInput").value;
    runNumber++;
    document.getElementById("runInput").value=runNumber;
    nextFunction();
}

function getPreviousRun(nextFunction) {
    runNumber=document.getElementById("runInput").value;
    runNumber--;
    document.getElementById("runInput").value=runNumber;
    nextFunction();
}



function getPlotNameFromForm() {
    var plotName=document.getElementById("plotForm").value;
    return plotName;
}


function defaultSimpleHkTimePlot() {
    globCanName='divTime';    
    getRunStationDateAndPlot(simpleHkPlotDrawer);
}


function drawSimpleHkTimePlot(canName) {
    globCanName=canName;
    getRunStationDateAndPlot(simpleHkPlotDrawer);
}


function simpleHkPlotDrawer() {
    var simpleHkTimeUrl=getHkTimeName(stationName,runNumber,year,datecode);

    function handleHkTimeJsonFile(jsonObject) {
	//Preparation by emptying things and writing labels
	var canContainer = $("#titleContainer"); 
	canContainer.empty();
	canContainer.append("<h1>"+stationName+" -- Run "+runNumber+"</h1>");
	canContainer.append("<h2> Start Time "+jsonObject.timeSum.startTime+"</h2>");
	canContainer.append("<h2> Plot "+plotName+"</h2>");
	datasets = new Object();	
	var choiceContainer = $("#choices");
	choiceContainer.empty();
	
	//Set the time and var list
	setTimeAndVarList(jsonObject);

	//Actual do the drawing
	drawSimpleHkTime(globCanName,plotName);
    }

    $.ajax({
	url: simpleHkTimeUrl,
	type: "GET",
	dataType: "json",
	success: handleHkTimeJsonFile
    }); 
    
}

function defaultFullHkTimePlot() {
    globCanName='divTime';    
    getRunStationDateAndPlot(fullHkPlotDrawer);
}


function drawFullHkTimePlot(canName) {
    globCanName=canName;
    getRunStationDateAndPlot(fullHkPlotDrawer);
}

function fullHkPlotDrawer() {
    var simpleHkTimeUrl=getHkTimeName(stationName,runNumber,year,datecode);

    function handleHkTimeJsonFile(jsonObject) {
	//Preparation by emptying things and writing labels
	var canContainer = $("#titleContainer"); 
	canContainer.empty();
	canContainer.append("<h1>"+stationName+" -- Run "+runNumber+"</h1>");
	canContainer.append("<h2> Start Time "+jsonObject.timeSum.startTime+"</h2>");
	canContainer.append("<h2> Plot "+plotName+"</h2>");
	canContainer.append("<h2>  "+year+" "+datecode+"</h2>");
	datasets = new Object();	
	var choiceContainer = $("#choices");
	choiceContainer.empty();
	
	//Set the time and var list
	setTimeAndVarList(jsonObject);

	//Actual do the drawing
	fetchFullHkTime(globCanName,plotName);
    }

    $.ajax({
	url: simpleHkTimeUrl,
	type: "GET",
	dataType: "json",
	success: handleHkTimeJsonFile
    }); 
    
}


function fetchFullHkTime(canName,varNameKey) {
    

//    var canContainer = $("#titleContainer"); 
    var fullHkTimeUrl=getFullHkTimeName(stationName,runNumber,year,datecode);
//    canContainer.append("<p>"+fullHkTimeUrl+"</p>");
    

    var countFilesNeeded=0;
    function handleFullHkTimeJsonFile(jsonObject) { 
	///First step is fill the full time list
	fillFullTimeArray(jsonObject);
//	canContainer.append("<p>"+timeArray.length+"</p>");

	for(var varIndex=0;varIndex<varList.length;varIndex++) {
	    var varPoint=varList[varIndex];
	    var varName = new String(varPoint.name);
	    var varLabel = new String(varPoint.label);
	    if(varName.indexOf(varNameKey)>=0) {
		var fullHkUrl=getFullHkName(stationName,runNumber,year,datecode,varName);
//		canContainer.append("<p>"+fullHkUrl+"</p>");	
		countFilesNeeded++;

		$.ajax({
		    url: fullHkUrl,
		    type: "GET",
		    dataType: "json",
		    success: handleFullHkJsonFile
		}); 
	
	    }	
	}
    }

    var countFilesGot=0;
    function handleFullHkJsonFile(jsonObject) { 
	countFilesGot++;
	addFullVariableToDataset(jsonObject);
//	canContainer.append("<p>"+countFilesNeeded+ "    "+countFilesGot+"</p>");	
	if(countFilesNeeded==countFilesGot) {
	    actuallyDrawTheStuff(canName);
	}
	
    }


    $.ajax({
	url: fullHkTimeUrl,
	type: "GET",
	dataType: "json",
	success: handleFullHkTimeJsonFile
    }); 
}


function getRunStationDateAndPlot(plotFunc) {
    setDatecode=0;
    runNumber=getRunFromForm();
    plotName=getPlotNameFromForm();    stationName="STATION1B";
    //var canContainer = $("#leftbar"); 
    var runListFile=getRunListName(stationName,runNumber);
    function handleRunList(jsonObject) {
//	canContainer.append("<p>"+jsonObject.runList.length+"</p>");
	for(var i=0;i<jsonObject.runList.length;i++) {
	    if(jsonObject.runList[i][0]==runNumber) {
		year=jsonObject.runList[i][1];
		datecode=jsonObject.runList[i][2]; ///RJN need to zero pad the string
//		canContainer.append("<p>"+year+" "+datecode+"</p>");	
		setDatecode=1;
		plotFunc();
		break;
	    }
	}
    }
    

    $.ajax({
	url: runListFile,
	type: "GET",
	dataType: "json",
	success: handleRunList
    });

}

