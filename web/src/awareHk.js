

//////////////////////////////////////////////////////////////////////////////
/////                                                                    /////
/////   awareHk.js                                                       /////
/////                                                                    /////
/////   Simple javascript for getting housekeeping data in JSON format   /////
/////   and plotting using the flot library.                             /////
/////                                                                    /////
/////   March 2013, r.nichol@ucl.ac.uk                                   /////
//////////////////////////////////////////////////////////////////////////////

/**
 * This function simply updates the plot title and the URL
 */
function updatePlotTitleHk() {
    //Also update the page URL
    var currentUrl = [location.protocol, '//', location.host, location.pathname].join('');
    currentUrl=currentUrl+"?run="+getStartRunFromForm()+"&instrument="+getInstrumentNameFromForm()+"&hkType="+getHkTypeFromForm();
    var stateObj = { foo: "bar" };
    history.replaceState(stateObj, "page 2", currentUrl);

    var canContainer = $("#titleContainer"); 
    canContainer.empty();
    canContainer.append("<h1>"+getInstrumentNameFromForm()+" -- Run "+getStartRunFromForm()+"</h1>");
}



/* Globals */

function drawHkBarChart(canName,varNameKey,colour,dpList) {

    //    $("#debugContainer").append("<p>drawHkBarChart  "+varNameKey+ " "+colour+"</p>");
    
    var highchartsObj = {
	title: {
	    text:''
	},
	subtitle: {
	    text:''
	},
	xAxis: {
	    categories : [ ],
	    crosshair:true
	},
	yAxis: {
	    min:0
	},
	tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y}</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        }
    };

    var dataObject = {
	type: 'column',
	data: []
    };

    var errorObject = {
	type: 'errorbar',
	data: []
    };
	    


    for(var index=0;index<dpList.length;index++) {
	var dp2=dpList[index];
	var dpName=new String(dp2.name);
	var n=dpName.indexOf(varNameKey);	
	if(n>=0) {

	    //	    $("#debugContainer").append("<p>Got point  "+dpName+" "+justNum+" </p>"); 
	    highchartsObj.xAxis.categories.push(dp2.label);
	    dataObject.data.push(dp2.mean);
	    if(dp2.numEnts>0) {
		var error=dp2.stdDev/Math.sqrt(dp2.numEnts);
		errorObject.data.push([dp2.mean-error,dp2.mean+error]);
	    }
	    else {
		errorObject.data.push([dp2.mean,dp2.mean]);
	    }
	}
    }
    
    highchartsObj.series=[];
    highchartsObj.series.push(dataObject);
    highchartsObj.series.push(errorObject);
    


    var hkPlotCan=$("#"+canName);    
    hkPlotCan.highcharts(highchartsObj);

}


function drawHk2DChart(canName,varNameKey,xNameKey,colour,dpList,legendShowOpt) {
    var dataObject = new Object();
    var dataArrayErrors = [];
    var countData=0;

    $("#debugContainer").append("<p>drawHk2DChart  "+varNameKey+ " "+xNameKey+"</p>");


    var xObject = {};

    for(var index=0;index<dpList.length;index++) {
	var dp2=dpList[index];
	var dpName=new String(dp2.name);
	var n=dpName.indexOf(xNameKey);
	if(n>=0) {
	    var tag=dpName.substring(xNameKey.length)
		//	    $("#debugContainer").append("<p>dpName  "+dpName+" "+tag+"</p>");
	    xObject[tag]=dp2.mean;
	}
	
    }


    for(var index=0;index<dpList.length;index++) {
	var dp2=dpList[index];
	var dpName=new String(dp2.name);
	var n=dpName.indexOf(varNameKey);
	if(n>=0) {
	    
	    //	    $("#debugContainer").append("<p>dpName  "+dpName+"</p>");
	    var tagPos=dpName.lastIndexOf("_");
	    var tag=dpName.substring(tagPos);
	    var variable=dpName.substring(0,tagPos)
		//	    $("#debugContainer").append("<p>dpName  "+variable+" "+tag+"</p>");
	    if(variable in dataObject) {
		//Already started this array
	    }
	    else {
		dataObject[variable]={};
		dataObject[variable].data = new Array();
		dataObject[variable].label=variable;
	    }
	    dataObject[variable].data.push([xObject[tag],dp2.mean]);	   	    
	}
    }
    
    var dataArray = new Array();

    for (var key in dataObject) {
	var obj = dataObject[key];
	dataArray.push(obj);
    }
    var options = {
	series: {
	    lines: { show: false },
	    points: { show: true }
	},
	legend: {show:legendShowOpt}

    };


	
    $.plot($("#"+canName), dataArray ,options);
    

}




