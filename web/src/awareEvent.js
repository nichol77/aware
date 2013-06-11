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
var instrumentName;
var runNumber;
var eventNumber;
var eventList;
var eventEntry;
var gotEventListForRun;
var year=2013;
var datecode=123;
var nRows=5;
var nCols=4;
var fRowLabels;
var fColLabels;

var playVar;



function setRowsAndCols(row,col,rowLabels,colLabels) {
    nRows=row;
    nCols=col;
    fRowLabels=rowLabels;
    fColLabels=colLabels;
}



///Here are the UI thingies
function getRunFromForm() {
    runNumber=document.getElementById("runInput").value;
    return runNumber;
} 

function getEventIndexFromForm() {
    eventIndex=document.getElementById("eventInput").value;
    return eventIndex;
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


function getNextEvent(nextFunction) {
    eventIndex=getEventIndexFromForm();
    eventIndex++;
    document.getElementById("eventInput").value=eventIndex;
    nextFunction();
}

function getPreviousEvent(nextFunction) {
    eventIndex=document.getElementById("eventInput").value;
    eventIndex--;
    document.getElementById("eventInput").value=eventIndex;
    nextFunction();
}

function playEvents() {
   if(document.getElementById("playButton").value=='Play') {
      document.getElementById("playButton").value='Stop';
      var playInt=document.getElementById("speedSlide").value;
      playVar=setInterval(function(){getNextEvent(drawPlot())},(10000/playInt));
   }
   else {
      document.getElementById("playButton").value='Play';
      clearInterval(playVar);
   }
}



function getInstrumentNameFromForm() {
    instrumentName=document.getElementById("instrumentForm").value;
    return instrumentName;
}


function updatePlotTitle(jsonObject) {
    //Also update the page URL
    var currentUrl = [location.protocol, '//', location.host, location.pathname].join('');
    //    var currentUrl = window.location.href;
    currentUrl=currentUrl+"?run="+runNumber+"&instrument="+instrumentName+"&eventNumber="+eventNumber+"&eventIndex="+eventIndex;
    var stateObj = { foo: "bar" };
    history.replaceState(stateObj, "page 2", currentUrl);

    var titleContainer = $("#titleContainer"); 
    titleContainer.empty();
    titleContainer.append("<h1>"+instrumentName+" -- Run "+runNumber+"</h1>");
    
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
    runNumber=getRunFromForm();  
    instrumentName=getInstrumentNameFromForm();
    //var titleContainer = $("#leftbar"); 
    var runListFile=getRunListName(instrumentName,runNumber);
    function handleRunList(jsonObject) {
//	titleContainer.append("<p>"+jsonObject.runList.length+"</p>");
	for(var i=0;i<jsonObject.runList.length;i++) {
	    if(jsonObject.runList[i][0]==runNumber) {
		year=jsonObject.runList[i][1];
		datecode=jsonObject.runList[i][2]; ///RJN need to zero pad the string
//		titleContainer.append("<p>"+year+" "+datecode+"</p>");	
		plotFunc(eventPlotter);
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

function getEventNumberAndPlot(plotFunc) {
    var eventIndex=getEventIndexFromForm();
    var eventListFile=getEventListName(instrumentName,runNumber,year,datecode);


    function handleEventList(jsonObject) {
	for(var i=0;i<jsonObject.eventList.length;i++) {
	    eventList.push(jsonObject.eventList[i]);
	}
	
	eventNumber=eventList[eventIndex];
	plotFunc();
    
    }

    if(gotEventListForRun!=runNumber) {
	eventList = new Array();

	$.ajax({
	    url: eventListFile,
	    type: "GET",
	    dataType: "json",
	    success: handleEventList
	});	
    }
    else {
	eventNumber=eventList[eventIndex];
	plotFunc();	
    }


}



function eventPlotter() {
    var eventUrl=getEventName(instrumentName,runNumber,year,datecode,eventNumber);

    function handleEventJsonFile(jsonObject) {
	//Preparation by emptying things and writing labels
	updatePlotTitle(jsonObject);

	
	var titleContainer = $("#titleContainer"); 
	titleContainer.append("<p>This event has "+jsonObject.event.numChannels+" channels.</p>");
	
	var yMin = new Array();
	var yMax = new Array();
	for(var row=0;row<nRows;row++) {
	    yMin.push(4096);
	    yMax.push(0);
	}
	var chanArray = new Array();

	for(var chan=0; chan<jsonObject.event.numChannels; chan++) {
	    var row=Math.floor(chan/nCols);
	    titleContainer.append("<p>"+jsonObject.event.channelList[chan].deltaT+" "+jsonObject.event.channelList[chan].data.length+"</p>");	   
	    var dataArray = new Array();
	    for(var samp=0;samp<jsonObject.event.channelList[chan].data.length;samp++) {
		//The Number is important for the logical tests below
		var time=Number((samp*jsonObject.event.channelList[chan].deltaT));
		var value=Number(jsonObject.event.channelList[chan].data[samp]);		
		dataArray.push([time,value]);
		if(value>yMax[row]) yMax[row]=value;
		if(value<yMin[row]) yMin[row]=value;
		
	    }
	    chanArray.push(dataArray);
	}
	for(var row=0;row<nRows;row++) {
	    if(yMax[row]>-1*yMin[row]) yMin[row]=-1*yMax[row];
	    else yMax[row]=-1*yMin[row];
	}
	for(var chan=0; chan<jsonObject.event.numChannels; chan++) {
	    var row=Math.floor(chan/nCols);
	    var col=chan%nCols;
	    var divName="divChan"+chan;
	    var contName="waveform-container"+chan;
	    var grLabel="RFCHAN"+chan;  ///Need to fix this

	    //	    plotSingleChannel(divName,contName,jsonObject.event.channelList[chan].data,yMin[row],yMax[row],grLabel);
	    plotSingleChannel(divName,contName,chanArray[chan],yMin[row],yMax[row],grLabel);
	}

    }

    $.ajax({
	url: eventUrl,
	type: "GET",
	dataType: "json",
	success: handleEventJsonFile
    }); 
    
}


function plotSingleChannel(divChanName,divContName,dataArray,yMin,yMax,grLabel) {
  
    var showXaxis=false;
    var showYaxis=false;
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
//    titleContainer.append("<p>"+plotWidth+"</p>");

    plotCont.on('dblclick', function() {
	$(this).toggleClass('double');
	if(showXaxis==true) showXaxis=false;
	else showXaxis=true;
	if(showYaxis==true) showYaxis=false;
	else showYaxis=true;
	if(showLabel==true) showLabel=false;
	else showLabel=true;
	doThePlot();
    });



    var dataObject = {
	color : 6,
	data: dataArray,
	label: ""
    }

    var options = {
	yaxis: { labelHeight: 0, labelWidth: 0, min: yMin, max: yMax},
	xaxis : {},
	lines: { show: true },
	selection : { mode : "xy" },
	grid: { 
	    show: true,
//	    hoverable: true,
//            clickable: true,
	    borderWidth: 0,
	    minBorderMargin: 0,
	    margin: { top: 0, left: 0, right :0, bottom: 0}
	} 
    }

    var plot;
    function doThePlot() {
	if(showLabel) {
	    dataObject.label=grLabel;
	}
	else {
	    delete dataObject.label;
	}
	if(showXaxis) {
	    delete options.xaxis.labelHeight;
	    delete options.xaxis.labelWidth;
	}
	else {
	    options.xaxis.labelHeight=0;
	    options.xaxis.labelWidth=0;
	}
	if(showYaxis) {
	    delete options.yaxis.labelHeight;
	    delete options.yaxis.labelWidth;
	}
	else {
	    options.yaxis.labelHeight=0;
	    options.yaxis.labelWidth=0;
	}
	plot=$.plot(plotCan, [dataObject],options);
    }

    plotCan.bind("plotselected", function (event, ranges) {
	options.xaxis.min=ranges.xaxis.from;
	options.xaxis.max=ranges.xaxis.to;
	options.yaxis.min=ranges.yaxis.from;
	options.yaxis.max=ranges.yaxis.to;
	doThePlot();
    });

    plotCan.bind("plotunselected", function (event, ranges) {
	delete options.xaxis.min;
	delete options.xaxis.max;
	options.yaxis.min=yMin;
	options.yaxis.max=yMax;
	doThePlot();
    });
	 
    doThePlot();

}

function fillEventDivWithWaveformContainers()
{

//Get hold of the divEvent object and fill it with a table of divs for the event display
  var eventDiv = $("#divEvent");
//  eventDiv.append("<p>Boo</p>");
  eventDiv.append("<div class=\"event-leftbar\" id=\"event-leftbar\"></div>");
  var eventLeftbar=$("#event-leftbar");
  eventLeftbar.append("<div class=\"event-top-corner\" id=\"event-top-corner\"></div>");
  for(var row=0;row<nRows;row++) {
      var divName2="event-row"+row;
      eventLeftbar.append("<div class=\"row-label\" id=\""+divName2+"\"><h2 class=\"rowlabel\">"+fRowLabels[row]+"</h2></div>");
  }


  eventDiv.append("<div class=\"event-topbar\" id=\"event-topbar\"></div>");
  var eventTopbar= $("#event-topbar");
  for(var col=0;col<nCols;col++) {
      var divName="event-col"+col;
      eventTopbar.append("<div class=\"column-label\" id=\""+divName+"\"><h2 class=\"collabel\">"+fColLabels[col]+"</h2></div>");
  }

  for (var i=0;i<20;i++) 
  {
   //     var row=Math.floor(i/nCols);
//        var col=(i%nCols);
//        var width=24;		  
//        if(col==0) width=26;
//        var height=10;		   
//        //if(row==4) height=19;
       var contName="waveform-container"+i;
      
      eventDiv.append("<div class=\"waveform-container\" id=\""+contName+"\"><div id=\"divChan"+i+"\" class=\"waveform-placeholder\" ></div></div>");

  }
}
