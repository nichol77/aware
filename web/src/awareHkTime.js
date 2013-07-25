//////////////////////////////////////////////////////////////////////////////
/////                                                                    /////
/////   awareHkTime.js                                                   /////
/////                                                                    /////
/////   Simple javascript for getting housekeeping data in JSON format   /////
/////   and plotting using the flot library.                             /////
/////                                                                    /////
/////   March 2013, r.nichol@ucl.ac.uk                                   /////
//////////////////////////////////////////////////////////////////////////////



/* Globals, these shouldn't really be used in javascript... but hey ho there we go*/
var thisHkType;
var globCanName;
var thisTimeType;
var year=2013;
var datecode=123;
var timesWaited=0;
var startTime;
var duration;

var timeList;// = new Array();
var varList;
var datasets = new Object();
    
var timeArray=[];


///Here are the UI thingies
function setLastRun(thisRun) {
    document.getElementById("runInput").max=thisRun;
    document.getElementById("endRunInput").max=thisRun;
}


function getTimestampFromDateStringTimeString(dateString,timeString) {
    //    $('#debugContainer').append("<p>"+dateString+" -- "+timeString+"</p>");
    var year=dateString.split("/")[0];
    var month=dateString.split("/")[1]-1;
    var day=dateString.split("/")[2];
    var hour=timeString.split(":")[0];
    var minute=timeString.split(":")[1];
///< This hack is necessary to get round a Chrome feature which drops the seconds part
    var second=0;
    if(timeString.split(":")[2]>=0)    
	second=timeString.split(":")[2];
    var date = new Date(year,month,day,hour,minute,second,0);
    return (date.getTime()-date.getTimezoneOffset()*60*1000);
}


function getDateString(dateObj) {
    var dateString = dateObj.getUTCFullYear()+"/"+pad2(dateObj.getUTCMonth()+1)+"/"+pad2(dateObj.getUTCDate());
    return dateString;
}

function getTimeString(dateObj) {
    var timeString = pad2(dateObj.getUTCHours())+":"+pad2(dateObj.getUTCMinutes())+":"+pad2(dateObj.getUTCSeconds());
    return timeString;
}

function getXAutoScale() {
    return document.getElementById("xAutoScale").checked;
}

function setXMin(xmintimestamp) {   
    var date = new Date(xmintimestamp);//xmintimestamp);
    document.getElementById("xMinDateInput").value=getDateString(date);
    document.getElementById("xMinTimeInput").value=getTimeString(date);
}

function setXMax(xmaxtimestamp) {
    var date = new Date(xmaxtimestamp);
    document.getElementById("xMaxDateInput").value=getDateString(date);
    document.getElementById("xMaxTimeInput").value=getTimeString(date);
}

function getXMin() {   
    var dateString=document.getElementById("xMinDateInput").value;
    var timeString=document.getElementById("xMinTimeInput").value;
    return getTimestampFromDateStringTimeString(dateString,timeString);
}

function getXMax() {
    var dateString=document.getElementById("xMaxDateInput").value;
    var timeString=document.getElementById("xMaxTimeInput").value;
    return getTimestampFromDateStringTimeString(dateString,timeString);
}

function getYAutoScale() {
    return document.getElementById("yAutoScale").checked;
}

function setYMin(ymin) {
    document.getElementById("yMinInput").value=ymin;
}

function setYMax(ymax) {
    document.getElementById("yMaxInput").value=ymax;
}
    

function getYMin() {
    return document.getElementById("yMinInput").value;
}

function getYMax() {
    return document.getElementById("yMaxInput").value;
}
    

function getStartRunFromForm() {
    return document.getElementById("runInput").value;
} 

function setStartRunOnForm(thisRun) { 
    document.getElementById("runInput").value=thisRun;
	
} 

function getEndRunFromForm() {
    return document.getElementById("endRunInput").value;
} 


function setEndRunOnForm(thisRun) {
    document.getElementById("endRunInput").value=thisRun;

} 


function getInstrumentNameFromForm() {
    return document.getElementById("instrumentForm").value;
}

function getPlotLabelFromForm() {
    var elt = document.getElementById("plotForm");
    if(elt.selectedIndex==-1)
	return getPlotNameFromForm();
    return elt.options[elt.selectedIndex].text;
}


