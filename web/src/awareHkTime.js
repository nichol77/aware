/**
 * A simple javascript module for getting housekeeping data in JSON format and
 * plotting using the <a href="www.flotcharts.org">Flot Library</a>.
 * @file awareHkTime 
 * @author Ryan Nichol <r.nichol@ucl.ac.uk>
 */




///Here are the UI thingies



/**
 * Returns a boolean corresponding to if the xAutoScale UI checkbox is ticked
 */
function getXAutoScale() {
    return document.getElementById("xAutoScale").checked;
}

/**
* Sets the UI xMinDateInput element to the corresponding timestamp
* @params xmintimestamp is a javascript timestamp
*/
function setXMin(xmintimestamp) {   
    var date = new Date(xmintimestamp);//xmintimestamp);
    document.getElementById("xMinDateInput").value=getDateString(date);
    document.getElementById("xMinTimeInput").value=getTimeString(date);
}

/**
* Sets the UI xMaxDateInput element to the corresponding timestamp
* @params xmaxtimestamp is a javascript timestamp
*/
function setXMax(xmaxtimestamp) {
    var date = new Date(xmaxtimestamp);
    document.getElementById("xMaxDateInput").value=getDateString(date);
    document.getElementById("xMaxTimeInput").value=getTimeString(date);
}

/**
* Returns the timestamp corresponding to the xMinDateInput and xMinTimeInput
* @returns A javascript timestamp corresponding to the time in xMinDateInput and xMinTimeInput
*/
function getXMin() {   
    var dateString=document.getElementById("xMinDateInput").value;
    var timeString=document.getElementById("xMinTimeInput").value;
    return getTimestampFromDateStringTimeString(dateString,timeString);
}

/**
* Returns the timestamp corresponding to the xMaxDateInput and xMaxTimeInput
* @returns A javascript timestamp corresponding to the time in xMaxDateInput and xMaxTimeInput
*/
function getXMax() {
    var dateString=document.getElementById("xMaxDateInput").value;
    var timeString=document.getElementById("xMaxTimeInput").value;
    return getTimestampFromDateStringTimeString(dateString,timeString);
}



/**
 * Returns a boolean corresponding to if the xAutoScale UI checkbox is ticked
 * @returns Boolean determining if the y-scale should be autoscaled or not
 */
function getYAutoScale() {
    return document.getElementById("yAutoScale").checked;
}

/**
 * Sets the yMinInput UI element to ymin
 * @params ymin is a double corresponding to the minimum y value of the time plot
 */
function setYMin(ymin) {
    document.getElementById("yMinInput").value=ymin;
}

/**
 * Sets the yMaxInput UI element to ymax
 * @params ymax is a double corresponding to the maximum y value of the time plot
 */
function setYMax(ymax) {
    document.getElementById("yMaxInput").value=ymax;
}
    

/**
 * Gets the value from the yMinInput UI element
 * @returns A Number corresponding to the desired minimum y value for the time plot
 */
function getYMin() {
    return Number(document.getElementById("yMinInput").value);
}

/**
 * Gets the value from the yMaxInput UI element
 * @returns A Number corresponding to the desired maximum y value for the time plot
 */
function getYMax() {
    return Number(document.getElementById("yMaxInput").value);
}
    

/**
 * Gets the run number from the endRunInput UI element
 * @returns The run number from the endRunInput UI element
 */
function getEndRunFromForm() {
    return document.getElementById("endRunInput").value;
} 


/**
 * Sets the endRunInput UI element to thisRun
 * @params thisRun is the new end run number 
 */
function setEndRunOnForm(thisRun) {
    document.getElementById("endRunInput").value=thisRun;

} 


/**
 * Gets the desired number of time points from the maxTimePointsForm UI element
 * @returns The desired number of time points
 */
function getMaxTimePointsToShow() {
    return document.getElementById("maxTimePointsForm").value;
}

/**
 * Gets the desired number of bins in the projection plot from the maxProjPointsForm UI element
 * @returns The desired number of bins in the projection plot
 */
function getMaxProjBins() {
    return document.getElementById("maxProjPointsForm").value; 
}


