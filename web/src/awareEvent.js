//////////////////////////////////////////////////////////////////////////////
/////                                                                    /////
/////   awareEvent.js                                                    /////
/////                                                                    /////
/////   Simple javascript for getting event data in JSON format          /////
/////   and plotting using the flot library.                             /////
/////                                                                    /////
/////   March 2013, r.nichol@ucl.ac.uk                                   /////
//////////////////////////////////////////////////////////////////////////////



/* Globals */
var AwareEvent = {};

AwareEvent.eventList;
AwareEvent.gotEventListForRun;
AwareEvent.year=2013;
AwareEvent.datecode=123;
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

function blankAxisFormatter(v, xaxis) {
    return " ";
  }



function timeSortData(a,b) {
    return a[0]-b[0];
}

function voltageSortData(a,b) {
    return b[1]-a[1];
}


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


function setRowsAndCols(row,col,rowLabels,colLabels) {
    AwareEvent.nRows=row;
    AwareEvent.nCols=col;
    AwareEvent.nChans=AwareEvent.nRows*AwareEvent.nCols;
    AwareEvent.fRowLabels=rowLabels;
    AwareEvent.fColLabels=colLabels;
}



///Here are the UI thingies
function getRunFromForm() {
    return document.getElementById("runInput").value;
    //    return AwareEvent.runNumber;
} 

function setRunOnForm(thisRun) {
    document.getElementById("runInput").value=thisRun;
} 

function setLastRun(thisRun) {
    document.getElementById("runInput").max=thisRun;
} 

function getEventIndexFromForm() {
    eventIndex=document.getElementById("eventIndexInput").value;
    return eventIndex;
} 

function setEventIndexOnForm(evNum) {
    document.getElementById("eventIndexInput").value=evNum;
} 

function getEventNumberFromForm() {
    return document.getElementById("eventNumberInput").value;
} 

function setEventNumberOnForm(evNum) {
    document.getElementById("eventNumberInput").value=evNum;
} 


function getNextRun(nextFunction) {
    var runNumber=document.getElementById("runInput").value;
    runNumber++;
    document.getElementById("runInput").value=runNumber;
    nextFunction();
}

function getPreviousRun(nextFunction) {
    var runNumber=document.getElementById("runInput").value;
    runNumber--;
    document.getElementById("runInput").value=runNumber;
    nextFunction();
}


function getNextEvent(nextFunction) {
    eventIndex=getEventIndexFromForm();
    eventIndex++;
    document.getElementById("eventIndexInput").value=eventIndex;
    nextFunction();
}

function getPreviousEvent(nextFunction) {
    eventIndex=document.getElementById("eventIndexInput").value;
    eventIndex--;
    document.getElementById("eventIndexInput").value=eventIndex;
    nextFunction();
}

function playEvents() {
   if(document.getElementById("playButton").value=='Play') {
      document.getElementById("playButton").value='Stop';
      var playInt=document.getElementById("speedSlide").value;
      AwareEvent.playVar=setInterval(function(){getNextEvent(drawPlot())},(10000/playInt));
   }
   else {
      document.getElementById("playButton").value='Play';
      clearInterval(AwareEvent.playVar);
   }
}

function getLayoutFromForm() {
    return document.getElementById("layoutForm").value;
}


function getInstrumentNameFromForm() {
    return document.getElementById("instrumentForm").value;
}


function isCableDelaysChecked() {
    return document.getElementById("includeCables").checked;
}


function getXAutoScale() {
    return document.getElementById("xAutoScale").checked;
}

function setXMin(xmin) {
    document.getElementById("xMinInput").value=xmin;
}

function setXMax(xmax) {
    document.getElementById("xMaxInput").value=xmax;
}
    

function getXMin() {
    return document.getElementById("xMinInput").value;
}

function getXMax() {
    return document.getElementById("xMaxInput").value;
}
    



function updatePlotTitle(jsonObject) {
    //Also update the page URL
    var currentUrl = [location.protocol, '//', location.host, location.pathname].join('');
    //    var currentUrl = window.location.href;
    currentUrl=currentUrl+"?run="+getRunFromForm()+"&instrument="+getInstrumentNameFromForm()+"&eventNumber="+getEventNumberFromForm()+"&eventIndex="+getEventIndexFromForm();
    var stateObj = { foo: "bar" };
    history.replaceState(stateObj, "page 2", currentUrl);

    var titleContainer = $("#titleContainer"); 
    titleContainer.empty();
    titleContainer.append("<h1>"+getInstrumentNameFromForm()+" -- Run "+jsonObject.event.run+"</h1>");
    titleContainer.append("<h2>Event: "+jsonObject.event.eventNumber+" -- Time: "+jsonObject.event.time+" -- Trigger: "+jsonObject.event.triggerTime+"</h2>");
    
}