function getPlotNameFromForm() {
    return document.getElementById("plotForm").value;
}

function getMaxPointsToShow() {
    return document.getElementById("fullMaxForm").value;; //For now fix this will make it tuneable later
}


function setHkTypeAndCanName(hkType,canName,timeType) {
    thisHkType=hkType;
    globCanName=canName;
    thisTimeType=timeType;
}

function updateTimeType(timeType) {
    thisTimeType=timeType;
}

function updateTimeTypeFromForm() {
    thisTimeType=document.getElementById("timeForm").value;

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
    var maxPointsToShow=getMaxPointsToShow();

    var varTimeList=varPoint.timeList;

    for(var index=0;index<varTimeList.length;index++) {
	var timePoint=timeArray[index];
	var dataPoint=varTimeList[index];

	dataList.data.push([timePoint,dataPoint]); ///< No stdDev for full files
//	canContainer.append("{"+timeArray[index]+","+dataPoint+"},");
    }
//    canContainer.append("</p>");
    datasets[ varName ]=dataList;
}

function timeSortData(a,b) {
    return a[0]-b[0];
}

function numberSort(a,b) {
    return a - b;
}

function sortDataSets() {

    $.each(datasets, function(key, val) {
	       val.data.sort(timeSortData);
	   }
	   );
}


function getDataForPlot(fullDataset,xaxisMin,xaxisMax) {
    //Here the fullDataset has every single point, the return of this does not
    smallDataset = new Object();


    var maxPointsToShow=getMaxPointsToShow();
    var doZoom=0;
    if(xaxisMax>xaxisMin) doZoom=1;
    var firstTimeIndex=-1;
    var lastTimeIndex=-1;
    var fullTimePoints=new Array();
    var plotEvery=1;
    $.each(fullDataset, function(key, val) {
	       if(fullTimePoints.length==0) {
		   for(var index=0;index<val.data.length;index++) {
		       if(!doZoom || (val.data[index][0]>=xaxisMin && val.data[index][0]<=xaxisMax)) {
			   if(firstTimeIndex==-1) firstTimeIndex=index;
			   lastTimeIndex=index;
			   fullTimePoints.push(val.data[index][0]);
		       }
		   }
		   //		   canContainer.append("<p>doZoom="+doZoom+" "+firstTimeIndex+" "+lastTimeIndex+"</p>");
		   if(fullTimePoints.length>maxPointsToShow) {
		       //Need to do some data decimation
		       plotEvery=Math.ceil(fullTimePoints.length/maxPointsToShow);
		   }		   
	       }

	       var varName=key;
	       var dataList = new Object();
	       dataList.label=val.label;
	       if("color" in val) 
		   dataList.color=val.color;
	       if("points" in val)
		   dataList.points=val.points;
	       dataList.data= new Array();	       	       
	       for(var index=firstTimeIndex;index<=lastTimeIndex;index+=plotEvery) {		  
		   var timePoint=fullTimePoints[index-firstTimeIndex];
		   var dataPoint=val.data[index][1];
		   var stdDev=0;
		   if(plotEvery>1) {	    
		       var dp2=0;
		       var deltaT=0;
		       var count=1;
		       for(var index2=index+1;index2<index+plotEvery && index2<=lastTimeIndex;index2++) {
			   count++;
			   dataPoint+=val.data[index2][1];
			   deltaT+=(fullTimePoints[index2-firstTimeIndex]-fullTimePoints[index-firstTimeIndex]);
			   dp2+=(val.data[index2][1]*val.data[index2][1]);
		       }
		       dataPoint/=count;
		       deltaT/=count;
		       timePoint+=deltaT;
		       dp2/=count;
		       stdDev=Math.sqrt(dp2-dataPoint*dataPoint);
		   }	

		   dataList.data.push([timePoint,dataPoint,stdDev]); ///< No stdDev for full files
	       }
	       smallDataset[ varName ]=dataList; 
	       
	   }
	   );
    

    return smallDataset;
	       
    
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



//    canContainer.append("<p>In drawSimpleHkTime</p>");

    actuallyDrawTheStuff();
}