function drawHistogram(awareControl) {
    
    var simpleHkUrl=getHkName(getInstrumentNameFromForm(),getStartRunFromForm(),awareControl.year,awareControl.dateCode,getHkTypeFromForm());

    function handleHkJsonFile(jsonObject) {
	updatePlotTitleHk();
	var plotId=1;
	var plotName=getPlotNameFromForm();
	var plotType=getXaxisOpt(plotName);
	if(plotType=="time") {
	    drawHkBarChart(awareControl.timeCanName,plotName,plotId,jsonObject.runsum.varList);
	}
	else {
	    drawHk2DChart(awareControl.timeCanName,plotName,plotType,plotId,jsonObject.runsum.varList,true);
	}
	
    }


    
    ajaxLoadingLog(simpleHkUrl);
    $.ajax({
	  url: simpleHkUrl,
	  type: "GET",
	  dataType: "json",
	  success: handleHkJsonFile,
	  error: handleAjaxError
    }); 
}

 

function drawRunSummaryHkJSON(awareControl) {
    
    var simpleHkUrl=getHkName(getInstrumentNameFromForm(),getStartRunFromForm(),awareControl.year,awareControl.dateCode,getHkTypeFromForm());

    function handleHkJsonFile(jsonObject) {
	updatePlotTitleHk();
	for(var plotId=0;plotId<awareControl.numPlots;plotId++) {
	    var plotName=awareControl.plotList[plotId].name;
	    var plotType=getXaxisOpt(plotName);
	    if(plotType=="time") {
		drawHkBarChart("runsum-cont-"+plotId,plotName,plotId,jsonObject.runsum.varList);
	    }
	    else {
		drawHk2DChart("runsum-cont-"+plotId,plotName,plotType,plotId,jsonObject.runsum.varList,false);
	    }
	    
	}
    }

    
    ajaxLoadingLog(simpleHkUrl);
    $.ajax({
	  url: simpleHkUrl,
	  type: "GET",
	  dataType: "json",
	  success: handleHkJsonFile,
	  error: handleAjaxError
    }); 
}


function makePlotGrid(awareControl) {
    //In this function we need to divide the plot-content-1 div up into lots of little divs
    var plotDiv=$("#plot-content-1");
    plotDiv.empty();
    
    for(var plotId=0;plotId<awareControl.numPlots;plotId++) {
	var holderName="runsum-holder-"+plotId;
	var headerName="runsum-header-"+plotId;
	var contName="runsum-cont-"+plotId;
	var plotLabel=awareControl.plotList[plotId].label;
	var plotUrl="awareHk.php?run="+getStartRunFromForm()+"&instrument="+getInstrumentNameFromForm()+"&hkType="+getHkTypeFromForm()+"&plot="+awareControl.plotList[plotId].name;
	plotDiv.append("<a href=\""+plotUrl+"\"><div class=\"runsum-holder\" id=\""+holderName+"\" style=\"float:left;height:"+awareControl.height+"%; width:"+awareControl.width+"%;\"> <div class=\"runsum-header\" id=\""+headerName+"\" ><h4 style=\"padding-top:0px\">"+plotLabel+"</h4></div><div class=\"runsum-cont\" id=\""+contName+"\"></div></div></a>");
    }

}



function drawPlots(plotControl) {
    plotControl.plotList=getPlotNameLabelList();
    plotControl.numPlots=plotControl.plotList.length;
    plotControl.numPerRow=Math.floor(Math.sqrt(plotControl.numPlots));
    if(plotControl.numPerRow>5) plotControl.numPerRow=5;
    plotControl.numRows=Math.floor(plotControl.numPlots/plotControl.numPerRow);
    if(plotControl.numRows*plotControl.numPerRow<plotControl.plotList.length) plotControl.numRows++;
    
    plotControl.width=100/plotControl.numPerRow;

    plotControl.height=95/plotControl.numRows;
    if(plotControl.height<20) {
	maxPlotHeight= $('#plot-holder-1').height();
	maxPlotHeight=maxPlotHeight*20/plotControl.height;
	$('#plot-holder-1').height(maxPlotHeight); 
//	plotControl.height=20;
    }
    
    $("#debugContainer").append("plotList.length  "+plotControl.plotList.length);
    $("#debugContainer").append("numRows  "+plotControl.numRows);
    $("#debugContainer").append("numPerRow  "+plotControl.numPerRow);
    makePlotGrid(plotControl);

    getRunInstrumentDateAndPlot(drawRunSummaryHkJSON,plotControl);
}

