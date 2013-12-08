/**
 * A simple javascript module for displaying waveform event data using the Flot library
 * @file awareEvent.js
 * @author Ryan Nichol <r.nichol@ucl.ac.uk>
 */




/**
 * The AwareEvent namespace
 * @namespace
 */
var AwareEvent = {};

AwareEvent.eventList;
AwareEvent.gotEventListForRun;
AwareEvent.year=2013;
AwareEvent.datecode=123;
AwareEvent.gotDateCode=0;
AwareEvent.nRows=5;
AwareEvent.nCols=4;
AwareEvent.nChans=20;
AwareEvent.nScaleGroups=0;
AwareEvent.fRowLabels;
AwareEvent.fColLabels;   
AwareEvent.chanToScaleGroup;
AwareEvent.chanRowColArray;
AwareEvent.showXaxis;
AwareEvent.showYaxis;



/**
 * The reduceWaveformSamples function is @deprecated
 */
function reduceWaveformSamples(channelData,evenSamples,maxV2Samples) {
    //channel data is an array of [time,voltage] numbers
    //this function will return a similar array which has been trimmed
    var inputPoints=channelData.length;
    if(inputPoints<=evenSamples+maxV2Samples) return channelData;

    var v2Array = new Array();
    var newArray = new Array();
    
    var sampleEvery = Math.floor(inputPoints/evenSamples);
    if(sampleEvery==0) sampleEvery++;

    for(var i=0;i<inputPoints;i++) {
	if(i%sampleEvery==0) {
	    newArray.push([channelData[i][0],channelData[i][1]]);
	}
	v2Array.push([channelData[i][0],channelData[i][1]*channelData[i][1],channelData[i][1]]);   
    }
    v2Array.sort(voltageSortData);
    for(var i=0;i<maxV2Samples;i++) {
	newArray.push([v2Array[i][0],v2Array[i][2]]);
    }
    newArray.sort(timeSortData);
//    var titleContainer = $("#titleContainer"); 
//    for(var i=0;i<newArray.length;i++) {
//	titleContainer.append("<p>"+i+" "+newArray[i][0]+" "+newArray[i][1]+"</p>");
//    }
    return newArray;
}



/**
 * The UI interface function that gets the run from the runInput form.
 * @returns {number}
 */
