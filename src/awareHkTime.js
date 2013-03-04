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
var thisHkType;
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

function setHkTypeAndCanName(hkType,canName) {
    thisHkType=hkType;
    globCanName=canName;
}


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


function drawSimpleHkTime(varNameKey) {
    for(var index=0;index<timeList.length;index++) {
	var timePoint=timeList[index];
	timeArray.push(timePoint.startTime*1000); ///< Javascript needs the number in milliseconds
    }

    
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

    actuallyDrawTheStuff();
}


function actuallyDrawTheStuff() {
    var i = 0;
    $.each(datasets, function(key, val) {
	val.color = i;
//	var point={ show: true, radius: 0,  errorbars: "y", yerr: {show:true}  }
//	val.points = point;
	++i;
    });
    
    var canContainer = $("#titleContainer"); 

    var plotCan=$("#"+globCanName);
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



function getStationNameFromForm() {
    stationName=document.getElementById("stationForm").value;
    return stationName;
}

function getPlotNameFromForm() {
    var plotName=document.getElementById("plotForm").value;
    return plotName;
}

function drawSimpleHkTimePlot() {
    getRunStationDateAndPlot(simpleHkPlotDrawer);
}


function simpleHkPlotDrawer() {
    var simpleHkTimeUrl=getHkTimeName(stationName,runNumber,year,datecode,thisHkType);

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
	drawSimpleHkTime(plotName);
    }

    $.ajax({
	url: simpleHkTimeUrl,
	type: "GET",
	dataType: "json",
	success: handleHkTimeJsonFile
    }); 
    
}

function defaultFullHkTimePlot() {
    getRunStationDateAndPlot(fullHkPlotDrawer);
}


function drawFullHkTimePlot() {
    getRunStationDateAndPlot(fullHkPlotDrawer);
}

function fullHkPlotDrawer() {
    var simpleHkTimeUrl=getHkTimeName(stationName,runNumber,year,datecode,thisHkType);

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
	fetchFullHkTime(plotName);
    }

    $.ajax({
	url: simpleHkTimeUrl,
	type: "GET",
	dataType: "json",
	success: handleHkTimeJsonFile
    }); 
    
}


function fetchFullHkTime(varNameKey) {
    

//    var canContainer = $("#titleContainer"); 
    var fullHkTimeUrl=getFullHkTimeName(stationName,runNumber,year,datecode,thisHkType);
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
		var fullHkUrl=getFullHkName(stationName,runNumber,year,datecode,varName,thisHkType);
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
	    actuallyDrawTheStuff();
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
    plotName=getPlotNameFromForm();    
    stationName=getStationNameFromForm();
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



//Here are the plots that use the date selector

function drawDateHkTimePlot() {
    getRunListFromDateAndPlot(dateHkPlotDrawer);
}

function dateHkPlotDrawer() {
    
}



function getRunListFromDateAndPlot(plotFunc) {

    plotName=getPlotNameFromForm();    
    stationName=getStationNameFromForm();
    var dateString=document.getElementById("datepicker").value;
    var firstSlash=dateString.indexOf("/");
    var monthString=dateString.substring(0,dateString.indexOf("/"));
    var dayString=dateString.substring(dateString.indexOf("/")+1,dateString.lastIndexOf("/"));
    var yearString=dateString.substring(dateString.lastIndexOf("/")+1);
    var realDateCode=monthString+dayString;
    datecode=parseInt(realDateCode);
    year=parseInt(yearString);
    var dateRunListUrl=getDateRunListName(stationName,year,datecode);


    var canContainer = $("#titleContainer"); 

    var countFilesNeeded=0;
    function handleDateRunList(jsonObject) {
	
	canContainer.empty();
	canContainer.append("<h1>"+stationName+" -- Date "+dayString+"/"+monthString+"/"+year+"</h1>");
	canContainer.append("<h2> Plot "+plotName+"</h2>");
	datasets = new Object();	
	timeArray = new Array();
	var choiceContainer = $("#choices");
	choiceContainer.empty();
	
	
	for(var i=0;i<jsonObject.runList.length;i++) {
	    var runNumber=jsonObject.runList[i];
	    var hkFileName=getHkTimeName(stationName,runNumber,year,datecode,thisHkType);
	    //	    canContainer.append("<p>"+hkFileName+" "+countFilesNeeded+"</p>");
	    countFilesNeeded++;
	    
	    

	    $.ajax({
		    url: hkFileName,
			type: "GET",
			dataType: "json",
			success: addHkTimeFileToArrays
			});
	    //Get simple hk files
	    //Add to some arrays
	    //Fill variables for plot
    
	}
    }
    //		plotFunc();
    
    
    $.ajax({
	    url: dateRunListUrl,
		type: "GET",
		dataType: "json",
		success: handleDateRunList
		});
    

    var countFilesGot=0;
    function addHkTimeFileToArrays(jsonObject) {
	countFilesGot++;
	var varNameKey=plotName;
	var timeList=jsonObject.timeSum.timeList;
	var tempTimeArray = new Array();
	var varList=jsonObject.timeSum.varList;
	for(var index=0;index<timeList.length;index++) {
	    var timePoint=timeList[index];
	    timeArray.push(timePoint.startTime*1000); ///< Javascript needs the number in milliseconds
	    tempTimeArray.push(timePoint.startTime*1000); ///< Javascript needs the number in milliseconds
	    //	    canContainer.append("<p>"+timeArray[timeArray.length-1]+"</p>")
	}

	//	canContainer.append("<p>"+countFilesGot+"</p>");
	//	canContainer.append("<p>"+timeArray.length+" "+tempTimeArray.length+"</p>");

	
	for(var varIndex=0;varIndex<varList.length;varIndex++) {
	    var varPoint=varList[varIndex];
	    var varName = new String(varPoint.name);
	    var varLabel = new String(varPoint.label);
	    //	document.write(varName+"<br>");
	    if(varName.indexOf(varNameKey)>=0) {
		if(varName in datasets) {
		//		canContainer.append("<p>Got"+varName+"</p>");
		}
		else {
		    //	    document.write(varNameKey);
		    ///Got a variable
		    var dataSetsIndex=$.inArray(varName, datasets);
		    //		canContainer.append("<p>Not got"+varName+"</p>");
		    if(dataSetsIndex<0) {
			
			var dataList = new Object();
			dataList.label=varLabel;
			dataList.data= new Array();
			
			
			datasets[varName]=dataList;
		    }
		}
	    
		var varTimeList=varPoint.timeList;	    
		for(var index=0;index<varTimeList.length;index++) {
		    var dataPoint=varTimeList[index];
		    datasets[varName].data.push([tempTimeArray[index],dataPoint.mean,dataPoint.stdDev]); ///< Need to add stdDev 
		    //		    canContainer.append("<p>"+index+" "+tempTimeArray[index]+" "+dataPoint.mean+"</p>");
		}
	    
	    //	    canContainer.append("<p>"+varName+" "+datasets[varName].data.length+" "+timeList.length+"</p>");
	    
	    }
	}
	
	if(countFilesNeeded==countFilesGot) {
	    //	    canContainer.append("<p>"+countFilesNeeded+"  "+countFilesGot+"</p>");
	    actuallyDrawTheStuff();
	}
    }

}