function actuallyDrawTheStuff() {
    //Step one is to time sort
    sortDataSets();

    var i = 0;
    var numPoints=0;
    $.each(datasets, function(key, val) {
	       numPoints=val.data.length;
	       val.color = i;
	       ++i;
	   });
    

    var canContainer = $("#titleContainer"); 
    if(numPoints>getMaxPointsToShow()) numPoints=getMaxPointsToShow();
    canContainer.append("<p>The plot shows "+numPoints+" of "+timeArray.length+" time points</p>");

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
	aware: {zoom:false},
	yaxis: { },
	xaxis: {mode: "time"},
	lines: { show: false },
	points: { show: true   },
	legend:{container: $("#divLabel")},
	selection : { mode : "xy" },
	canvas : true,
    }
    var plot;	

    function plotAccordingToChoices() {

	var data = [];
	var xmin=0;
	var xmax=0;

	if(!getXAutoScale() && !options.aware.zoom) {
	    options.xaxis.min=getXMin();
	    options.xaxis.max=getXMax();	    
	}	


	if(!getYAutoScale()) {
	    options.yaxis.min=getYMin();
	    options.yaxis.max=getYMax();	    
	}

	if("min" in options.xaxis) {
	    xmin=options.xaxis.min;
	    xmax=options.xaxis.max;
	}


	var smallData=getDataForPlot(datasets,xmin,xmax);
	


	choiceContainer.find("input:checked").each(function () {
	    var key = $(this).attr("name");
	    if (key && smallData[key]) {
		data.push(smallData[key]);
	    }
	});
	
	if (data.length > 0) {
	    plot=$.plot(plotCan, data, options);

	    var axes = plot.getAxes();
	    var realymin = axes.yaxis.min;
	    var realymax = axes.yaxis.max;
	    var realxmin = axes.xaxis.min;
	    var realxmax = axes.xaxis.max;
	    if(getYAutoScale()) {
		setYMin(realymin);
		setYMax(realymax);
	    }
	    if(getXAutoScale()) {
		setXMin(realxmin);
		setXMax(realxmax);		
	    }
	    

	}

    }
    
    var lastMin=0;
    var lastMax=0;
    
    plotCan.bind("plotselected", function (event, ranges) {
		     options.aware.zoom=true; 
		     options.xaxis.min=ranges.xaxis.from;
		     options.xaxis.max=ranges.xaxis.to;
		     options.yaxis.min=ranges.yaxis.from;
		     options.yaxis.max=ranges.yaxis.to;
		     //	canContainer.append("plotselected");
		     if(lastMin!=options.yaxis.min || lastMax!=options.yaxis.max) {
			 lastMin=options.yaxis.min;
	    lastMax=options.yaxis.max;	


	    plotAccordingToChoices();
	}
    });

    plotCan.bind("plotunselected", function (event, ranges) {
		     options.aware.zoom=false;
		     var newxaxis= { mode: "time"};
		     options.xaxis = newxaxis;
		     var newyaxis = {};
		     options.yaxis=newyaxis;
		     //	canContainer.append("plotunselected");
		     if(lastMin!=0 || lastMax!=0) {
			 lastMin=0;
	    lastMax=0;
	    plotAccordingToChoices();
	}
    });
	
  
    plotAccordingToChoices();


}


function setTimeAndVarList(jsonObject) {
    timeList=jsonObject.timeSum.timeList;
    varList=jsonObject.timeSum.varList;
}

function drawSimpleHkTimePlot() {
    getRunInstrumentDateAndPlot(simpleHkPlotDrawer);
}

function updatePlotTitle(jsonObject) {
    //Also update the page URL
    var currentUrl = [location.protocol, '//', location.host, location.pathname].join('');
    //    var currentUrl = window.location.href;
    currentUrl=currentUrl+"?run="+getStartRunFromForm()+"&endrun="+getEndRunFromForm()+"&instrument="+getInstrumentNameFromForm()+"&plot="+getPlotNameFromForm()+"&timeType="+thisTimeType+"&hkType="+thisHkType;
    var stateObj = { foo: "bar" };
    history.replaceState(stateObj, "page 2", currentUrl);

    var canContainer = $("#titleContainer"); 
    canContainer.empty();
    canContainer.append("<h1>"+getInstrumentNameFromForm()+" -- Run "+getStartRunFromForm()+"</h1>");
    canContainer.append("<h2> Start Time "+jsonObject.timeSum.startTime+"</h2>");
    canContainer.append("<h2> Plot "+getPlotLabelFromForm()+"</h2>");
    
}

