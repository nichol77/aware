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
    timeList=null
    if ("time" in jsonObject) {
	timeList=jsonObject.time.timeList;
    }
    else if("full" in jsonObject) {
	timeList=jsonObject.full.timeList;
    }
    else {
	var canContainer = $("#titleContainer");
	canContainer.append("<p>Can not find time list</p>");
	return
    }
	
    
    for(var index=0;index<timeList.length;index++) {
	var timePoint=timeList[index];
	awareControl.timeArray.push(timePoint*1000); ///< Javascript needs the number in milliseconds
    }
}


/**
* Data handling function to add data points from the JSON AWARE object to the list of datasets
* @params awareControl is the global aware control object
* @params jsonObject is an object corresponding to an AWARE Full JSON file
*/
function addFullVariableToDataset(awareControl,varPoint) { 
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
    }
    if(yAxisOpt=="dydx") {
	needToScaleYAxis=true;
    }
    $('#debugContainer').append("<p>projMin&Max"+" "+projMin+" "+projMax+"</p>");

    $('#debugContainer').append("<p>getDataForPlot: "+xaxisMin+" "+xaxisMax+" "+projMin+" "+projMax+"</p>");


    
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
	       timeDataList.type='scatter';
	       timeDataList.name=String(val.label);
	       projDataList.name=String(val.label);
	       timeDataList.id=String(varName);
	       projDataList.id=String(varName);
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


    //Set up the options for the time and projection plots
  

    var highchartsTimeObj = {
	chart: {
	    zoomType:'xy',
	    animation:false,	
	    events: {
		selection: selectionOnTimePlot
	    },
	    resetZoomButton: {
		theme: {
		    display: 'none'
		}
	    }
	},
	credits: { enabled: false},
	title: { text: '' },
	subtitle: { text: document.ontouchstart === undefined ?
	            'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'},
	xAxis: {type: 'datetime'},
	yAxis: {
	    title: { text:'Thing' }	  
	},
	legend: {
	    enabled: true ,
	    itemStyle: {
                color: '#000000',
                fontSize: '8px'
	    }
	},
	tooltip: { enabled: false},
	plotOptions: {
	    series: {
		states: {
		    hover: {
			enabled: false
		    }
		},
		events: {
		    legendItemClick : legendClickHandler
		}
	    }
	}
    }
    
    var highchartsProjObj = {
	chart: { 
	    zoomType:'x', 
	    animation:false,
	    events: {
		selection: selectionOnProjPlot
	    },
	    resetZoomButton: {
		theme: {
		    display: 'none'
		}
	    }	    
	},
	credits: { enabled: false},
	title: { text: '' },
	subtitle: { text: document.ontouchstart === undefined ?
	            'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'},
	xAxis: {
	    title : {
		text:'Thing2'
	    }
	},
	yAxis: {title: { text:'' }},
	legend: { enabled: false , 
		  floating: true,
		  align: 'right',
		  verticalAlign: 'top',
		  layout: 'vertical',
		  itemStyle: {
                      color: '#000000',
                      fontSize: '8px'
		  }},
	tooltip: { enabled: false},
		plotOptions: {
		    series: {
			states: {
			    hover: {
				enabled: false
			    }
			}
		    }
		}
    }
    
    

    var timeChart;	
    var projChart;

    awareControl.zoom=false;

    var xmin=0;
    var xmax=0;
    
    if(!getXAutoScale() && !awareControl.zoom) {
	highchartsTimeObj.xAxis.min=getXMin();
	highchartsTimeObj.xAxis.max=getXMax();
    }	
    
    if(!getYAutoScale()) {
	
	highchartsTimeObj.yAxis.min=getYMin();
	highchartsTimeObj.yAxis.max=getYMax();
    }
    
    if("min" in highchartsTimeObj.xAxis) {
	xmin=highchartsTimeObj.xAxis.min;
	xmax=highchartsTimeObj.xAxis.max;
    }
    var timeData = [];
    var projData = [];


    $('#debugContainer').append("<p>plotAccordingToChoices xmin: "+xmin+" xmax: "+xmax+"</p>");
    
    var smallHolder=getDataForPlot(awareControl,xmin,xmax);
    var smallTime=smallHolder.timeDataset;
    var smallProj=smallHolder.projDataset;


    $.each(smallTime, function(key, val) {	  
	       if (key && smallTime[key]) {
		   timeData.push(smallTime[key]);
	       }
	       if (key && smallProj[key]) {
		   projData.push(smallProj[key]);
	       }
	   });
    
    var fullTimeData = timeData;
    var fullProjData = projData;


    function legendClickHandler(event) {
	console.log(event);
	console.log(projChart.series[this.index]);
	if(projChart.series[this.index].visible)
	    projChart.series[this.index].visible=false;
	else
	    projChart.series[this.index].visible=true;	
	console.log(projChart.series[this.index]);
	projChart.redraw()
	$('#debugContainer').append("<p>legendClickHandler: "+this.index+"</p>");
	
    }

    //This function plots the variables according to which checkboxes are ticked
    function plotAccordingToChoices() {
	
	if (timeData.length > 0) {

	    highchartsTimeObj.series=timeData;
	    highchartsProjObj.series=projData;
	   	    
	    timePlotCan.highcharts(highchartsTimeObj);
	    projPlotCan.highcharts(highchartsProjObj);

	    timeChart=timePlotCan.highcharts();
	    projChart=projPlotCan.highcharts();
	    updateScaleMinMax();

	}

    }

    function updateScaleMinMax() {
	var timexAxis = timeChart.xAxis[0];
	var timeyAxis = timeChart.yAxis[0];
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


    function selectionOnProjPlot(event) {

	$('#debugContainer').append("<p>selectionOnProjPlot event triggered</p>");
	if (event.xAxis) {
	    var xAxis = event.xAxis[0],
		ymin = xAxis.min,
		ymax = xAxis.max;
	
	    // indicate to the user that something's going on
	    timeChart.showLoading();
	    projChart.showLoading();    
	    highchartsTimeObj.yAxis.min=ymin;
	    highchartsTimeObj.yAxis.max=ymax;
	    highchartsProjObj.xAxis.min=ymin;
	    highchartsProjObj.xAxis.max=ymax;
	    awareControl.zoom=true;
	    awareControl.yMin=ymin;
	    awareControl.yMax=ymax;
	    $('#debugContainer').append("<p>"+ymin+" "+ymax+"</p>");
	    updateChartsWithZoomData();
	}
    }


    function selectionOnTimePlot(event) {
	$('#debugContainer').append("<p>selectionOnTimePlot event triggered</p>");
	if (event.xAxis) {
	    var xAxis = event.xAxis[0],
		xmin = xAxis.min,
		xmax = xAxis.max;

	    var yAxis = event.yAxis[0],
		ymin = yAxis.min,
		ymax = yAxis.max;

	    $('#debugContainer').append("<p>selection xmin: "+xmin+" xmax: "+xmax+"</p>");
	    
	    // indicate to the user that something's going on
	    timeChart.showLoading();
	    projChart.showLoading();
	    	    	
	    highchartsTimeObj.xAxis.min=xmin;
	    highchartsTimeObj.xAxis.max=xmax;
	    highchartsTimeObj.yAxis.min=ymin;
	    highchartsTimeObj.yAxis.max=ymax;
	    highchartsProjObj.xAxis.min=ymin;
	    highchartsProjObj.xAxis.max=ymax;
	    awareControl.zoom=true;
	    awareControl.yMin=ymin;
	    awareControl.yMax=ymax;
	    updateChartsWithZoomData();
	    
	}	
    }
    

    function updateChartsWithZoomData() {
	var xmin=0;
	var xmax=0;
	if("min" in highchartsTimeObj.xAxis) {
	    xmin=highchartsTimeObj.xAxis.min;
	    xmax=highchartsTimeObj.xAxis.max;
	}
	
	var smallHolder=getDataForPlot(awareControl,xmin,xmax);
	var smallTime=smallHolder.timeDataset;
	var smallProj=smallHolder.projDataset;
	
	timeData = Array();
	projData = Array();
	
	$.each(smallTime, function(key, val) {	  
		   if (key && smallTime[key]) {
		       timeData.push(smallTime[key]);
		   }
		   if (key && smallProj[key]) {
		       projData.push(smallProj[key]);
		   }
	       });

	//	    console.log(projData[0]);
	for(var i=0;i<timeData.length;i++) {
	    timeChart.series[i].setData(timeData[i].data,false);
	}
	
	for(var i=0;i<projData.length;i++) {
	    projChart.series[i].setData(projData[i].data,false);
	}
	timeChart.hideLoading();
	//	timeChart.redraw();
	if("min" in highchartsTimeObj.yAxis) {
	    timeChart.yAxis[0].setExtremes(highchartsTimeObj.yAxis.min,highchartsTimeObj.yAxis.max);
	}
	projChart.hideLoading();
	$('#debugContainer').append("<p>highchartsProjObj.xAxis.min: "+highchartsProjObj.xAxis.min+" max: "+highchartsProjObj.xAxis.max+"</p>");

	var extremes=timeChart.yAxis[0].getExtremes();
	projChart.xAxis[0].setExtremes(extremes.min,extremes.max);
	var projExtremes=projChart.xAxis[0].getExtremes();
	updateScaleMinMax();
	
	$('#debugContainer').append("<p>projExtremes: "+projExtremes.min+" max: "+projExtremes.max+"</p>");
	    
	// use jQuery HTML capabilities to add a button to reset the selection 
	timeChart.$resetButton = $('<button>Reset view</button>')
	    .css({
		    position: 'absolute',
			top: '20px',
			right: '50px',
			zIndex: 50
			})
	    .click(function() {
		       resetSelection()
			   })
	    .appendTo(timeChart.container);
	
    }
   
    
    // Reset to normal view
    function resetSelection() {
	delete highchartsTimeObj.xAxis.min;
	delete highchartsTimeObj.xAxis.max;


	awareControl.zoom=false;
	for(var i=0;i<fullTimeData.length;i++) {
	    timeChart.series[i].setData(fullTimeData[i].data,false);
	}
	timeChart.$resetButton.remove();
	timeChart.redraw();
	timeChart.xAxis[0].setExtremes(undefined,undefined);
	timeChart.yAxis[0].setExtremes(undefined,undefined);

	for(var i=0;i<fullProjData.length;i++) {
	    projChart.series[i].setData(fullProjData[i].data,false);
	}
	var extremes=timeChart.yAxis[0].getExtremes();
	projChart.xAxis[0].setExtremes(extremes.min,extremes.max);
    }
    

  
	
  
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
	//Old method which uses individual json files for each variable
	//	fetchFullHkTime(getPlotNameFromForm(),awareControl);

	//New method which uses one bog json file per run
	fetchSingleFullHkTime(getPlotNameFromForm(),awareControl);
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
	addFullVariableToDataset(awareControl,jsonObject.full);
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
 * This function fetches the full hk time JSON files and then does the plotting
 */
function fetchSingleFullHkTime(varNameKey,awareControl) {
    var singleFullHkUrl=getSingleFullHkName(getInstrumentNameFromForm(),getStartRunFromForm(),awareControl.year,awareControl.dateCode,awareControl.hkType);

    /**
     * This function handles the unpacking of a full hk time JSON file
     */
    function handleSingleFullHkJsonFile(jsonObject) { 
	///First step is fill the full time list

	fillFullTimeArray(awareControl,jsonObject);
	for(var varIndex=0;varIndex<awareControl.varList.length;varIndex++) {
	    var varPoint=awareControl.varList[varIndex];
	    var varName = new String(varPoint.name);
	    var varLabel = new String(varPoint.label);
	    if(varName.indexOf(varNameKey)>=0) {
		//Do something
		if(varName in jsonObject) {
//		    $('#debugContainer').append("<p>Looking for "+varName+" in jsonObject</p>");
		    addFullVariableToDataset(awareControl,jsonObject[varName]);
		}
		else {
		    $('#debugContainer').append("<p>Can't find "+varName+" in jsonObject</p>");
		}
	    }	
	}
	actuallyDrawTheStuff(awareControl);
    }
        
    //The jquery ajax call to fetch the full hk time file
    ajaxLoadingLog(singleFullHkUrl);
    $.ajax({
	url: singleFullHkUrl,
	type: "GET",
	dataType: "json",
	success: handleSingleFullHkJsonFile,
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