function getRunFromForm() {
    return document.getElementById("runInput").value;
    //    return AwareEvent.runNumber;
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


/**
 * The UI interface function that gets the event index from the eventIndexInput form.
 * @returns {number}
 */
function getEventIndexFromForm() {
    eventIndex=document.getElementById("eventIndexInput").value;
    return eventIndex;
} 


/**
 * The UI interface function that sets the event index on the eventIndexInput form.
 */
function setEventIndexOnForm(evNum) {
    document.getElementById("eventIndexInput").value=evNum;
} 

/**
 * The UI interface function that gets the event number from the eventNumberInput form.
 * @returns {number}
 */
function getEventNumberFromForm() {
    return document.getElementById("eventNumberInput").value;
} 


/**
 * The UI interface function that sets the event number on the eventNumberInput form.
 */
function setEventNumberOnForm(evNum) {
    document.getElementById("eventNumberInput").value=evNum;
} 

/**
 * The UI interface function that gets the next run and then executes nextFunction, which is typically to draw the event
 */
function getNextRun(nextFunction) {
    var runNumber=document.getElementById("runInput").value;
    runNumber++;
    document.getElementById("runInput").value=runNumber;
    nextFunction();
}


/**
 * The UI interface function that gets the previous run and then executes nextFunction, which is typically to draw the event
 */
function getPreviousRun(nextFunction) {
    var runNumber=document.getElementById("runInput").value;
    runNumber--;
    document.getElementById("runInput").value=runNumber;
    nextFunction();
}


/**
 * The UI interface function that gets the next event and then executes nextFunction, which is typically to draw the event
 */
function getNextEvent(nextFunction) {
    eventIndex=getEventIndexFromForm();
    eventIndex++;
    document.getElementById("eventIndexInput").value=eventIndex;
    nextFunction();
}


/**
 * The UI interface function that gets the previous event and then executes nextFunction, which is typically to draw the event
 */
function getPreviousEvent(nextFunction) {
    eventIndex=document.getElementById("eventIndexInput").value;
    eventIndex--;
    document.getElementById("eventIndexInput").value=eventIndex;
    nextFunction();
}


/**
 * The UI interface function that is executed when the play button is pressed. The code executes getNextEvent at am interval specified by the speedSlide form.
 */
function playEvents() {
   if(document.getElementById("playButton").value=='Play') {
      document.getElementById("playButton").value='Stop';
      var playInt=document.getElementById("speedSlide").value;
      AwareEvent.playVar=setInterval(function(){getNextEvent(plotEvent())},(10000/playInt));
   }
   else {
      document.getElementById("playButton").value='Play';
      clearInterval(AwareEvent.playVar);
   }
}



/**
 * The UI interface function that gets the event layout from the layoutForm.
* @returns {string}
 */
function getLayoutFromForm() {
    return document.getElementById("layoutForm").value;
}


/**
 * The UI interface function that gets the waveform type from the waveformForm.
* @returns {string}
 */
function getWaveformTypeFromForm() {
    return document.getElementById("waveformForm").value;
}


/**
 * The UI interface function that gets the waveform type from the waveformForm.
* @returns {string}
 */
function getLayoutTypeFromForm() {
    return document.getElementById("layoutForm").value;
}


/**
 * This function determines if we need to calculate the coherent sum
 */
function getCoherentSumFlag() {
    var layoutString=getLayoutTypeFromForm();
    if(layoutString=="eventLayoutVPolCSum") {
	return true;
    }
    return false;
}


/**
 * The UI interface function that gets the instrument name from the instrumentForm.
* @returns {string}
 */ 
function getInstrumentNameFromForm() {
    return document.getElementById("instrumentForm").value;
}


/**
 * The UI interface function that checks if the includeCables box is checked to determine if cable delays should be subtracted
* @returns {boolean}
 */
function isCableDelaysChecked() {
    return document.getElementById("includeCables").checked;
}


/**
 * The UI interface function that checks if the xAutoScale box is checked to determine if the x scale should be set automatically or user determined.
* @returns {boolean}
 */
function getXAutoScale() {
    return document.getElementById("xAutoScale").checked;
}


/**
 * The UI interface function that updates xMinInput to xmin
 */
function setXMin(xmin) {
    document.getElementById("xMinInput").value=xmin;
}

/**
 * The UI interface function that updates xMaxInput to xmax
 */
function setXMax(xmax) {
    document.getElementById("xMaxInput").value=xmax;
}
    

/**
 * The UI interface function that gets a new xmin from the xMinInput form
 * returns {number}
 */
function getXMin() {
    return document.getElementById("xMinInput").value;
}


/**
 * The UI interface function that gets a new xmax from the xMaxInput form
 * returns {number}
 */
function getXMax() {
    return document.getElementById("xMaxInput").value;
}
    



/**
 * The function that updates both the plot title and the URL in the lcoation bar, to ensure if reload is hit that same event display is returned. This works at some level but does not remember things like the xAutoScale
 */
function updatePlotTitle(jsonObject) {
    //Also update the page URL
    var currentUrl = [location.protocol, '//', location.host, location.pathname].join('');
    //    var currentUrl = window.location.href;
    currentUrl=currentUrl+"?run="+getRunFromForm()+"&instrument="+getInstrumentNameFromForm()+"&eventNumber="+getEventNumberFromForm()+"&eventIndex="+getEventIndexFromForm()+"&layoutType="+getLayoutFromForm()+"&waveformType="+getWaveformTypeFromForm();
    var stateObj = { foo: "bar" };
    history.replaceState(stateObj, "page 2", currentUrl);

    var titleContainer = $("#titleContainer"); 
    titleContainer.empty();
    titleContainer.append("<h1>"+getInstrumentNameFromForm()+" -- Run "+jsonObject.event.run+"</h1>");
    titleContainer.append("<h2>Event: "+jsonObject.event.eventNumber+" -- Time: "+jsonObject.event.time+" -- Trigger: "+jsonObject.event.triggerTime+"</h2>");
    
}


/**
* The function that is actually called to plot the event
*/
function plotEvent() {
    titleContainer=$("#titleContainer");
    titleContainer.empty();
    titleContainer.append("<h2>Loading</h2>");
    
    getRunInstrumentDateAndEvent(getEventNumberAndPlot);
}



/**
 * The first thing we need to do to plot the event is determine which year and date the run comes from. This function reads the appropriate run list and sets the year and datecode before calling the next stage of plotting
*/
function getRunInstrumentDateAndEvent(plotFunc) {
    AwareEvent.gotDateCode=0;
    var runNumber=getRunFromForm();  
    var instrumentName=getInstrumentNameFromForm();
    //var titleContainer = $("#leftbar"); 
    var runListFile=getRunListName(instrumentName,runNumber);
    function handleRunList(jsonObject) {
//	titleContainer.append("<p>"+jsonObject.runList.length+"</p>");
	for(var i=0;i<jsonObject.runList.length;i++) {
	    if(jsonObject.runList[i][0]==runNumber) {
		AwareEvent.year=jsonObject.runList[i][1];
		AwareEvent.datecode=jsonObject.runList[i][2]; ///RJN need to zero pad the string
		AwareEvent.gotDateCode=1;
		//		debugContainer.append("<p>"+runNumber+" "+AwareEvent.year+" "+AwareEvent.datecode+"</p>");	
		plotFunc(eventPlotter);
		break;
	    }
	}
    }
    

    ajaxLoadingLog(runListFile);
    $.ajax({
	    url: runListFile,
		type: "GET",
		dataType: "json",
		success: function(data) {
		//Log the loadingf of the file
		ajaxLoadedLog(runListFile);
		handleRunList(data);
	        },
		error: handleAjaxError
    });
}


/**
 * This function converts eventIndex to eventNumber using the event list for the requested run. Then the eventPlotter function is called.
*/
function getEventNumberAndPlot(plotFunc) {
    var eventIndex=getEventIndexFromForm();
    var runNumber=getRunFromForm();
    var eventListFile=getEventListName(getInstrumentNameFromForm(),runNumber,AwareEvent.year,AwareEvent.datecode);

    function handleEventList(jsonObject) {
	for(var i=0;i<jsonObject.eventList.length;i++) {
	    AwareEvent.eventList.push(jsonObject.eventList[i]);
	}
	
	var eventNumber=AwareEvent.eventList[eventIndex];
	setEventNumberOnForm(eventNumber);
	plotFunc();
    
    }

    if(AwareEvent.gotEventListForRun!=runNumber) {
	AwareEvent.eventList = new Array();

	ajaxLoadingLog(eventListFile);
	$.ajax({
	    url: eventListFile,
	    type: "GET",
	    dataType: "json",
		    success: function(data) {
		    ajaxLoadedLog(eventListFile);
		    handleEventList(data);
		},
		    error: handleAjaxError
	});	
    }
    else {
	var eventNumber=AwareEvent.eventList[eventIndex];
	setEventNumberOnForm(eventNumber);
	plotFunc();	
    }
}


/**
 * This function converts eventNumber to eventIndex using the event list for the requested run. Then the eventPlotter function is called.
*/
function getEventIndexFromNumber(plotFunc) {
    var eventNumber=getEventNumberFromForm();
    var runNumber=getRunFromForm();
    var eventListFile=getEventListName(getInstrumentNameFromForm(),runNumber,AwareEvent.year,AwareEvent.datecode);
    
    function handleEventList(jsonObject) {
	setEventIndexOnForm(0);
	for(var i=0;i<jsonObject.eventList.length;i++) {
	    if(jsonObject.eventList[i]==eventNumber) {
		setEventIndexOnForm(i);
		break;
	    }
	}
	plotFunc();	
    }

    if(AwareEvent.gotEventListForRun!=runNumber) {
	eventList = new Array();

	ajaxLoadingLog(eventListFile);
	$.ajax({
		url: eventListFile,
		    type: "GET",
		    dataType: "json",
		    success: function(data) {
		    ajaxLoadedLog(eventListFile);
		    handleEventList(data);
		},
		    error: handleAjaxError
		    });	
    }
    else {       
	setEventIndexOnForm(0);
	for(var i=0;i<jsonObject.eventList.length;i++) {
	    if(jsonObject.eventList[i]==eventNumber) {
		setEventIndexOnForm(i);
		break;
	    }
	}
	plotFunc();	
    }
}



/**
 * This is one of the two main functions of the awareEvent module. The function first downloads the JSON file containing the event data. The next step is to convert the raw ADC data in to either voltage-time or power-frequency arrays before the plotting function is called.
*/
function eventPlotter() {
   var eventUrl=getEventName(getInstrumentNameFromForm(),getRunFromForm(),AwareEvent.year,AwareEvent.datecode,getEventNumberFromForm());

    function handleEventJsonFile(jsonObject) {
	//Preparation by emptying things and writing labels
	updatePlotTitle(jsonObject);

	

	var newEvent=true;
	if('gotDataForIndex' in AwareEvent) {
	    if(AwareEvent.gotDataForIndex==getEventIndexFromForm()) {
		if('gotDataForRun' in AwareEvent) {
		    if(AwareEvent.gotDataForRun==getRunFromForm())
			newEvent=false;
		}
	    }

	}
	
	if(newEvent) {
	    AwareEvent.waveformArray=null;
	    AwareEvent.fftArray=null;
	    AwareEvent.labelArray=null;
	}
		


	var processData=true;
	if(!newEvent) {
	    if(getWaveformTypeFromForm()=="fft") {
		if(AwareEvent.fftArray!=null) 
		    processData=false;
	    }
	    if(getWaveformTypeFromForm()=="waveform") {
		if(AwareEvent.waveformArray!=null) {
		    if(AwareEvent.cableChecked==isCableDelaysChecked()) {
			processData=false;
		    }
		    else {
			AwareEvent.waveformArray=null;
		    }
		}
	    }
	}
	    
	if(processData) {

	    if(AwareEvent.waveformArray==null) {
		AwareEvent.tMin=0;
		AwareEvent.tMax=0;
		AwareEvent.voltMax=new Array();
		AwareEvent.voltMin=new Array();
		
		for(var scaleGroup=0;scaleGroup<AwareEvent.nScaleGroups;scaleGroup++) {
		    AwareEvent.voltMin.push(4096);
		    AwareEvent.voltMax.push(0);
		}
	    }
	    
	    if(AwareEvent.fftArray==null) {
		AwareEvent.fMin=0;
		AwareEvent.fMax=0;
		AwareEvent.powerMax=new Array();
		AwareEvent.powerMin=new Array();
		
		for(var scaleGroup=0;scaleGroup<AwareEvent.nScaleGroups;scaleGroup++) {
		    AwareEvent.powerMin.push(4096);
		    AwareEvent.powerMax.push(0);
		}
	    }

	    var minMaxArray = new Array();
	    var minMaxTimeArray = new Array();
	    var dataChanArray = new Array();
	    var labelArray = new Array();	
	    
	    //	    $("#debugContainer").append("nChans = "+AwareEvent.nChans);
	    
	    for(var inputChan=0; inputChan<AwareEvent.nChans; inputChan++) {
		
		var chan=AwareEvent.inputChanList[inputChan];
		var scaleGroup=AwareEvent.chanToScaleGroup[chan];
		var dataArray = new Array();
		var vMin=Number.MAX_VALUE;
		var vMax=-1*Number.MAX_VALUE;
		var vMinTime=0;
		var vMaxTime=0;
		
		if(getWaveformTypeFromForm()=="fft") {
		    var summaryObj = {};
		    summaryObj.pMax=-1*Number.MAX_VALUE;
		    summaryObj.pMin=Number.MAX_VALUE;
		    summaryObj.fMax==1*Number.MAX_VALUE;
		    summaryObj.fMin=Number.MAX_VALUE;
		    dataArray = makePowerSpectrumMvNs(jsonObject.event.channelList[chan].data,
						      jsonObject.event.channelList[chan].deltaT,
						      summaryObj);
		    
		    if(summaryObj.pMax>AwareEvent.powerMax[scaleGroup]) AwareEvent.powerMax[scaleGroup]=summaryObj.pMax;
		    if(summaryObj.pMin<AwareEvent.powerMin[scaleGroup]) AwareEvent.powerMin[scaleGroup]=scaleGroup.pMin;
		    
		    if(summaryObj.fMax>AwareEvent.fMax) AwareEvent.fMax=summaryObj.fMax;
		    if(summaryObj.fMin<AwareEvent.fMin) AwareEvent.fMin=summaryObj.fMin;		   
		    
		    
		}
		else {
		    for(var samp=0;samp<jsonObject.event.channelList[chan].data.length;samp++) {
			//The Number is important for the logical tests below
			var time=0;
			if(isCableDelaysChecked()) {
			    time=Number(jsonObject.event.channelList[chan].t0+(samp*jsonObject.event.channelList[chan].deltaT));
		    }
			else {
			    time=Number((samp*jsonObject.event.channelList[chan].deltaT));
			}
			
			var value=Number(jsonObject.event.channelList[chan].data[samp]);		
			dataArray.push([time,value]);
			if(value>vMax) { 
			    vMax=value;
			    vMaxTime=time;
			}
			if(value<vMin) {
			    vMin=value;
			    vMinTime=time;
			}
			if(value>AwareEvent.voltMax[scaleGroup]) AwareEvent.voltMax[scaleGroup]=value;
			if(value<AwareEvent.voltMin[scaleGroup]) AwareEvent.voltMin[scaleGroup]=value;
			if(time<AwareEvent.tMin) AwareEvent.tMin=time;
			if(time>AwareEvent.tMax) AwareEvent.tMax=time;
			
		    }
		}
		minMaxArray.push([vMin,vMax]);
		minMaxTimeArray.push([vMinTime,vMaxTime]);
		dataChanArray.push(dataArray);
		labelArray.push(jsonObject.event.channelList[chan].label);
		
	    }
	    //	}
	    AwareEvent.labelArray=labelArray;
	    if(getWaveformTypeFromForm()=="waveform") {
		for(var scaleGroup=0;scaleGroup<AwareEvent.nScaleGroups;scaleGroup++) {
		    if(AwareEvent.voltMax[scaleGroup]>-1*AwareEvent.voltMin[scaleGroup]) AwareEvent.voltMin[scaleGroup]=-1*AwareEvent.voltMax[scaleGroup];
		    else AwareEvent.voltMax[scaleGroup]=-1*AwareEvent.voltMin[scaleGroup];
		}
		AwareEvent.voltMinMaxArray=minMaxArray;
		AwareEvent.voltMinMaxTimeArray=minMaxTimeArray;
		AwareEvent.waveformArray=dataChanArray;
		AwareEvent.cableChecked=isCableDelaysChecked();
		
	    }
	    else if(getWaveformTypeFromForm()=="fft") {	    
		AwareEvent.fftArray=dataChanArray;
	    }
	    AwareEvent.gotDataForIndex=getEventIndexFromForm();
	    AwareEvent.gotDataForRun=getRunFromForm();
	}
	if(getCoherentSumFlag()) {
	    makeCoherentSum();
	    findBestLocation();
	}
	
	plotTheEvent();

    }

    ajaxLoadingLog(eventUrl);
    $.ajax({
	    url: eventUrl,
		type: "GET",
		dataType: "json",
		success: function(data) {
		ajaxLoadedLog(eventUrl);
		handleEventJsonFile(data);
	    },
		error : handleAjaxError
    }); 
    
}

function makeCoherentSum() {
    //    $('#titleContainer').append("<p>Making coherent sum</p>");
    //    $('#titleContainer').append("<p>There are "+AwareEvent.waveformArray.length+" channels in the waveform Array</p>");
    var chanV2Array = new Array();
    var numPoints=0;
    for(var index=0;index<AwareEvent.voltMinMaxArray.length;index++) {
	var v2=AwareEvent.voltMinMaxArray[index][1]*AwareEvent.voltMinMaxArray[index][1];
	if(AwareEvent.voltMinMaxArray[index][0]*AwareEvent.voltMinMaxArray[index][0]>v2) {
	    v2=AwareEvent.voltMinMaxArray[index][0]*AwareEvent.voltMinMaxArray[index][0];
	}
	chanV2Array.push([index,v2]);

	//Check the length of the arrays;
	if(AwareEvent.waveformArray[index].length>numPoints) {
	    numPoints=AwareEvent.waveformArray[index].length;
	}
    }
    //Now we sort the data in terms of the squared voltage
    chanV2Array.sort(voltageSortData);
    for(var index=0;index<chanV2Array.length;index++) {
	//	$('#debugContainer').append("<p>Channel "+AwareEvent.waveformArray[chanV2Array[index][0]].length+"</p>");
	
	//This code zero pads the data
	while(AwareEvent.waveformArray[chanV2Array[index][0]].length<numPoints) {
	    AwareEvent.waveformArray[chanV2Array[index][0]].push([2*AwareEvent.waveformArray[chanV2Array[index][0]][AwareEvent.waveformArray[chanV2Array[index][0]].length-1][0]-AwareEvent.waveformArray[chanV2Array[index][0]][AwareEvent.waveformArray[chanV2Array[index][0]].length-2][0],0]);	    
	}
	//	$('#debugContainer').append("<p>Channel "+chanV2Array[index][0]+" with V^2="+chanV2Array[index][1]+" num points "+AwareEvent.waveformArray[chanV2Array[index][0]].length+"</p>");

    }


    
    AwareEvent.csumArray=AwareEvent.waveformArray[chanV2Array[0][0]];
    var vMaxTimeCSum=AwareEvent.voltMinMaxTimeArray[chanV2Array[0][0]][1];


    AwareEvent.csumDeltaTArray = new Array(chanV2Array.length);
    AwareEvent.csumDeltaTArray[chanV2Array[0][0]]=0;
    AwareEvent.csumCorrArray = new Array(chanV2Array.length);
    AwareEvent.csumCorrArray[chanV2Array[0][0]]=0;
    for(var index=1;index<chanV2Array.length;index++) {
	var corrArray=makeCorrelation(AwareEvent.csumArray,
				      AwareEvent.waveformArray[chanV2Array[index][0]],
				      -500,500);
	
	var maxCor=-1*Number.MAX_VALUE;
	var maxCorTime=0;
	var maxCorIndex=0;
	var zeroTime=Number.MAX_VALUE;
	var zeroIndex=0;
	var cableDiff=AwareEvent.csumArray[0][0]-AwareEvent.waveformArray[chanV2Array[index][0]][0][0];
	for(var i=0;i<corrArray.length;i++) {
	    //	    if(index==1) 
	    //		$("#debugContainer").append("<p>"+corrArray[i][0]+" "+corrArray[i][1]+"</p>");
	    if(Math.abs(corrArray[i][0]-cableDiff)<zeroTime) {
		zeroTime=Math.abs(corrArray[i][0]-cableDiff);
		zeroIndex=i;
	    }
	    if(corrArray[i][1]>maxCor) {
		maxCor=corrArray[i][1];
		maxCorIndex=i;
		maxCorTime=corrArray[i][0];
	    }
	}
	var offset=maxCorIndex-zeroIndex;
	//	$("#debugContainer").append("<p>"+zeroIndex+" "+maxCorIndex+" "+offset+" "+maxCorTime+" "+maxCor+"</p>");
	//	$("#debugContainer").append("<p>"+cableDiff+"</p>");
	var vMaxTime=AwareEvent.voltMinMaxTimeArray[chanV2Array[index][0]][1];
	AwareEvent.csumDeltaTArray[chanV2Array[index][0]]=maxCorTime;
	AwareEvent.csumCorrArray[chanV2Array[index][0]]=maxCor;
	var deltaT=AwareEvent.csumArray[1][0]-AwareEvent.csumArray[0][0];
	var firstT=AwareEvent.csumArray[0][0];
	AwareEvent.testArray= new Array();
	for(var i=0;i<numPoints;i++) {
	    var value=AwareEvent.csumArray[i][1];
	    if(i-offset>=0 && i-offset<numPoints) {
		value+=AwareEvent.waveformArray[chanV2Array[index][0]][i-offset][1];
	    }
	    AwareEvent.testArray.push([deltaT*i+firstT,value]);	
	}
	AwareEvent.csumArray=AwareEvent.testArray;
    }


    AwareEvent.csumXMin=AwareEvent.csumArray[0][0];
    AwareEvent.csumXMax=AwareEvent.csumArray[AwareEvent.csumArray[AwareEvent.csumArray.length-1][0]];
    AwareEvent.csumYMin=Number.MAX_VALUE;
    AwareEvent.csumYMax=-1*Number.MAX_VALUE;
    for(var i=0;i<AwareEvent.csumArray.length;i++) {
	if(AwareEvent.csumArray[i][1]>AwareEvent.csumYMax)
	    AwareEvent.csumYMax=AwareEvent.csumArray[i][1];	
	if(AwareEvent.csumArray[i][1]<AwareEvent.csumYMin)
	    AwareEvent.csumYMin=AwareEvent.csumArray[i][1];
	//	$('#titleContainer').append("<p>"+i+" -- "+AwareEvent.csumArray[i][0]+" -- "+AwareEvent.csumArray[i][1]+"</p>");
	
    }
    

    
}



/**
 * This is the function that actually plots the event
*/
function plotTheEvent() {


	//Here is the actually plotting stuff
	var xMin=0;
	var xMax=0;
	var yMin;
	var yMax;
	var dataChanArray;
	if(getWaveformTypeFromForm()=="waveform") {
	    xMin=AwareEvent.tMin;
	    xMax=AwareEvent.tMax;
	    yMin=AwareEvent.voltMin;
	    yMax=AwareEvent.voltMax;
	    dataChanArray=AwareEvent.waveformArray;
	}
	else if(getWaveformTypeFromForm()=="fft") { 
	    xMin=AwareEvent.fMin;
	    xMax=AwareEvent.fMax;
	    yMin=AwareEvent.powerMin;
	    yMax=AwareEvent.powerMax;
	    dataChanArray=AwareEvent.fftArray;
	}
	    

	if(getXAutoScale()) {
	    setXMin(xMin);
	    setXMax(xMax);
	}
	else {
	    xMin=getXMin();
	    xMax=getXMax();
	}


	for(var i=0; i<AwareEvent.plotChans; i++) {

	    var plotCan=$("#"+"divChan"+i);
	    
	    var row=Math.floor(i/AwareEvent.nCols);
	    var col=(i%AwareEvent.nCols);
	    var showX=AwareEvent.showXaxis[row][col];
	    if(showX==1) showX=true;
	    else showX=false;
	    var showY=AwareEvent.showYaxis[row][col];
	    if(showY==1) showY=true;
	    else showY=false;
	    var chan=AwareEvent.chanRowColArray[row][col];
	    if(chan=="CSum") {
		var htmlString="<table id=\"csumTable\"><caption>Correlation Summary</caption><thead><tr><th></th>";
		for(var index=0;index<AwareEvent.csumDeltaTArray.length;index++) {
		    htmlString+="<th>"+AwareEvent.labelArray[index]+"</th>";
		}
		htmlString+="</tr></thead>";
		htmlString+="<tbody><tr><th>&Delta;t (ns)</th>";
		for(var index=0;index<AwareEvent.csumDeltaTArray.length;index++) {
		    var num= new Number(AwareEvent.csumDeltaTArray[index]);
		    htmlString+="<td>"+num.toFixed(1)+"</td>";
		}
		htmlString+="</tr><tr><th>X-Corr</th>";
		for(var index=0;index<AwareEvent.csumCorrArray.length;index++) {
		    var num= new Number(AwareEvent.csumCorrArray[index]);
		    htmlString+="<td>"+num.toExponential(2)+"</td>";
		}		
		htmlString+="</tr></tbody></table>";
		$('#titleContainer').html($('#titleContainer').html()+htmlString);
		
		var divName="divChan"+chan;
		var contName="waveform-container"+chan;
		var grLabel="Coherent Sum";
		plotSingleChannel(divName,contName,AwareEvent.csumArray,AwareEvent.csumXMin,AwareEvent.csumXMax,AwareEvent.csumYMin,AwareEvent.csumYMax,grLabel,showX,showY);
	    }
	    else if(chan=="Map") {
		


	    }
	    else {
		
		//	    var row=Math.floor(chan/AwareEvent.nCols);
		var scaleGroup=AwareEvent.chanToScaleGroup[chan];
		//	    var col=chan%AwareEvent.nCols;
		var divName="divChan"+chan;
		var contName="waveform-container"+chan;
		//	    var grLabel="RFCHAN"+chan;  ///Need to fix this
		var grLabel=AwareEvent.labelArray[i];  ///Need to fix this
		
		//	    plotSingleChannel(divName,contName,jsonObject.event.channelList[chan].data,yMin[scaleGroup],yMax[scaleGroup],grLabel);
		plotSingleChannel(divName,contName,dataChanArray[i],xMin,xMax,yMin[scaleGroup],yMax[scaleGroup],grLabel,showX,showY);
	    }
	}
}



/*
 * This is the actual plotting function for a single channel of waveform data
 * @param divChanName -- The HMTL div for the plot
 * @param divContName -- The HMTL div for the plot container
 * @param dataArray -- The array of data
 * @param xMin -- xMin
 * @param xMax -- xMax
 * @param yMin -- yMin
 * @param yMax -- xMax
 * @param grLabel -- The graph label
 * @param showX -- A boolean determining if the x-axis is shown
 * @param showY -- A boolean determining if the y-axis is shown

*/
function plotSingleChannel(divChanName,divContName,dataArray,xMin,xMax,yMin,yMax,grLabel,showX,showY) {
  
    var showXaxis=showX;
    var showYaxis=showY;
    var showLabel=false;
    
    //    $("#debugContainer").append("<p>"+divChanName+" "+divContName+" "+showX+" "+showY+" "+xMin+" "+xMax+" "+yMin+" "+yMax+" "+grLabel+"</p>");

    var titleContainer = $("#titleContainer"); 
    //    titleContainer.append("<p>"+divContName+"</p>");
    //titleContainer.append("<p>The plot has "+dataArray.length+" time points</p>");
    //    titleContainer.append("<p>"+yMin+" "+yMax+"</p>");
    //    titleContainer.append("<p>First point "+dataArray[0][0] +","+dataArray[0][1]+"</p>");
    //    titleContainer.append("<p>Second point "+dataArray[1][0] +","+dataArray[1][1]+"</p>");
    //    titleContainer.append("<p>Last point "+dataArray[dataArray.length-1][0] +","+dataArray[dataArray.length-1][1]+"</p>");
    var plotCan=$("#"+divChanName);
    plotCan.empty();	    

    var plotCont=$("#"+divContName);
 
    var plotWidth=plotCont.width();
    var plotHeight=plotCont.height();
    
    var subDataArray=dataArray;

    plotCont.off('dblclick');
    plotCont.on('dblclick',  function() {
//	titleContainer.append("<p>"+divContName+"<\p>");
	plotCont.toggleClass('double');
	if(plotCont.hasClass('double')) {
	   showXaxis=true;
	   showYaxis=true;
	   showLabel=true;	   	   
	}
	else {
	   showXaxis=showX;
	   showYaxis=showY;
	   showLabel=false;	   	  
	}
	doThePlot();
    });



    var dataObject = {
	color : 6,
	data: subDataArray,
	label: ""
    }

    var options = {
       yaxis: { min: yMin, max: yMax},
       xaxis: { min: xMin, max: xMax},
       lines: { show: true, lineWidth:1 },
       selection : { mode : "xy" },
       grid: { 
	  show: true,
	  //	   hoverable: true,
	  //clickable: true,
	  borderWidth: 0,
	  minBorderMargin: 2,
	  labelMargin: 2,
	  axisMargin:2,
	  margin: { top: 7, left: 0, right :0, bottom: 0},
       } 
    }
    
    var plot;
    function doThePlot() {
	//       	$("#debugContainer").append("<p>doThePlot </p>");
       if(!plotCont.hasClass('double')) {
	  //Do the data reduction
	  subDataArray=dataArray;//reduceWaveformSamples(dataArray,64,64);
	  dataObject.data=subDataArray;	    
       }
       else {
	  dataObject.data=dataArray;
       }
       
       
       
       if(showLabel) {
	  dataObject.label=grLabel;
       }
       else {
	   dataObject.label=null;
       }
       if(showXaxis) {
	  //	  options.xaxis.show=true;
	  //	  delete options.xaxis.tickFomatter;
	  delete options.xaxis.font;
	  delete options.xaxis.labelWidth;
	  delete options.xaxis.labelHeight;
       }
       else {
	  //	  options.xaxis.show=false;
	  options.xaxis.labelHeight=5;
	  options.xaxis.labelWidth=5;
	  options.xaxis.font={size:1,lineHeight:1};
       }
       if(showYaxis) {
	  //	  options.yaxis.show=true;
	  //	  delete options.yaxis.tickFomatter;
	  delete options.yaxis.font;
	  delete options.yaxis.labelWidth;
	  delete options.yaxis.labelHeight;	 
       }
       else {
	  //	  options.yaxis.show=false;
	  options.yaxis.labelHeight=5;
	  options.yaxis.labelWidth=5;
	  options.yaxis.font={size:1,lineHeight:1};

       }
       plot=$.plot(plotCan, [dataObject],options);
    }
    
    plotCan.unbind("plotselected");
    plotCan.bind("plotselected", function (event, ranges) {
	options.xaxis.min=ranges.xaxis.from;
	options.xaxis.max=ranges.xaxis.to;
	options.yaxis.min=ranges.yaxis.from;
	options.yaxis.max=ranges.yaxis.to;
	doThePlot();
    });

    plotCan.unbind("plotunselected");
    plotCan.bind("plotunselected", function (event, ranges) {
	options.xaxis.min=xMin;
	options.xaxis.max=xMax;
	options.yaxis.min=yMin;
	options.yaxis.max=yMax;
	doThePlot();
    });
	 
    doThePlot();

}

/*
* Worker function which populated the grid of HTML div elements used to store the waveforms.
*/
function fillEventDivWithWaveformContainers(chanArray,rowContLabel,colContLabel,containerLabel,chanScale)
{


//Get hold of the divEvent object and fill it with a table of divs for the event display
  var eventDiv = $("#divEvent");
  eventDiv.append("<div class=\"event-leftbar\" id=\"event-leftbar\"></div>");
  var eventLeftbar=$("#event-leftbar");
  eventLeftbar.append("<div class=\"event-top-corner\" id=\"event-top-corner\"></div>");
  for(var row=0;row<AwareEvent.nRows;row++) {
      var divName2="event-row"+row;
      eventLeftbar.append("<div class=\"row-label-"+rowContLabel+"\" id=\""+divName2+"\"><div class=\"row-spacer\"></div><div class=\"rowlabel\"><h2>"+AwareEvent.fRowLabels[row]+"</h2></div></div>");
  }


  eventDiv.append("<div class=\"event-topbar\" id=\"event-topbar\"></div>");
  var eventTopbar= $("#event-topbar");
  for(var col=0;col<AwareEvent.nCols;col++) {
      var divName="event-col"+col;
      eventTopbar.append("<div class=\"column-label-"+colContLabel+"\" id=\""+divName+"\"><h2 class=\"collabel\">"+AwareEvent.fColLabels[col]+"</h2></div>");
  }

  for (var i=0;i<AwareEvent.plotChans;i++) 
      {
	  var row=Math.floor(i/AwareEvent.nCols);
	  var col=(i%AwareEvent.nCols);
	  //      var chanInd=AwareEvent.chanRowColArray[row][col];
	  var chanInd=chanArray[row][col];
	  var contName="waveform-container"+chanInd;
	  eventDiv.append("<div class=\"waveform-container-"+containerLabel+"\" id=\""+contName+"\"><div id=\"divChan"+chanInd+"\" class=\"waveform-placeholder\" ></div></div>");
	  
      }
}


/*
* Worker function which stes some of the global variables deterined by the selected eventLayout (eg. number of rows, columns etc.)
*/
function setupEventDisplay(jsonObject) {
   $('#divEvent').empty();	   	
    readInstrumentGeom();
   if('waveformArray' in AwareEvent) {
       AwareEvent.waveformArray=null;
   }
   if('fftArray' in AwareEvent) {
       AwareEvent.fftArray=null;
   }
   
    AwareEvent.chanToScaleGroup = new Array(jsonObject.chanScale.length);
    AwareEvent.chanRowColArray=jsonObject.chanOrder;
    AwareEvent.showXaxis=jsonObject.showXaxis;
    AwareEvent.showYaxis=jsonObject.showYaxis;
       
       //jsonObject.chanArray;    
    for(var i=0;i<jsonObject.chanScale.length;i++) {
	AwareEvent.chanToScaleGroup[i]=jsonObject.chanScale[i];
	if(jsonObject.chanScale[i]>(AwareEvent.nScaleGroups-1)) AwareEvent.nScaleGroups=jsonObject.chanScale[i]+1;
    }

    AwareEvent.nRows=jsonObject.numRows;
    AwareEvent.nCols=jsonObject.numCols;
    AwareEvent.fRowLabels=jsonObject.rowLabels;
    AwareEvent.fColLabels=jsonObject.colLabels;
    
    if('inputChanList' in jsonObject) {
	AwareEvent.inputChanList=jsonObject.inputChanList;
	AwareEvent.nChans=AwareEvent.inputChanList.length;	
	AwareEvent.plotChans=AwareEvent.nRows*AwareEvent.nCols;
    }
    else {
	AwareEvent.nChans=AwareEvent.nRows*AwareEvent.nCols;
	AwareEvent.plotChans=AwareEvent.nChans;
	AwareEvent.inputChanList = new Array();
	for(var row=0;row<AwareEvent.nRows;row++) {
	    for(var col=0;col<AwareEvent.nCols;col++) {
		AwareEvent.inputChanList.push(AwareEvent.chanRowColArray[row][col]);
	    }
	}
    }



   
   fillEventDivWithWaveformContainers(jsonObject.chanOrder,jsonObject.rowContLabel,jsonObject.colContLabel,jsonObject.containerLabel,jsonObject.chanScale);
}

function readInstrumentGeom() {
//going to read the location of the antennas from config/INSTRUMENT/instrumentGeom.json
    
   function actuallyReadInstrumentGeom(instrumentGeom) {
       AwareEvent.instrumentGeom=instrumentGeom;
   }
    
    $.ajax({
	url: "config/"+getInstrumentNameFromForm()+"/instrumentGeom.json",
	type: "GET",
	dataType: "json", 
	success: actuallyReadInstrumentGeom
    });  
}


function findBestLocation()
{
    $("#debugContainer").append("<p>findBestLocation</p>");
    var minDelta=Number.MAX_VALUE;
    var refIndex=0;
    var relLocationArray = new Array();

    for(var index=0;index<AwareEvent.csumDeltaTArray.length;index++) {
	var num= new Number(AwareEvent.csumDeltaTArray[index]);
	if(num<minDelta) {
	    minDelta=num;
	    refIndex=index;
	}
    }
    $("#debugContainer").append("<p>"+refIndex+" "+minDelta+"</p>");
    var refLocation=AwareEvent.instrumentGeom.antList[AwareEvent.inputChanList[refIndex]].location;
    //refIndex defines the antenna which all deltas are measured against    
    for(var index=0;index<AwareEvent.csumDeltaTArray.length;index++) {
	var rawLocation=AwareEvent.instrumentGeom.antList[AwareEvent.inputChanList[index]].location;
	relLocationArray.push([rawLocation[0]-refLocation[0],rawLocation[1]-refLocation[1],rawLocation[2]-refLocation[2]]);
	$("#debugContainer").append("<p>"+rawLocation[0]-refLocation[0]+" "+rawLocation[1]-refLocation[1]+" "+rawLocation[2]-refLocation[2]+"</p>");
    }

}