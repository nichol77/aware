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

var Cinice=0.299792458/1.78;

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
    //Now we sort the data in terms of the squared voltage, so that we loop through the channels in order of decreasing signal size
    chanV2Array.sort(voltageSortData);
    var refIndex=chanV2Array[0][0];
    
    for(var index=0;index<chanV2Array.length;index++) {
	//This code zero pads the data... might fix this requirement at some point in the future
	while(AwareEvent.waveformArray[chanV2Array[index][0]].length<numPoints) {
	    AwareEvent.waveformArray[chanV2Array[index][0]].push([2*AwareEvent.waveformArray[chanV2Array[index][0]][AwareEvent.waveformArray[chanV2Array[index][0]].length-1][0]-AwareEvent.waveformArray[chanV2Array[index][0]][AwareEvent.waveformArray[chanV2Array[index][0]].length-2][0],0]);	    
	}
    }


    AwareEvent.flotCsumArray=new Array();
    AwareEvent.csumArray=new Array(numPoints);    
    for(var i=0;i<numPoints;i++) {
	AwareEvent.csumArray[i]=[AwareEvent.waveformArray[refIndex][i][0],AwareEvent.waveformArray[refIndex][i][1]];
    }


    AwareEvent.csumDeltaTArray = new Array(chanV2Array.length);
    AwareEvent.csumDeltaTArray[refIndex]=0;
    AwareEvent.csumCorrArray = new Array(chanV2Array.length);
    AwareEvent.csumCorrArray[refIndex]=0;
    AwareEvent.csumOffsetArray = new Array(chanV2Array.length);
    AwareEvent.csumOffsetArray[refIndex]=0;
    for(var index=1;index<chanV2Array.length;index++) {
	//Loop over the waveforms and add them coherently
	var realIndex=chanV2Array[index][0];	
	var infoBlock=addCoherently(AwareEvent.csumArray,AwareEvent.waveformArray[realIndex]);
	AwareEvent.csumDeltaTArray[realIndex]=infoBlock.deltaT;
	AwareEvent.csumCorrArray[realIndex]=infoBlock.csumXCor;
	AwareEvent.csumOffsetArray[realIndex]=infoBlock.offset;
    }


