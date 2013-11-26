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
	    dataArrayErrors.push(dp2.stdDev);
	    countData++;
	}
    }
    
    //    $.plot($("#"+canName), [ {data : dataArray, bars: { show: true }} ]);
    
    var data3_points = {
	//do not show points	
	radius: 0,
	errorbars: "y", 
	yerr: {show:true, upperCap: "-", lowerCap: "-", radius: 5}
    };
    

	
    for (var i = 0; i < dataArray.length; i++) {
	dataArrayErrors[i] = dataArray[i].concat(dataArrayErrors[i])
	    }
    
    var data = [
		// bars with errors
    {data: dataArray, color: colour, bars: {show: true, align: "center", barWidth: 1}},
    {data: dataArrayErrors, color: colour, lines: {show: false }, points: data3_points}
    ];

    $.plot($("#"+canName), data );



}




 

function drawRunSummaryHkJSON(instrument,run) {
    
    var dataurl=getHkName(instrument,run);

    function onDataReceived(jsonObject) {
	drawHk("plot-content-1","singleChannelThreshold","green",jsonObject.runsum.varList);
    }

    
    $.ajax({
	url: dataurl,
	type: "GET",
	dataType: "json",
	success: onDataReceived
    }); 
}


function drawPlots(plotControl) {
    drawRunSummaryHkJSON(plotControl.instrument,plotControl.run);

}