function handleAjaxFileError(jqXHR, exception) {
    
    var canContainer = $("#titleContainer"); 
    if (jqXHR.status === 0) {
        canContainer.append('Not connect.\n Verify Network.');
    } else if (jqXHR.status == 404) {
        canContainer.append('Requested page not found. [404]');
    } else if (jqXHR.status == 500) {
        canContainer.append('Internal Server Error [500].');
    } else if (exception === 'parsererror') {
        canContainer.append('Requested JSON parse failed.');
    } else if (exception === 'timeout') {
        canContainer.append('Time out error.');
    } else if (exception === 'abort') {
            canContainer.append('Ajax request aborted.');
    } else {
        canContainer.append('Uncaught Error.\n' + jqXHR.responseText);
    }
}


function simpleHkPlotDrawer() {
    var simpleHkTimeUrl=getHkTimeName(getInstrumentNameFromForm(),getStartRunFromForm(),year,datecode,thisHkType);

    function handleHkTimeJsonFile(jsonObject) {
	//Preparation by emptying things and writing labels
	updatePlotTitle(jsonObject);
	datasets = new Object();	
	var choiceContainer = $("#choices");
	choiceContainer.empty();
	
	//Set the time and var list
	setTimeAndVarList(jsonObject);

	//Actual do the drawing
	drawSimpleHkTime(getPlotNameFromForm());
    }


    $.ajax({
	url: simpleHkTimeUrl,
	type: "GET",
	dataType: "json", 
	success: handleHkTimeJsonFile,
	error: handleAjaxError
    }); 
    
}


function drawFullHkTimePlot() {
    getRunInstrumentDateAndPlot(fullHkPlotDrawer);
}

function fullHkPlotDrawer() {
    var simpleHkTimeUrl=getHkTimeName(getInstrumentNameFromForm(),getStartRunFromForm(),year,datecode,thisHkType);

    function handleHkTimeJsonFile(jsonObject) {
	//Preparation by emptying things and writing labels
	updatePlotTitle(jsonObject);
	var choiceContainer = $("#choices");
	choiceContainer.empty();
	
	//Set the time and var list
	setTimeAndVarList(jsonObject);

	//Actual do the drawing
	fetchFullHkTime(getPlotNameFromForm());
    }

    $.ajax({
	url: simpleHkTimeUrl,
	type: "GET",
	dataType: "json",
	success: handleHkTimeJsonFile,
	error: handleAjaxError
    }); 
    
}


function fetchFullHkTime(varNameKey) {
    

//    var canContainer = $("#titleContainer"); 
    var fullHkTimeUrl=getFullHkTimeName(getInstrumentNameFromForm(),getStartRunFromForm(),year,datecode,thisHkType);
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
		var fullHkUrl=getFullHkName(getInstrumentNameFromForm(),getStartRunFromForm(),year,datecode,varName,thisHkType);
//		canContainer.append("<p>"+fullHkUrl+"</p>");	
		countFilesNeeded++;

		$.ajax({
		    url: fullHkUrl,
		    type: "GET",
		    dataType: "json",
		    success: handleFullHkJsonFile,
		    error: handleFullHkError
		}); 
	
	    }	
	}
    }

    var countFilesGot=0;
    function handleFullHkError() {
	countFilesGot++; ///For now will just do this silly thing	
	if(countFilesNeeded==countFilesGot) {

//	    var canContainer = $("#titleContainer"); 
//	    canContainer.append("<p>In handleFullHkError</p>");
	    actuallyDrawTheStuff();
	}
    }

    function handleFullHkJsonFile(jsonObject) { 
	countFilesGot++;
	addFullVariableToDataset(jsonObject);
//	canContainer.append("<p>"+countFilesNeeded+ "    "+countFilesGot+"</p>");	
	if(countFilesNeeded==countFilesGot) {
//	    var canContainer = $("#titleContainer"); 
//	    canContainer.append("<p>In handleFullHkJsonFile</p>");
	    actuallyDrawTheStuff();
	}
	
    }


    $.ajax({
	url: fullHkTimeUrl,
	type: "GET",
	dataType: "json",
	success: handleFullHkTimeJsonFile,
	error: handleAjaxError
    }); 
}