//     for(var index=1;index<chanV2Array.length;index++) {
// 	//Loop over the waveforms, subtract them and then add them coherently
// 	var realIndex=chanV2Array[index][0];	
// 	subtractWithOffset(AwareEvent.csumArray,AwareEvent.waveformArray[realIndex],AwareEvent.csumOffsetArray[realIndex]);
// 	var infoBlock=addCoherently(AwareEvent.csumArray,AwareEvent.waveformArray[realIndex]);
// 	AwareEvent.csumDeltaTArray[realIndex]=infoBlock.deltaT;
// 	AwareEvent.csumCorrArray[realIndex]=infoBlock.csumXCor;
// 	AwareEvent.csumOffsetArray[realIndex]=infoBlock.offset;
//     }
 
    for(var i=0;i<numPoints;i++) {
	AwareEvent.csumArray[i][1]/=chanV2Array.length;
    }	
    var flotData= { data:AwareEvent.csumArray }
    AwareEvent.flotCsumArray.push(flotData);
    AwareEvent.csumYMin=Number.MAX_VALUE;
    AwareEvent.csumYMax=-1*Number.MAX_VALUE;
    for(var index=0;index<AwareEvent.csumOffsetArray.length;index++) {
	var newChanArray=new Array();
	for(var i=0;i<AwareEvent.waveformArray[index].length;i++) {
	    newChanArray.push([AwareEvent.waveformArray[index][i][0]-AwareEvent.csumDeltaTArray[index],AwareEvent.waveformArray[index][i][1]]);
	    AwareEvent.csumYMin=Math.min(AwareEvent.waveformArray[index][i][1],AwareEvent.csumYMin);
	    AwareEvent.csumYMax=Math.max(AwareEvent.waveformArray[index][i][1],AwareEvent.csumYMax);
	}
	var flotObj = {data:newChanArray};		
	AwareEvent.flotCsumArray.push(flotObj);
    }

    
    

    AwareEvent.csumXMin=AwareEvent.csumArray[0][0];
    AwareEvent.csumXMax=AwareEvent.csumArray[AwareEvent.csumArray[AwareEvent.csumArray.length-1][0]];
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
		$("#titleContainer").append("Best fit: "+Number(AwareEvent.bestPoint[0]).toFixed(2)+"m "+Number(AwareEvent.bestPoint[1]).toFixed(2)+"m "+Number(AwareEvent.bestPoint[2]).toFixed(2)+"m -- ChiSq="+Number(AwareEvent.bestChiSq).toExponential(3)+"</p>");
		
		var divName="divChan"+chan;
		var contName="waveform-container"+chan;
		var grLabel="Coherent Sum";
		var flotData=new Object();
		plotSinglePanel(divName,contName,AwareEvent.flotCsumArray,AwareEvent.csumXMin,AwareEvent.csumXMax,AwareEvent.csumYMin,AwareEvent.csumYMax,grLabel,showX,showY);
	    }
	    else if(chan=="Map") {
		
		var divName="divChan"+chan;
		var contName="waveform-container"+chan;
		drawStationMap(divName,contName);

	    }
	    else {
		
		//	    var row=Math.floor(chan/AwareEvent.nCols);
		var scaleGroup=AwareEvent.chanToScaleGroup[chan];
		//	    var col=chan%AwareEvent.nCols;
		var divName="divChan"+chan;
		var contName="waveform-container"+chan;
		//	    var grLabel="RFCHAN"+chan;  ///Need to fix this
		var grLabel=AwareEvent.labelArray[i];  ///Need to fix this
		var flotData=new Object();
		flotData.data=dataChanArray[i];
		//	    plotSinglePanel(divName,contName,jsonObject.event.channelList[chan].data,yMin[scaleGroup],yMax[scaleGroup],grLabel);
		plotSinglePanel(divName,contName,[flotData],xMin,xMax,yMin[scaleGroup],yMax[scaleGroup],grLabel,showX,showY);
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
function plotSinglePanel(divChanName,divContName,flotDataArray,xMin,xMax,yMin,yMax,grLabel,showX,showY) {
  
    var showXaxis=showX;
    var showYaxis=showY;
    var showLabel=false;
    
    //    $("#debugContainer").append("<p>"+divChanName+" "+divContName+" "+showX+" "+showY+" "+xMin+" "+xMax+" "+yMin+" "+yMax+" "+grLabel+"</p>");

    var titleContainer = $("#titleContainer"); 
    //    titleContainer.append("<p>"+divContName+"</p>");
    //titleContainer.append("<p>The plot has "+flotDataArray.length+" time points</p>");
    //    titleContainer.append("<p>"+yMin+" "+yMax+"</p>");
    //    titleContainer.append("<p>First point "+flotDataArray[0][0] +","+flotDataArray[0][1]+"</p>");
    //    titleContainer.append("<p>Second point "+flotDataArray[1][0] +","+flotDataArray[1][1]+"</p>");
    //    titleContainer.append("<p>Last point "+flotDataArray[flotDataArray.length-1][0] +","+flotDataArray[flotDataArray.length-1][1]+"</p>");
    var plotCan=$("#"+divChanName);
    plotCan.empty();	    

    var plotCont=$("#"+divContName);
 
    var plotWidth=plotCont.width();
    var plotHeight=plotCont.height();
    
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



    //    var dataObject = {
    //	data: flotDataArray,
    //	label: ""
    //    }

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

       
       
//        if(showLabel) {
// 	  dataObject.label=grLabel;
//        }
//        else {
// 	   dataObject.label=null;
//        }
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
       plot=$.plot(plotCan, flotDataArray,options);
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
    //    $("#debugContainer").append("<p>findBestLocation</p>");
    var minDelta=Number.MAX_VALUE;
    var refIndex=0;
    var relLocationArray = new Array();

    var orderIndex = new Array (AwareEvent.csumDeltaTArray.length);
    var otherIndex = new Array (AwareEvent.csumDeltaTArray.length);
    for(var index=0;index<AwareEvent.csumDeltaTArray.length;index++) {
	orderIndex[index]=-1;
    }

    for(var index=0;index<AwareEvent.csumDeltaTArray.length;index++) {
	var num= new Number(AwareEvent.csumDeltaTArray[index]);
	if(Math.abs(num)<minDelta) {
	    minDelta=Math.abs(num);
	    refIndex=new Number(index);
	}
    }
    
    otherIndex[refIndex]=0;
    orderIndex[0]=refIndex;
    for(var index=1;index<orderIndex.length;index++) {
	var maxCor=0;
	var maxIndex=0;
	for(var i=0;i<AwareEvent.csumDeltaTArray.length;i++) {
	    if(otherIndex[i]>=0) continue;
	    if(AwareEvent.csumCorrArray[i]>maxCor) {
		maxCor=AwareEvent.csumCorrArray[i];
		maxIndex=i;
	    }
	}
	orderIndex[index]=maxIndex;
	otherIndex[maxIndex]=index;
    }
    

  var refLocation=new Array(3); 


    refLocation[0]=new Number(AwareEvent.instrumentGeom.antList[AwareEvent.inputChanList[refIndex]].location[0]);
    refLocation[1]=new Number(AwareEvent.instrumentGeom.antList[AwareEvent.inputChanList[refIndex]].location[1]);
    refLocation[2]=new Number(AwareEvent.instrumentGeom.antList[AwareEvent.inputChanList[refIndex]].location[2]);
   // $("#debugContainer").append("<p>"+refLocation[1]+"</p>"); 


//refIndex defines the antenna which all deltas are measured against    
    for(var index=new Number(0);index<AwareEvent.csumDeltaTArray.length;index++) {
	var rawLocation= new Array(3);	
	rawLocation[0]=new Number(AwareEvent.instrumentGeom.antList[AwareEvent.inputChanList[index]].location[0]);
	rawLocation[1]=new Number(AwareEvent.instrumentGeom.antList[AwareEvent.inputChanList[index]].location[1]);
	rawLocation[2]=new Number(AwareEvent.instrumentGeom.antList[AwareEvent.inputChanList[index]].location[2]);
	relLocationArray.push([rawLocation[0]-refLocation[0],rawLocation[1]-refLocation[1],rawLocation[2]-refLocation[2]]);
//	$("#debugContainer").append("<p>"+rawLocation[0]+" "+rawLocation[1]+" "+rawLocation[2]+"</p>");
	var maxDeltat=Math.sqrt((rawLocation[0]-refLocation[0])*(rawLocation[0]-refLocation[0]) + (rawLocation[1]-refLocation[1])*(rawLocation[1]-refLocation[1]) + (rawLocation[2]-refLocation[2])*(rawLocation[2]-refLocation[2]))/Cinice;
	//	$("#debugContainer").append("<p>"+AwareEvent.labelArray[index]+" -- "+maxDeltat+"ns</p>");
    }
    
    var Ai = new Array(orderIndex.length);
    var Bi = new Array(orderIndex.length);
    var Ci = new Array(orderIndex.length);
    var Di = new Array(orderIndex.length);

    for(var index=2;index<orderIndex.length;index++) {
	var i1=orderIndex[1];
	var i=orderIndex[index];
	Ai[index] = (2*relLocationArray[i][0])/(Clight*AwareEvent.csumDeltaTArray[i]) - (2*relLocationArray[i1][0])/(Clight*AwareEvent.csumDeltaTArray[i1]);
	Bi[index] = (2*relLocationArray[i][1])/(Clight*AwareEvent.csumDeltaTArray[i]) - (2*relLocationArray[i1][1])/(Clight*AwareEvent.csumDeltaTArray[i1]);
	Ci[index] = (2*relLocationArray[i][2])/(Clight*AwareEvent.csumDeltaTArray[i]) - (2*relLocationArray[i1][2])/(Clight*AwareEvent.csumDeltaTArray[i1]);
	Di[index] = Clight*(AwareEvent.csumDeltaTArray[i]-AwareEvent.csumDeltaTArray[i1]) + (relLocationArray[i][0]*relLocationArray[i][0] + relLocationArray[i][1]*relLocationArray[i][1] + relLocationArray[i][2]*relLocationArray[i][2])/(Clight*AwareEvent.csumDeltaTArray[i]) + (relLocationArray[i1][0]*relLocationArray[i1][0] + relLocationArray[i1][1]*relLocationArray[i1][1] + relLocationArray[i1][2]*relLocationArray[i1][2])/(Clight*AwareEvent.csumDeltaTArray[i1]);
    }

//Now need to find the vector in the direction of the line of intersection
//will arbitrarily pick the point at z=0;
//    var n2 =[Ai[2],Bi[2],Ci[2]];
//    var n3 =[Ai[3],Bi[3],Ci[3]];
    var ni= [ (Bi[2]*Ci[3]-Ci[2]*Bi[3]), (Ci[2]*Ai[3]-Ai[2]*Ci[3]), (Ai[2]*Bi[3]-Bi[2]*Ai[3])];
    var niSize=Math.sqrt(ni[0]*ni[0]+ni[1]*ni[1]+ni[2]*ni[2]);
    ni[0]/=niSize;
    ni[1]/=niSize;
    ni[2]/=niSize;



    

    function calculateChiSquared(testPoint) {
	var refR=Math.sqrt(testPoint[0]*testPoint[0]+testPoint[1]*testPoint[1]+testPoint[2]*testPoint[2]);
	var chiSq=0;

	//	$("#debugContainer").append("<p>Test point: "+testPoint[0]+" + "+testPoint[1]+" + "+testPoint[2]+"</p>");
	for(var index=1;index<relLocationArray.length;index++) {
	    var i=orderIndex[index];
	    var relX=(relLocationArray[i][0]-testPoint[0]);
	    var relY=(relLocationArray[i][1]-testPoint[1]);
	    var relZ=(relLocationArray[i][2]-testPoint[2]);
	    var relR=Math.sqrt(relX*relX+relY*relY+relZ*relZ);
	    var deltaT=(relR-refR)/Cinice;
	    chiSq+=(deltaT-AwareEvent.csumDeltaTArray[i])*(deltaT-AwareEvent.csumDeltaTArray[i]);
	    //$("#debugContainer").append("<p>Ant i: "+i+" + "+deltaT+" + "+AwareEvent.csumDeltaTArray[i]+"</p>");
	    
	}	
	return chiSq;

    }

    var bestPoint;
    var bestChiSq=Number.MAX_VALUE;

    function solveForTwoEquations() {


	//Now need to find the vector in the direction of the line of intersection
	//will arbitrarily pick the point at z=0;
	var n2 =[Ai[2],Bi[2],Ci[2]];
	var n3 =[Ai[3],Bi[3],Ci[3]];
	var ni= crossProduct(n2,n3);
	var niSize=Math.sqrt(ni[0]*ni[0]+ni[1]*ni[1]+ni[2]*ni[2]);
	ni[0]/=niSize;
	ni[1]/=niSize;
	ni[2]/=niSize;
	

	var point= new Array(3);
	point[0]=(Di[3]*Bi[2]-Di[2]*Bi[3])/(Ai[2]*Bi[3]-Ai[3]*Bi[2]);
	point[1]=(-Ai[2]*point[0] - Di[2])/Bi[2];
	point[2]=0;

	function getTestPointChiSquared() {
	    //This function calculates the chi-squared of the measured delta-ts to the position on the line
	    //defined by point + step*ni
	    var testPoint=[point[0]+step*ni[0],point[1]+step*ni[1],point[2]+step*ni[2]];
	    
	    return calculateChiSquared(testPoint);
	}
	
	var stepStart=-100;
	var stepEnd=+100;
	var stepSize=2;
	bestChiSq=Number.MAX_VALUE;
	var bestStep=-100;
	while(stepSize>0.1) {
	    for(var step=stepStart;step<=stepEnd;step+=stepSize) {
		var chiSq=getTestPointChiSquared(step);
		//	    $("#debugContainer").append("<p>"+step+" -- "+chiSq+"</p>");
		if(chiSq<bestChiSq) {
		    bestChiSq=chiSq;
		    bestStep=step;
		}
	    }
	    stepStart=bestStep-2*stepSize;
	    stepEnd=bestStep+2*stepSize;
	    stepSize/=2;
	}
        
	var startPoint=[(point[0]+bestStep*ni[0]),(point[1]+bestStep*ni[1]),(point[2]+bestStep*ni[2])];
	bestPoint=startPoint;	
    }


    function solveForNEquations() {
	//First up let us sort out an index
	var dArray = [[0,0,0,0],[0,0,0,0],[0,0,0,0]];
	var planeNormal = new Array();
	for(var ant=2;ant<orderIndex.length;ant++) {
	    var planeArray =[Ai[ant],Bi[ant],Ci[ant],Di[ant]];	
	    //	    $("#debugContainer").append("<p>"+planeArray[0]+","+planeArray[1]+","+planeArray[2]+","+planeArray[3]+"</p>");
	    for(var i=0;i<3;i++) {
		for(var j=0;j<4;j++) {
		    dArray[i][j]+=planeArray[i]*planeArray[j];
		}
	    }
	}
		
	for(var i=0;i<3;i++) {
	    var norm=0;
	    for(var j=0;j<3;j++) {
		norm+=dArray[i][j]*dArray[i][j];
	    }
	    norm=Math.sqrt(norm);
	    for(var j=0;j<4;j++) {
		dArray[i][j]/=norm;
	    }	    
	    planeNormal.push([dArray[i][0],dArray[i][1],dArray[i][2]]);
	    $("#debugContainer").append("<p>n"+i+" = "+dArray[i][0] +","+dArray[i][1]+","+dArray[i][2]+","+dArray[i][3]+"</p>");
	}
	//Now we have stored the equations of the three planes that intersect at the minimum point
	
 	var n2cross3= crossProduct(planeNormal[1],planeNormal[2]);
 	var n1dotn2cross3  = dotProduct(planeNormal[0],n2cross3);
	$("#debugContainer").append("<p>n1dotn2cross3="+n1dotn2cross3+"</p>");
 	if(n1dotn2cross3!=0) {
 	    var n3cross1=crossProduct(planeNormal[2],planeNormal[0]);
 	    var n1cross2=crossProduct(planeNormal[0],planeNormal[1]);
 	    bestPoint=[0,0,0];
 	    for(var j=0;j<3;j++) {
 		bestPoint[j]= -1*(dArray[0][3]*n2cross3[j]+dArray[1][3]*n3cross1[j]+dArray[2][3]*n1cross2[j])/n1dotn2cross3;
 	    }
	    $("#debugContainer").append("<p>Best: "+bestPoint[0]+","+bestPoint[1]+","+bestPoint[2]+"</p>");
 	}
	bestChiSq=calculateChiSquared(bestPoint);
	


    }


    if(orderIndex.length<5) {
	//Not enough equations for unknowns
	solveForTwoEquations();
	
    }
    else {
	solveForNEquations();

    }

    AwareEvent.bestPoint=[bestPoint[0]+refLocation[0],bestPoint[1]+refLocation[1],bestPoint[2]+refLocation[2]];
    AwareEvent.bestChiSq=bestChiSq;	



    //    $("#debugContainer").append("<p>Best point: "+AwareEvent.bestPoint[0]+" + "+AwareEvent.bestPoint[1]+" + "+AwareEvent.bestPoint[2]+" -- "+AwareEvent.bestChiSq+"</p>");
}



function drawStationMap(divChanName,divContName) {
  
    var showXaxis=true;
    var showYaxis=true;
    var showLabel=false;
    var xMin=-50;
    var yMin=-50;
    var xMax=+50;
    var yMax=+50;
    
    var titleContainer = $("#titleContainer"); 
    var plotCan=$("#"+divChanName);
    plotCan.empty();	    

    var plotCont=$("#"+divContName);
 
    var plotWidth=plotCont.width();
    var plotHeight=plotCont.height();
    
    var antDataArray = [];    
    for(var index=0;index<AwareEvent.csumDeltaTArray.length;index++) {
	var antObject= new Object();
	antObject.data=new Array();
	var rawLocation= new Array(3);	
	rawLocation[0]=new Number(AwareEvent.instrumentGeom.antList[AwareEvent.inputChanList[index]].location[0]);
	rawLocation[1]=new Number(AwareEvent.instrumentGeom.antList[AwareEvent.inputChanList[index]].location[1]);
	rawLocation[2]=new Number(AwareEvent.instrumentGeom.antList[AwareEvent.inputChanList[index]].location[2]);
	antObject.data.push([rawLocation[0],rawLocation[1]]);
	antObject.label=AwareEvent.labelArray[index];
	antObject.points= { symbol:"circle"};
	antDataArray.push(antObject);
    }

    var bestObject = new Object();
    bestObject.data= new Array();
    bestObject.data.push([AwareEvent.bestPoint[0],AwareEvent.bestPoint[1]]);
    bestObject.label="Best Fit";
    bestObject.points= { symbol:"cross"};
    antDataArray.push(bestObject);


    for(var index=0;index<AwareEvent.instrumentGeom.calAntList.length;index++) {
	var antObject= new Object();
	antObject.data=new Array();
	var rawLocation= new Array(3);	
	rawLocation[0]=new Number(AwareEvent.instrumentGeom.calAntList[index].location[0]);
	rawLocation[1]=new Number(AwareEvent.instrumentGeom.calAntList[index].location[1]);
	rawLocation[2]=new Number(AwareEvent.instrumentGeom.calAntList[index].location[2]);
	antObject.data.push([rawLocation[0],rawLocation[1]]);
	antObject.label=AwareEvent.instrumentGeom.calAntList[index].label;
	antObject.points= { symbol:"square"};
	antDataArray.push(antObject);
    }
    

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




    var options = {
       yaxis: { min: yMin, max: yMax},
       xaxis: { min: xMin, max: xMax},
       series: {
	   lines: {
	       show: true
	   },
	   points: {
	       show: true
	   }
       },
       selection : { mode : "xy" },
       grid: { 
	   show: true,
	   hoverable: true,
	   clickable: true,
	   borderWidth: 0,
	   minBorderMargin: 2,
	   labelMargin: 2,
	   axisMargin:2,
	   margin: { top: 7, left: 0, right :0, bottom: 0},
       } 
    }

    $("<div id='tooltip'></div>").css({
	    position: "absolute",
		display: "none",
		border: "1px solid #fdd",
		padding: "2px",
		"background-color": "#fee",
		opacity: 0.80
		}).appendTo("body");
    


    var plot;
    function doThePlot() {

       
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
       plot=$.plot(plotCan, antDataArray,options);
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

    plotCan.unbind("plothover");
    plotCan.bind("plothover",function(event,pos,item) {
		     
    if (item) {
	var x = item.datapoint[0].toFixed(2),
	    y = item.datapoint[1].toFixed(2);
	
	$("#tooltip").html(item.series.label + " of " + x + " = " + y)
	    .css({top: item.pageY+5, left: item.pageX+5})
	    .fadeIn(200);
    } else {
	$("#tooltip").hide();
    }
		 });
	 
    doThePlot();

}