function drawPlot() {
    plotEvent();
}

function plotEvent() {
    titleContainer=$("#titleContainer");
    titleContainer.empty();
    titleContainer.append("<h2>Loading</h2>");
    
    getRunInstrumentDateAndEvent(getEventNumberAndPlot);
}



function getRunInstrumentDateAndEvent(plotFunc) {
    setDatecode=0;
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
//		titleContainer.append("<p>"+AwareEvent.year+" "+AwareEvent.datecode+"</p>");	
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



function eventPlotter() {
   var eventUrl=getEventName(getInstrumentNameFromForm(),getRunFromForm(),AwareEvent.year,AwareEvent.datecode,getEventNumberFromForm());

    function handleEventJsonFile(jsonObject) {
	//Preparation by emptying things and writing labels
	updatePlotTitle(jsonObject);

	
	var titleContainer = $("#titleContainer"); 
//	titleContainer.append("<p>This event has "+jsonObject.event.numChannels+" channels.</p>");

	for (var i=0;i<AwareEvent.nChans;i++) 
	    {
		var plotCan=$("#"+"divChan"+i);
		plotCan.empty();
	    }	

	var xMin=0;
	var xMax=0;
	var yMin = new Array();
	var yMax = new Array();
	for(var row=0;row<AwareEvent.nRows;row++) {
	    yMin.push(4096);
	    yMax.push(0);
	}
	var dataChanArray = new Array();
	//	for(var row=0;row<AwareEvent.nRows;row++) {
	//	    for(var col=0;col<AwareEvent.nCols;col++) {		

	for(var i=0; i<AwareEvent.nChans; i++) {
	    
	    var row=Math.floor(i/AwareEvent.nCols);
	    var col=(i%AwareEvent.nCols);
	    var chan=AwareEvent.chanRowColArray[row][col];
	    //	    var row=Math.floor(chan/AwareEvent.nCols);
	    var scaleGroup=AwareEvent.chanToScaleGroup[chan];
	    //	    titleContainer.append("<p>"+jsonObject.event.channelList[chan].deltaT+" "+jsonObject.event.channelList[chan].t0+"</p>");	   
	    //	    var chan=AwareEvent.chanRowColArray[row][col];
	    var dataArray = new Array();
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
		if(value>yMax[scaleGroup]) yMax[scaleGroup]=value;
		if(value<yMin[scaleGroup]) yMin[scaleGroup]=value;
		if(time<xMin) xMin=time;
		if(time>xMax) xMax=time;
		
	    }
	    dataChanArray.push(dataArray);
	}
	//	}
	for(var scaleGroup=0;scaleGroup<AwareEvent.nScaleGroups;scaleGroup++) {
	    if(yMax[scaleGroup]>-1*yMin[scaleGroup]) yMin[scaleGroup]=-1*yMax[scaleGroup];
	    else yMax[scaleGroup]=-1*yMin[scaleGroup];
	}


	if(getXAutoScale()) {
	    setXMin(xMin);
	    setXMax(xMax);
	}
	else {
	    xMin=getXMin();
	    xMax=getXMax();
	}


	for(var i=0; i<AwareEvent.nChans; i++) {
	    
	    var row=Math.floor(i/AwareEvent.nCols);
	    var col=(i%AwareEvent.nCols);
	    var chan=AwareEvent.chanRowColArray[row][col];
	    var showX=AwareEvent.showXaxis[row][col];
	    if(showX==1) showX=true;
	    else showX=false;
	    var showY=AwareEvent.showYaxis[row][col];
	    if(showY==1) showY=true;
	    else showY=false;

	    //	    var row=Math.floor(chan/AwareEvent.nCols);
	    var scaleGroup=AwareEvent.chanToScaleGroup[chan];
	    //	    var col=chan%AwareEvent.nCols;
	    var divName="divChan"+chan;
	    var contName="waveform-container"+chan;
	    //	    var grLabel="RFCHAN"+chan;  ///Need to fix this
	    var grLabel=jsonObject.event.channelList[chan].label  ///Need to fix this

	    //	    plotSingleChannel(divName,contName,jsonObject.event.channelList[chan].data,yMin[scaleGroup],yMax[scaleGroup],grLabel);
	    plotSingleChannel(divName,contName,dataChanArray[i],xMin,xMax,yMin[scaleGroup],yMax[scaleGroup],grLabel,showX,showY);
	}

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



function plotSingleChannel(divChanName,divContName,dataArray,xMin,xMax,yMin,yMax,grLabel,showX,showY) {
  
    var showXaxis=showX;
    var showYaxis=showY;
    var showLabel=false;
    
    var titleContainer = $("#titleContainer"); 
    //    titleContainer.append("<p>"+divContName+"</p>");
    //    titleContainer.append("<p>The plot has "+dataArray.length+" time points</p>");
    //    titleContainer.append("<p>"+yMin+" "+yMax+"</p>");
    //    titleContainer.append("<p>First point "+dataArray[0][0] +","+dataArray[0][1]+"</p>");
    //    titleContainer.append("<p>Last point "+dataArray[dataArray.length-1][0] +","+dataArray[dataArray.length-1][1]+"</p>");
    var plotCan=$("#"+divChanName);
    var plotCont=$("#"+divContName);
//    plotCont.append("<p>Boo</p>");
 
    var plotWidth=plotCont.width();
    var plotHeight=plotCont.height();
    //titleContainer.append("<p>"+plotWidth+"</p>");
    
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
       //	titleContainer.append("<p>Double? "++"</p>");
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
	  delete dataObject.label;
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
	  //	  options.xaxis.tickFomatter=blankAxisFormatter;
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
	  //	  options.yaxis.tickFomatter=blankAxisFormatter;
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

function fillEventDivWithWaveformContainers(chanArray,containerLabel,chanScale)
{


//Get hold of the divEvent object and fill it with a table of divs for the event display
  var eventDiv = $("#divEvent");
  eventDiv.append("<div class=\"event-leftbar\" id=\"event-leftbar\"></div>");
  var eventLeftbar=$("#event-leftbar");
  eventLeftbar.append("<div class=\"event-top-corner\" id=\"event-top-corner\"></div>");
  for(var row=0;row<AwareEvent.nRows;row++) {
      var divName2="event-row"+row;
      eventLeftbar.append("<div class=\"row-label-"+containerLabel+"\" id=\""+divName2+"\"><div class=\"row-spacer\"></div><div class=\"rowlabel\"><h2>"+AwareEvent.fRowLabels[row]+"</h2></div></div>");
  }


  eventDiv.append("<div class=\"event-topbar\" id=\"event-topbar\"></div>");
  var eventTopbar= $("#event-topbar");
  for(var col=0;col<AwareEvent.nCols;col++) {
      var divName="event-col"+col;
      eventTopbar.append("<div class=\"column-label-"+containerLabel+"\" id=\""+divName+"\"><h2 class=\"collabel\">"+AwareEvent.fColLabels[col]+"</h2></div>");
  }

  for (var i=0;i<AwareEvent.nChans;i++) 
  {
      var row=Math.floor(i/AwareEvent.nCols);
      var col=(i%AwareEvent.nCols);
      //      var chanInd=AwareEvent.chanRowColArray[row][col];
      var chanInd=chanArray[row][col];
      var contName="waveform-container"+chanInd;
      eventDiv.append("<div class=\"waveform-container-"+containerLabel+"\" id=\""+contName+"\"><div id=\"divChan"+chanInd+"\" class=\"waveform-placeholder\" ></div></div>");

  }
}


function setupEventDisplay(jsonObject) {
   $('#divEvent').empty();	   	

   
    AwareEvent.chanToScaleGroup = new Array(jsonObject.chanScale.length);
    AwareEvent.chanRowColArray= jsonObject.chanOrder;
    AwareEvent.showXaxis=jsonObject.showXaxis;
    AwareEvent.showYaxis=jsonObject.showYaxis;
       
       //jsonObject.chanArray;    
    for(var i=0;i<jsonObject.chanScale.length;i++) {
	AwareEvent.chanToScaleGroup[i]=jsonObject.chanScale[i];
	if(jsonObject.chanScale[i]>(AwareEvent.nScaleGroups-1)) AwareEvent.nScaleGroups=jsonObject.chanScale[i]+1;
    }
   
   setRowsAndCols(jsonObject.numRows,jsonObject.numCols,jsonObject.rowLabels,jsonObject.colLabels);
   fillEventDivWithWaveformContainers(jsonObject.chanOrder,jsonObject.containerLabel,jsonObject.chanScale);
}