function getRunInstrumentDateAndPlot(plotFunc) {
    var startRun=getStartRunFromForm();
    var plotName=getPlotNameFromForm();    
    var instrumentName=getInstrumentNameFromForm();
    var runListFile=getRunListName(instrumentName,startRun);
    function handleRunList(jsonObject) {
	var gotRun=0;
	for(var i=0;i<jsonObject.runList.length;i++) {
	    if(jsonObject.runList[i][0]==startRun) {
		year=jsonObject.runList[i][1];
		datecode=jsonObject.runList[i][2]; ///RJN need to zero pad the string
		gotRun=1;
		plotFunc();
		break;
	    }
	}
	if(gotRun==0 ) {// && thisTimeType.indexOf("simple")>=0) {
	    var plotCan=$("#"+globCanName);
	    plotCan.empty();
	    plotCan.append("<h2>Don't have data for run "+startRun+"</h2>");
	}
	
    }
    

    $.ajax({
	url: runListFile,
	type: "GET",
	dataType: "json",
	success: handleRunList,
	error: handleAjaxError
    });
}


function doMultiRunPlot() {
    
    var plotName=getPlotNameFromForm();    
    var instrumentName=getInstrumentNameFromForm();
    var startRun=getStartRunFromForm();
    var endRun=getEndRunFromForm();
    if(endRun<=startRun) {
	return drawSimpleHkTimePlot();	
    }


    var lastRunListFile;

    var countFilesNeeded=0;
    for(var thisRun=startRun;thisRun<=endRun;thisRun++) {	
	var runListFile=getRunListName(instrumentName,thisRun);
	
	function handleRunList(jsonObject) {
	    for(var i=0;i<jsonObject.runList.length;i++) {
		if(jsonObject.runList[i][0]>=startRun && jsonObject.runList[i][0]<=endRun) {
		    year=jsonObject.runList[i][1];
		    datecode=jsonObject.runList[i][2]; ///RJN need to zero pad the string  	    
		    var hkFileName=getHkTimeName(instrumentName,jsonObject.runList[i][0],year,datecode,thisHkType);
		    countFilesNeeded++;		
	
		    $.ajax({
			url: hkFileName,
			type: "GET",
			dataType: "json",
			success: addHkTimeFileToArrays,
			error: errorHkTimeFile
		    });
		    //Get simple hk files
		    //Add to some arrays
		    //Fill variables for plot   		    
		}
	    }
	}
	if(runListFile!=lastRunListFile) {
//	    canContainer.append("<p>"+runListFile+"</p>");
	    $.ajax({
		url: runListFile,
		type: "GET",
		dataType: "json",
		success: handleRunList
	    });
	}
	lastRunListFile=runListFile;
    }

    var countFilesGot=0;
    function errorHkTimeFile() {
	countFilesGot++;
	if(countFilesNeeded==countFilesGot) {
	    //	    canContainer.append("<p>"+countFilesNeeded+"  "+countFilesGot+"</p>");

//	    var canContainer = $("#titleContainer"); 
//	    canContainer.append("<p>In errorHkTimeFile</p>");
	    actuallyDrawTheStuff();
	}
    }

    function addHkTimeFileToArrays(jsonObject) {
	countFilesGot++;
	if(countFilesGot==1) updatePlotTitle(jsonObject);
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

//	    var canContainer = $("#titleContainer"); 
//	    canContainer.append("<p>In addHkTimeFileToArrays</p>");
	    actuallyDrawTheStuff();
	}
    }

}





function drawPlot() {   
    timeArray.length=0;
    var plotCan=$("#"+globCanName);
    var choiceContainer = $("#choices");
    var labelContainer= $("#divLabel");
    var titleContainer=$("#titleContainer"); 
    titleContainer.empty();
    plotCan.empty();
    plotCan.append("<h2>Loading</h2>");
    choiceContainer.empty();
    labelContainer.empty();
    datasets = new Object();

    if(thisTimeType.indexOf("simple")>=0) drawSimpleHkTimePlot();
    else if(thisTimeType.indexOf("full")>=0) drawFullHkTimePlot();
    else if(thisTimeType.indexOf("multiRun")>=0) doMultiRunPlot();
    else if(thisTimeType.indexOf("timeRange")>=0) doMultiRunPlot();
	    
}

