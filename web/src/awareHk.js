

//////////////////////////////////////////////////////////////////////////////
/////                                                                    /////
/////   awareHk.js                                                       /////
/////                                                                    /////
/////   Simple javascript for getting housekeeping data in JSON format   /////
/////   and plotting using the flot library.                             /////
/////                                                                    /////
/////   March 2013, r.nichol@ucl.ac.uk                                   /////
//////////////////////////////////////////////////////////////////////////////



/* Globals */

function drawHk(canName,varNameKey,colour,dpList) {
    var dataArray = [];
    var dataArrayErrors = [];
    var countData=0;
    for(var index=0;index<dpList.length;index++) {
	var dp2=dpList[index];
	var dpName=new String(dp2.name);
	var n=dpName.indexOf(varNameKey);
	if(n>=0) {
	    dataArray.push([countData,dp2.mean]);
	    if(dp2.numEnts>0) {
		dataArrayErrors.push(dp2.stdDev/Math.sqrt(dp2.numEnts));
	    }
	    else {
		dataArrayErrors.push(0);
	    }

	    countData++;
	}
    }
    
    
    var data3_points = {
	//do not show points	
	radius: 0,
	errorbars: "y", 
	yerr: {show:true, upperCap: "-", lowerCap: "-", radius: 5}
    };
    

	
    for (var i = 0; i < dataArray.length; i++) {
	dataArrayErrors[i] = dataArray[i].concat(dataArrayErrors[i])
	    }
    
    var flotData = [
		// bars with errors
    {data: dataArray, color: colour, bars: {show: true, align: "center", barWidth: 1}},
    {data: dataArrayErrors, color: colour, lines: {show: false }, points: data3_points}
    ];

    var flotOptions = { 
	xaxis: {show:true, labelHeight:30, font:{size:8, color:"black"}}, 
	yaxes: [{show:true, labelWidth:30, font:{size:8, color:"black"}, label:"Boo"}]
    }

    $.plot($("#"+canName), flotData, flotOptions );



}




 

function drawRunSummaryHkJSON(awareControl) {
    
    var simpleHkUrl=getHkName(getInstrumentNameFromForm(),getStartRunFromForm(),awareControl.year,awareControl.dateCode,getHkTypeFromForm());

    function handleHkJsonFile(jsonObject) {
	updatePlotTitle();
	for(var plotId=0;plotId<awareControl.numPlots;plotId++) {
	    var plotName=awareControl.plotList[plotId].name;	    
	    drawHk("runsum-cont-"+plotId,plotName,plotId,jsonObject.runsum.varList);
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
    plotControl.numRows=Math.floor(Math.sqrt(plotControl.numPlots));
    plotControl.numPerRow=Math.floor(plotControl.numPlots/plotControl.numRows);
    plotControl.width=100/plotControl.numPerRow;
    plotControl.height=100/plotControl.numRows;
	     
    //    $("#debugContainer").append("plotList.length  "+plotList.length);
    //    $("#debugContainer").append("numRows  "+numRows);
    //    $("#debugContainer").append("numPerRow  "+numPerRow);
    makePlotGrid(plotControl);

    getRunInstrumentDateAndPlot(drawRunSummaryHkJSON,plotControl);
}


/**
 * This function simply updates the plot title and the URL
 */
function updatePlotTitle() {
    //Also update the page URL
    var currentUrl = [location.protocol, '//', location.host, location.pathname].join('');
    currentUrl=currentUrl+"?run="+getStartRunFromForm()+"&instrument="+getInstrumentNameFromForm()+"&hkType="+getHkTypeFromForm();
    var stateObj = { foo: "bar" };
    history.replaceState(stateObj, "page 2", currentUrl);

    var canContainer = $("#titleContainer"); 
    canContainer.empty();
    canContainer.append("<h1>"+getInstrumentNameFromForm()+" -- Run "+getStartRunFromForm()+"</h1>");
}