/**
* Utility function to convert time and date strings to javascript timestamps
*
*/
function getTimestampFromDateStringTimeString(dateString,timeString) {
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



/**
* Utility function to create a string from a javascript Date object
*
*/
function getDateString(dateObj) {
    var dateString = dateObj.getUTCFullYear()+"/"+pad2(dateObj.getUTCMonth()+1)+"/"+pad2(dateObj.getUTCDate());
    return dateString;
}

/**
* Utility function to create a string from a javascript Date object
*
*/
function getTimeString(dateObj) {
    var timeString = pad2(dateObj.getUTCHours())+":"+pad2(dateObj.getUTCMinutes())+":"+pad2(dateObj.getUTCSeconds());
    return timeString;
}


/**
* Data handling function to add the timePoints from the JSON AWARE object to the time array
* @params awareControl is the global aware control object
* @params jsonObject is an object corresponding to an AWARE Full JSON file
*/
function fillFullTimeArray(awareControl,jsonObject) {
    for(var index=0;index<jsonObject.full.timeList.length;index++) {
	var timePoint=jsonObject.full.timeList[index];
	awareControl.timeArray.push(timePoint*1000); ///< Javascript needs the number in milliseconds
    }
}


/**
* Data handling function to add data points from the JSON AWARE object to the list of datasets
* @params awareControl is the global aware control object
* @params jsonObject is an object corresponding to an AWARE Full JSON file
*/
function addFullVariableToDataset(awareControl,jsonObject) {    
    var varPoint=jsonObject.full;
    var varName=varPoint.name;
    var dataList = new Object();
    dataList.label=varPoint.label;
    dataList.data= new Array();
    dataList.yMin=Number.MAX_VALUE;
    dataList.yMax=-1*Number.MAX_VALUE;

    var maxPointsToShow=getMaxTimePointsToShow();

    var varTimeList=varPoint.timeList;

    dataList.voidFlag=false;
    dataList.voidValue=0;
    if("voidValue" in varPoint) {
       dataList.voidFlag=true;
       dataList.voidValue=varPoint.voidValue;
    }

    for(var index=0;index<varTimeList.length;index++) {
	var timePoint=awareControl.timeArray[index];
 	var dataPoint=varTimeList[index];
	if(dataList.voidFlag)
	    if(Math.abs(dataPoint-dataList.voidValue)<1e-3) continue;
	if(dataPoint>dataList.yMax) dataList.yMax=dataPoint;
	if(dataPoint<dataList.yMin) dataList.yMin=dataPoint;
	dataList.data.push([timePoint,dataPoint]); ///< No stdDev for full files
    }
    awareControl.datasets[ varName ]=dataList;
}


/**
* Utility function that loops over the list of variables in awareControl.datasets and timesorts the data points
* @params awareControl is the object containing the data for plotting
*/
function sortDataSets(awareControl) {   
    $.each(awareControl.datasets, function(key, val) {
	val.data.sort(timeSortData);
    });
}


/**
* This function performs two main tasks for each variable in the datasets. <ol><li>It creates the projection plot using the full data set in the selected time range.</li><li> It averages the data points if there are more in the range xaxisMin to xaxisMax than in the maxTimePointsForm UI element.</li></ol>
* @params awareControl is the object containing the data for plotting
* @params xaxisMin is the minimum desired x value
* @params xaxisMax is the maximum desired x value
* @returns A javascript object containing the averaged data set and projected histograms
*/
function getDataForPlot(awareControl,xaxisMin,xaxisMax) {
    //Here the awareControl.datasets has every single point, the return of this does not    
    var smallHolder = new Object();
    smallHolder.timeDataset = new Object();
    smallHolder.projDataset = new Object();

    //    $('#debugContainer').append("<p>getDataForPlot</p>");

    var yAxisOpt=getYaxisOpt(getPlotNameFromForm());
    var maxPointsToShow=getMaxTimePointsToShow();
    var doZoom=0;
    if(xaxisMax>xaxisMin) doZoom=1;
    var firstTimeIndex=-1;
    var lastTimeIndex=-1;
    var plotEvery=1;
    var fullTimePoints=new Array();
    var projMin=Number.MAX_VALUE;
    var projMax=-1*Number.MAX_VALUE;
    var needToScaleYAxis=false;
    if(!getYAutoScale()) {
	projMin=getYMin();
	projMax=getYMax();
    }
    else if(awareControl.zoom) {
	projMin=awareControl.yMin;
	projMax=awareControl.yMax;
    }
    else {	
	$.each(awareControl.datasets, function(key, val) {
		   if(val.yMin<projMin) projMin=val.yMin;
		   if(val.yMax>projMax) projMax=val.yMax;
	       });
	
	if(yAxisOpt=="dydx") {
	    needToScaleYAxis=true;
	}
    }
    
    var haveVoidValue=false;
    awareControl.maxPoints=0;
    $.each(awareControl.datasets, function(key, val) {
	    //	    $('#debugContainer').append("<p>"+key+" "+val.data.length+"</p>");
	    if(val.data.length>0) {
	       if(val.voidFlag) haveVoidValue=true;
	       if(fullTimePoints.length==0 || haveVoidValue) {
		   fullTimePoints=new Array();
		   for(var index=0;index<val.data.length;index++) {
		       if(!doZoom || (val.data[index][0]>=xaxisMin && val.data[index][0]<=xaxisMax)) {
			   if(firstTimeIndex==-1) firstTimeIndex=index;
			   lastTimeIndex=index;
			   fullTimePoints.push(val.data[index][0]);
		       }
		   }
		   if(fullTimePoints.length>maxPointsToShow) {
		       //Need to do some data decimation
		       plotEvery=Math.ceil(fullTimePoints.length/maxPointsToShow);
		   }
		   if(fullTimePoints.length>awareControl.maxPoints) {
		       awareControl.maxPoints=fullTimePoints.length;
		   }
		   if(needToScaleYAxis) {
		       projMax=2e3*(projMax-projMin)/((fullTimePoints[fullTimePoints.length-1]-fullTimePoints[0]));		       
		       projMin=0;
		   }
	       }

	       var varName=key;
	       var timeDataList = new Object();
		var projDataList = new Object();
		//RJN Flot vs Highcharts
		//		timeDataList.label=val.label;
		//		projDataList.label=val.label;
		timeDataList.type='line';
		timeDataList.name=String(val.label);
		projDataList.name=String(val.label);
		projDataList.type='column';
		if("color" in val) {
		    timeDataList.color=val.color;
		    projDataList.color=val.color;
		}

		if("points" in val) {
		    timeDataList.points=val.points;
		    projDataList.points=val.points;
		}

	       projDataList.numBins=getMaxProjBins();
	       projDataList.minVal=projMin;
	       projDataList.maxVal=projMax;
	       projDataList.binSize=(projMax-projMin)/projDataList.numBins;
	       if(projMax-projMin<0.01) projDataList.binSize=0.01;
	       projDataList.bars=new Object();
	       projDataList.bars.show=true;
	       projDataList.bars.barWidth=projDataList.binSize;
	       projDataList.data = new Array();
	       for(var bin=0;bin<projDataList.numBins;bin++) {
		   projDataList.data.push([projDataList.minVal+bin*projDataList.binSize,0]);
	       }

	       timeDataList.data= new Array();	
	       var lastTimePoint=0;
	       var lastDataPoint=0;
	       for(var index=firstTimeIndex;index<=lastTimeIndex;index+=plotEvery) {		  
		   var timePoint=fullTimePoints[index-firstTimeIndex];
		   var dataPoint=val.data[index][1];
		   var count=1;
		   if(yAxisOpt!="dydx") {
		       var bin=Math.floor((dataPoint-projDataList.minVal)/projDataList.binSize);
		       if(bin>=0 && bin<projDataList.numBins) {
			   projDataList.data[bin][1]++;
		       }
		   }

		   var stdDev=0;
		   if(plotEvery>1) {	    
		       var dp2=0;
		       var deltaT=0;


		       for(var index2=index+1;index2<index+plotEvery && index2<=lastTimeIndex;index2++) {
			   //Fill the histogram
			   var dataPoint2=val.data[index2][1];
			   
			   if(yAxisOpt!="dydx") {
			       var bin=Math.floor((dataPoint2-projDataList.minVal)/projDataList.binSize);			   
			       if(bin>=0 && bin<projDataList.numBins) {
				   projDataList.data[bin][1]++;
			       }
			   }


			   count++;
			   dataPoint+=dataPoint2;
			   deltaT+=(fullTimePoints[index2-firstTimeIndex]-fullTimePoints[index-firstTimeIndex]);
			   dp2+=(val.data[index2][1]*val.data[index2][1]);
		       }
		       dataPoint/=count;
		       deltaT/=count;
		       timePoint+=deltaT;
		       dp2/=count;
		       stdDev=Math.sqrt(dp2-dataPoint*dataPoint);
		   }	
		   if(yAxisOpt=="dydx") {
		      //Want to plot the derivative
		      if(lastTimePoint>0) {
			  var dx=1e-3*(timePoint-lastTimePoint);
			  var dy=dataPoint-lastDataPoint;
			  //RJN: Flot vs Highcharts
//			  timeDataList.data.push([timePoint,dy/dx,stdDev/dx]);
			  timeDataList.data.push([timePoint,dy/dx]); 
			 var bin=Math.floor(((dy/dx)-projDataList.minVal)/projDataList.binSize);			   
			 if(bin>=0 && bin<projDataList.numBins) {
			     projDataList.data[bin][1]++;
			 }

		      }
		      lastTimePoint=timePoint;
		      lastDataPoint=dataPoint;

		   } else {
		       //RJN: Flot vs Highcharts
		       //		      timeDataList.data.push([timePoint,dataPoint,stdDev]);
		       timeDataList.data.push([timePoint,dataPoint]); 
		   }
	       }
	       
	       smallHolder.timeDataset[varName]=timeDataList; 
	       smallHolder.projDataset[varName]=projDataList;
	   }
	}
	);
    

    return smallHolder;	           
}


/**
* This function loops through the variables and fills the datasets object
* @params awareControl is the object containing the data for plotting
* @params varNameKey is a string corresponding to the variable for the plot
*/
function drawSimpleHkTime(varNameKey,awareControl) {
    for(var index=0;index<awareControl.timeList.length;index++) {
	var timePoint=awareControl.timeList[index];
	awareControl.timeArray.push(timePoint.startTime*1000); ///< Javascript needs the number in milliseconds
    }
    
    for(var varIndex=0;varIndex<awareControl.varList.length;varIndex++) {
	var varPoint=awareControl.varList[varIndex];
	var varName = new String(varPoint.name);
	var varLabel = new String(varPoint.label);
	if(varName.indexOf(varNameKey)>=0) {
	    ///Got a variable
	    var dataList = new Object();
	    dataList.label=varLabel;
	    dataList.data= new Array();
	    dataList.yMin=Number.MAX_VALUE;
	    dataList.yMax=-1*Number.MAX_VALUE;

	    dataList.voidFlag=false;
	    dataList.voidValue=0;
	    if("voidValue" in varPoint) {
		dataList.voidFlag=true;
		dataList.voidValue=varPoint.voidValue;
	    }	    


	    var varTimeList=varPoint.timeList;
	    awareControl.maxPoints=0;
	    var count=0;
	    for(var index=0;index<varTimeList.length;index++) {
		var dataPoint=varTimeList[index];
		
		if(dataList.voidFlag)
		    if(Math.abs(dataPoint.mean-dataList.voidValue)<1e-3) continue;

		if(dataPoint.mean>dataList.yMax) dataList.yMax=dataPoint.mean;
		if(dataPoint.mean<dataList.yMin) dataList.yMin=dataPoint.mean;
		//RJN: Flot vs Highcharts		
		//		dataList.data.push([awareControl.timeArray[index],dataPoint.mean,dataPoint.stdDev]); ///< Need to add stdDev
		dataList.data.push([awareControl.timeArray[index],dataPoint.mean]); 
		count++;
	    }
	    if(awareControl.maxPoints<count)
		awareControl.maxPoints=count;
	    awareControl.datasets[ varName ]=dataList;
	}
	
    }

    actuallyDrawTheStuff(awareControl);
}


function sortKeyNames(a,b) {
    var plotName=getPlotNameFromForm();
    return parseInt(a.substr(plotName.length))-parseInt(b.substr(plotName.length));
}
/**
* This function is the one that actually draws the time and projection plots on the canvases
* @params awareControl is the object containing the data for 
*/
function actuallyDrawTheStuff(awareControl) {
    //Step one is to time sort
    sortDataSets(awareControl);

    var keyArray = [];
    var fakeArray = [];
    for (var prop in awareControl.datasets) {
	keyArray.push(prop);
    }
    keyArray.sort(sortKeyNames);

    

    var count=0;
    for (var i = 0; i < keyArray.length; i++) {
	var key = keyArray[i];
	fakeArray.push(count);
	count++;
    }
    var len=count;
    var options = {};
	   //Step two is to assign colours to the variables for the plot
    if ( $('#color :checked').attr('id') == 'single' ) {
        options.colors = $.map( fakeArray, function ( o, i ) {
	    return jQuery.Color('blue').lightness(0.7-i/(len*1.2)).toHexString();
        });
    } else if ( $('#color :checked').attr('id') == 'multi' ) {
        options.colors = $.map( fakeArray, function ( o, i ) {
            return jQuery.Color({ hue: (i*200/len), saturation: 0.95, lightness: 0.35, alpha: 1 }).toHexString();
        });
    } else {	
        options.colors = fakeArray;
    }
    
    var numPoints=0;
    for (var i = 0; i < keyArray.length; i++) {
	var key = keyArray[i];
	//	$('#debugContainer').append("<p>"+i+ " - "+key+"</p>");
	var dataset = awareControl.datasets[key];
	numPoints=dataset.data.length;
	dataset.color = options.colors[i];
    }
    
    var canContainer = $("#plot-text-"+awareControl.plotId); 
    if(numPoints>getMaxTimePointsToShow()) numPoints=getMaxTimePointsToShow();
    canContainer.append("<p>The plot shows "+numPoints+" of "+awareControl.maxPoints+" time points</p>");
    var timePlotCan=$("#"+awareControl.timeCanName);
    var projPlotCan=$("#"+awareControl.projCanName);

    // Add some checkboxes to turn plots on and off
    var countNum=0;
    var choiceContainer = $("#choices-"+awareControl.plotId);
    for (var i = 0; i < keyArray.length; i++) {
	var key = keyArray[i];
	var dataset = awareControl.datasets[key];
	if(i%4==0) {
	    choiceContainer.append("<br />");
	}
	choiceContainer.append("<input type='checkbox' name='" + key +
			       "' checked='checked' id='id" + key + "'></input>" +
			       "<label for='id" + key + "'>"
			       + dataset.label + "</label>");
    }
    choiceContainer.find("input").click(plotAccordingToChoices);

    //Set up the options for the time and projection plots
    var timeOptions = {
	yaxes: [{ label:"Fred"}],
	yaxis: {  },
	xaxis: {mode: "time", timezone:"UTC"},
	lines: { show: false },
	points: { show: true   },
	legend: { show:false},
	selection : { mode : "xy" },
	canvas : true
    }

    var projOptions = {
	yaxis: {},
	xaxis: {},
	bars: { show: true, barwidth:10 },
	selection : { mode : "x" },
	canvas : true
    }
    
   

    var timePlot;	
    var projPlot;

    awareControl.zoom=false;

    //This function plots the variables according to which checkboxes are ticked
    function plotAccordingToChoices() {
	var timeData = [];
	var projData = [];
	var xmin=0;
	var xmax=0;

	if(!getXAutoScale() && !awareControl.zoom) {
	    timeOptions.xaxis.min=getXMin();
	    timeOptions.xaxis.max=getXMax();	    
	}	


	if(!getYAutoScale()) {
	    timeOptions.yaxis.min=getYMin();
	    timeOptions.yaxis.max=getYMax();	    
	}

	if("min" in timeOptions.xaxis) {
	    xmin=timeOptions.xaxis.min;
	    xmax=timeOptions.xaxis.max;
	}


	var smallHolder=getDataForPlot(awareControl,xmin,xmax);
	var smallTime=smallHolder.timeDataset;
	var smallProj=smallHolder.projDataset;
	

	choiceContainer.find("input:checked").each(function () {
						       var key = $(this).attr("name");
						       if (key && smallTime[key]) {
							   timeData.push(smallTime[key]);
						       }
						       if (key && smallProj[key]) {
							   projData.push(smallProj[key]);
						       }
						   });
	
	//	$('#debugContainer').append("<p>timeData.length  "+timeData.length+"</p>");
	if (timeData.length > 0) {
	    
	    if($('#debugContainer').is(":visible")) {
		var numDebugPoints=timeData[0].data.length;
		
		var debugTimeArray= new Array();
		var debugValueArray= new Array();
		var debugErrorArray= new Array();
		for(var i=0;i<numDebugPoints;i++) {
		    debugTimeArray.push(timeData[0].data[i][0]);
		    debugValueArray.push(timeData[0].data[i][1]);
		    debugErrorArray.push(timeData[0].data[i][2]);
		}

		$('#debugContainer').append("<p>Num debug points "+numDebugPoints+"</p>");
		$('#debugContainer').append("<p>double timeArray["+numDebugPoints+"]={"+debugTimeArray.toString()+"};</p>");
		$('#debugContainer').append("<p>double valueArray["+numDebugPoints+"]={"+debugValueArray.toString()+"};</p>");
		$('#debugContainer').append("<p>double rmsArray["+numDebugPoints+"]={"+debugErrorArray.toString()+"};</p>");
	    }

	    ///At this point we have the following Flot objects
	    // timeData = [timeObj1, timeObj2, ...     ]
	    // timeObj1 = {
	    // data[ [x1,y1,e1],[x2,y2,e2],[x3,y3,e3],...]
	    // label =
	    // color =
	    // points =
	    // }


	    //	      var timeOptions = {
	    //	yaxes: [{ label:"Fred"}],
	    //	yaxis: {  },
	    //	xaxis: {mode: "time", timezone:"UTC"},
	    //	lines: { show: false },
	    //	points: { show: true   },
	    //	legend: { show:false},
	    //	selection : { mode : "xy" },
	    //	canvas : true
	    //  }

	    var highchartsTimeObj = {
		chart: { zoomType:'xy', animation:false},
		credits: { enabled: false},
		title: { text: '' },
		subtitle: { text: document.ontouchstart === undefined ?
	                    'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'},
		xAxis: {type: 'datetime'},
		yAxis: {title: { text:'Thing' }},
		legend: { enabled: false },
		tooltip: { enabled: false},
		plotOptions: {
		    series: {
			states: {
			    hover: {
				enabled: false
			    }
			}
		    }
		},
		series: timeData //[ { type: 'line', name: 'Something', data:  timeData } ]
	    }

	    var highchartsProjObj = {
		chart: { zoomType:'x', animation:false},
		credits: { enabled: false},
		title: { text: '' },
		subtitle: { text: document.ontouchstart === undefined ?
	                    'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'},
		xAxis: {
		    title : {
			text:'Thing2'
		    }
		},
		yAxis: {title: { text:'Thing' }},
		legend: { enabled: true , 
			  floating: true,
			  align: 'right',
			  verticalAlign: 'top',
			  layout: 'vertical'},
		tooltip: { enabled: false},
		plotOptions: {
		    series: {
			states: {
			    hover: {
				enabled: false
			    }
			}
		    }
		},
		series: projData //[ { type: 'line', name: 'Something', data:  timeData } ]
	    }

	    
	    timePlotCan.highcharts(highchartsTimeObj);
	    projPlotCan.highcharts(highchartsProjObj);

//	    timePlot=$.plot(timePlotCan, timeData, timeOptions);
//	    projPlot=$.plot(projPlotCan,projData,projOptions);

	    var timePlot=timePlotCan.highcharts();
	    var projPlot=projPlotCan.highcharts();
	    
	    var timexAxis = timePlot.xAxis[0];
	    var timeyAxis = timePlot.yAxis[0];
	    var yExtremes = timeyAxis.getExtremes();
	    var xExtremes = timexAxis.getExtremes();
	    var realymin = yExtremes.min;
	    var realymax = yExtremes.max;
	    var realxmin = xExtremes.min;
	    var realxmax = xExtremes.max;
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
    // This is where the zoom function is bound to the projection plot
    projPlotCan.bind("plotselected", function(event,ranges) {
		     awareControl.zoom=true; 
		     timeOptions.yaxis.min=ranges.xaxis.from;
		     timeOptions.yaxis.max=ranges.xaxis.to;
		     awareControl.yMin=timeOptions.yaxis.min;
		     awareControl.yMax=timeOptions.yaxis.max;
		     

		     if(lastMin!=timeOptions.yaxis.min || lastMax!=timeOptions.yaxis.max) {
			 lastMin=timeOptions.yaxis.min;
			 lastMax=timeOptions.yaxis.max;	
			 plotAccordingToChoices();
		     }
		     });

    // This is where the zoom function is bound to the time plot
    timePlotCan.bind("plotselected", function (event, ranges) {
	awareControl.zoom=true; 
	timeOptions.xaxis.min=ranges.xaxis.from;
	timeOptions.xaxis.max=ranges.xaxis.to;
	timeOptions.yaxis.min=ranges.yaxis.from;
	timeOptions.yaxis.max=ranges.yaxis.to;
	awareControl.yMin=timeOptions.yaxis.min;
	awareControl.yMax=timeOptions.yaxis.max;
	
	if(lastMin!=timeOptions.yaxis.min || lastMax!=timeOptions.yaxis.max) {
	    lastMin=timeOptions.yaxis.min;
	    lastMax=timeOptions.yaxis.max;		    	    
	    plotAccordingToChoices();
	}
    });

    function resetZoom() {
	awareControl.zoom=false;
	var newxaxis= { mode: "time"};
	timeOptions.xaxis = newxaxis;
	var newyaxis = {};
	timeOptions.yaxis=newyaxis;
	if(lastMin!=0 || lastMax!=0) {
	    lastMin=0;
	    lastMax=0;
	    plotAccordingToChoices();
	}
    }


    timePlotCan.bind("plotunselected", function (event, ranges) {
			 resetZoom();
		 });


    projPlotCan.bind("plotunselected", function (event, ranges) {
			 resetZoom();
		 });
	
  
    plotAccordingToChoices();
}


/**
 * Sets the time and variable list in the awareControl object
 */
function setTimeAndVarList(awareControl,jsonObject) {
    awareControl.timeList=jsonObject.timeSum.timeList;
    awareControl.varList=jsonObject.timeSum.varList;
}


/**
 * This function calls getRunInstrumentDateAndPlot and then the simple hk time plotter
 */
function drawSimpleHkTimePlot(awareControl) {
    getRunInstrumentDateAndPlot(simpleHkPlotDrawer,awareControl);
}


/**
 * This function simply updates the plot title and the URL
 */
function updatePlotTitle(jsonObject,awareControl) {
    //Also update the page URL
    var currentUrl = [location.protocol, '//', location.host, location.pathname].join('');
    currentUrl=currentUrl+"?run="+getStartRunFromForm()+"&endrun="+getEndRunFromForm()+"&instrument="+getInstrumentNameFromForm()+"&plot="+getPlotNameFromForm()+"&timeType="+awareControl.timeType+"&hkType="+awareControl.hkType;
    var stateObj = { foo: "bar" };
    history.replaceState(stateObj, "page 2", currentUrl);

    var canContainer = $("#titleContainer"); 
    canContainer.empty();
    canContainer.append("<h1>"+getInstrumentNameFromForm()+" -- Run "+getStartRunFromForm()+"</h1>");
    var plotHeader = $("#plot-header-"+awareControl.plotId+" h3");
    plotHeader.text(getPlotLabelFromForm() +"-- Start Time "+jsonObject.timeSum.startTime+" UTC");
}


/**
 * This function actually draws the simple hk time plot
 */
function simpleHkPlotDrawer(awareControl) {
    var simpleHkTimeUrl=getHkTimeName(getInstrumentNameFromForm(),getStartRunFromForm(),awareControl.year,awareControl.dateCode,awareControl.hkType);

    function handleHkTimeJsonFile(jsonObject) {
	//Preparation by emptying things and writing labels
	updatePlotTitle(jsonObject,awareControl);
	awareControl.datasets = new Object();	
	var choiceContainer = $("#choices-"+awareControl.plotId);
	choiceContainer.empty();
	
	//Set the time and var list
	setTimeAndVarList(awareControl,jsonObject);

	//Actual do the drawing
	drawSimpleHkTime(getPlotNameFromForm(),awareControl);
    }



    ajaxLoadingLog(simpleHkTimeUrl);
    $.ajax({
	    url: simpleHkTimeUrl,
		type: "GET",
		dataType: "json", 
		success: handleHkTimeJsonFile,
		error: handleAjaxError
		}); 
    
}


/**
 * This function calls getRunInstrumentDateAndPlot and then the full hk time plotter
 */
function drawFullHkTimePlot(awareControl) {
    getRunInstrumentDateAndPlot(fullHkPlotDrawer,awareControl);
}

/**
 * This function actually draws the full hk time plot
 */
function fullHkPlotDrawer(awareControl) {
    var simpleHkTimeUrl=getHkTimeName(getInstrumentNameFromForm(),getStartRunFromForm(),awareControl.year,awareControl.dateCode,awareControl.hkType);

    function handleHkTimeJsonFile(jsonObject) {
	//Preparation by emptying things and writing labels
	updatePlotTitle(jsonObject,awareControl);
	var choiceContainer = $("#choices-"+awareControl.plotId);
	choiceContainer.empty();
	
	//Set the time and var list
	setTimeAndVarList(awareControl,jsonObject);

	//Actual fetch the full hk files
	fetchFullHkTime(getPlotNameFromForm(),awareControl);
    }

    //The ajax jquery function gets the JSON file from the URL and then calls file handler
    ajaxLoadingLog(simpleHkTimeUrl);
    $.ajax({
	url: simpleHkTimeUrl,
	type: "GET",
	dataType: "json",
	success: handleHkTimeJsonFile,
	error: handleAjaxError
    });     
}


/**
 * This function fetches the full hk time JSON files and then does the plotting
 */
function fetchFullHkTime(varNameKey,awareControl) {
    var fullHkTimeUrl=getFullHkTimeName(getInstrumentNameFromForm(),getStartRunFromForm(),awareControl.year,awareControl.dateCode,awareControl.hkType);

    var countFilesNeeded=0;
    var countFilesGot=0;

    /**
     * This function handles the unpacking of a full hk time JSON file
     */
    function handleFullHkTimeJsonFile(jsonObject) { 
	///First step is fill the full time list
	fillFullTimeArray(awareControl,jsonObject);
	for(var varIndex=0;varIndex<awareControl.varList.length;varIndex++) {
	    var varPoint=awareControl.varList[varIndex];
	    var varName = new String(varPoint.name);
	    var varLabel = new String(varPoint.label);
	    if(varName.indexOf(varNameKey)>=0) {
		var fullHkUrl=getFullHkName(getInstrumentNameFromForm(),getStartRunFromForm(),awareControl.year,awareControl.dateCode,varName,awareControl.hkType);
		countFilesNeeded++;

		//The jquery ajax call to fetch the full hk variable files
		ajaxLoadingLog(fullHkUrl);
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



    /**
     * This function counts the number of full hk files that can not be fetched
     */
    function handleFullHkError() {
	countFilesGot++; ///For now will just do this silly thing	
	if(countFilesNeeded==countFilesGot) {
	    actuallyDrawTheStuff(awareControl);
	}
    }
    
    /**
     * This function counts the number of full hk files that can be fetched
     */
    function handleFullHkJsonFile(jsonObject) { 
	countFilesGot++;
	addFullVariableToDataset(awareControl,jsonObject);
	if(countFilesNeeded==countFilesGot) {
	    actuallyDrawTheStuff(awareControl);
	}
    }
    
    //The jquery ajax call to fetch the full hk time file
    ajaxLoadingLog(fullHkTimeUrl);
    $.ajax({
	url: fullHkTimeUrl,
	type: "GET",
	dataType: "json",
	success: handleFullHkTimeJsonFile,
	error: handleAjaxError
    }); 
}


/**
 * This function is the multi run plotting master function
 */
function doMultiRunPlot(awareControl) {
    
    var plotName=getPlotNameFromForm();    
    var instrumentName=getInstrumentNameFromForm();
    var startRun=getStartRunFromForm();
    var endRun=getEndRunFromForm();
    if(endRun<=startRun) {
	return drawSimpleHkTimePlot(awareControl);	
    }


    var lastRunListFile;

    var countFilesNeeded=0;
    for(var thisRun=startRun;thisRun<=endRun;thisRun++) {	
	var runListFile=getRunListName(instrumentName,thisRun);
	
	function handleRunList(jsonObject) {
	    for(var i=0;i<jsonObject.runList.length;i++) {
		if(jsonObject.runList[i][0]>=startRun && jsonObject.runList[i][0]<=endRun) {
		    awareControl.year=jsonObject.runList[i][1];
		    awareControl.dateCode=jsonObject.runList[i][2]; ///RJN need to zero pad the string  	    
		    var hkFileName=getHkTimeName(instrumentName,jsonObject.runList[i][0],awareControl.year,awareControl.dateCode,awareControl.hkType);
		    countFilesNeeded++;		
	

		    ajaxLoadingLog(hkFileName);
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

	    ajaxLoadingLog(runListFile);
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
	    actuallyDrawTheStuff(awareControl);
	}
    }

    function addHkTimeFileToArrays(jsonObject) {
	countFilesGot++;
	if(countFilesGot==1) updatePlotTitle(jsonObject,awareControl);
	var varNameKey=plotName;
	var timeList=jsonObject.timeSum.timeList;
	var tempTimeArray = new Array();
	var varList=jsonObject.timeSum.varList;
	for(var index=0;index<timeList.length;index++) {
	    var timePoint=timeList[index];
	    awareControl.timeArray.push(timePoint.startTime*1000); ///< Javascript needs the number in milliseconds
	    tempTimeArray.push(timePoint.startTime*1000); ///< Javascript needs the number in milliseconds
	    //	    canContainer.append("<p>"+awareControl.timeArray[awareControl.timeArray.length-1]+"</p>")
	}

	//	canContainer.append("<p>"+countFilesGot+"</p>");
	//	canContainer.append("<p>"+awareControl.timeArray.length+" "+tempTimeArray.length+"</p>");

	
	for(var varIndex=0;varIndex<varList.length;varIndex++) {
	    var varPoint=varList[varIndex];
	    var varName = new String(varPoint.name);
	    var varLabel = new String(varPoint.label);
	    //	document.write(varName+"<br>");
	    if(varName.indexOf(varNameKey)>=0) {
		if(varName in awareControl.datasets) {
		    //		canContainer.append("<p>Got"+varName+"</p>");
		}
		else {
		    //	    document.write(varNameKey);
		    ///Got a variable
		    var dataSetsIndex=$.inArray(varName, awareControl.datasets);
		    //		canContainer.append("<p>Not got"+varName+"</p>");		    

		    if(dataSetsIndex<0) {
			
			var dataList = new Object();
			dataList.label=varLabel;
			dataList.data= new Array();
			dataList.yMin=Number.MAX_VALUE;
			dataList.yMax=-1*Number.MAX_VALUE;
			dataList.voidFlag=false;
			dataList.voidValue=0;
			if("voidValue" in varPoint) {
			    dataList.voidFlag=true;
			    dataList.voidValue=varPoint.voidValue;
			}	    
			

			
			
			awareControl.datasets[varName]=dataList;
		    }
		}
	    
		var varTimeList=varPoint.timeList;	    
		for(var index=0;index<varTimeList.length;index++) {
		    var dataPoint=varTimeList[index];

		    if(awareControl.datasets[varName].voidFlag)
			if(Math.abs(dataPoint.mean-awareControl.datasets[varName].voidValue)<1e-3) continue;

		    if(dataPoint.mean>awareControl.datasets[varName].yMax)
			awareControl.datasets[varName].yMax=dataPoint.mean;
		    if(dataPoint.mean<awareControl.datasets[varName].yMin)
			awareControl.datasets[varName].yMin=dataPoint.mean;
		    //RJN: Flot vs Highcharts
		    //		    awareControl.datasets[varName].data.push([tempTimeArray[index],dataPoint.mean,dataPoint.stdDev]); ///< Need to add stdDev
		    awareControl.datasets[varName].data.push([tempTimeArray[index],dataPoint.mean]); 
		}
	    }
	}
	
	if(countFilesNeeded==countFilesGot) {
	    actuallyDrawTheStuff(awareControl);
	}
    }

}





function drawPlots(plotControl) {   

    var awareControl = plotControl;
    awareControl.year=2013;
    awareControl.datecode=123;

    var timePlotCan=$("#"+awareControl.timeCanName);
    var projPlotCan=$("#"+awareControl.projCanName);
    var choiceContainer =$("#choices-"+awareControl.plotId);
    var labelContainer=$("#divLabel-"+awareControl.plotId);
    var textContainer=$("#plot-text-"+awareControl.plotId);
    var titleContainer=$("#titleContainer"); 
    titleContainer.empty();
    timePlotCan.empty();
    projPlotCan.empty();
    textContainer.empty();
    timePlotCan.append("<h2>Loading</h2>");
    choiceContainer.empty();
    labelContainer.empty();
    awareControl.datasets = new Object();
    awareControl.timeArray=[];
    awareControl.timeArray.length=0;

    if(awareControl.timeType.indexOf("simple")>=0) drawSimpleHkTimePlot(awareControl);
    else if(awareControl.timeType.indexOf("full")>=0) drawFullHkTimePlot(awareControl);
    else if(awareControl.timeType.indexOf("multiRun")>=0) doMultiRunPlot(awareControl);
    else if(awareControl.timeType.indexOf("timeRange")>=0) doMultiRunPlot(awareControl);
    else if(awareControl.timeType.indexOf("histo")>=0) drawHistogram(awareControl);

	    
}




