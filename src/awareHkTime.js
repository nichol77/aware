//////////////////////////////////////////////////////////////////////////////
/////                                                                    /////
/////   awareHkTime.js                                                   /////
/////                                                                    /////
/////   Simple javascript for getting housekeeping data in JSON format   /////
/////   and plotting using the flot library.                             /////
/////                                                                    /////
/////   March 2013, r.nichol@ucl.ac.uk                                   /////
//////////////////////////////////////////////////////////////////////////////



/* Globals */
var stationName;
var runNumber;
var startTime;
var duration;

var timeList;// = new Array();
var varList;


function drawHkTime(canName,varNameKey) {
    var timeArray=[];    
    for(var index=0;index<timeList.length;index++) {
	var timePoint=timeList[index];
	timeArray.push(timePoint.startTime*1000); ///< Javascript needs the number in milliseconds
    }


    var datasets = new Object();
    
    //    document.write(timeArray.length+"<br>");
    //    document.write(varList.length+"<br>");

    
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
		dataList.data.push([timeArray[index],dataPoint.mean]); ///< Need to add stdDev
	    }
	    datasets[ varName ]=dataList;
	}
	
    }



    var i = 0;
    $.each(datasets, function(key, val) {
	       val.color = i;
	       ++i;
	   });
    

    // insert checkboxes 
    var choiceContainer = $("#choices");
    $.each(datasets, function(key, val) {
	       choiceContainer.append("<br/><input type='checkbox' name='" + key +
				      "' checked='checked' id='id" + key + "'></input>" +
				      "<label for='id" + key + "'>"
				      + val.label + "</label>");
	   });

    choiceContainer.find("input").click(plotAccordingToChoices);

    function plotAccordingToChoices() {

	var data = [];

	choiceContainer.find("input:checked").each(function () {
						       var key = $(this).attr("name");
						       if (key && datasets[key]) {
							   data.push(datasets[key]);
						       }
						   });

	if (data.length > 0) {
	    $.plot($("#"+canName), data, {
		    yaxis: {
			   min: 0
			       },
			   xaxis: {
			   mode: "time"
			       }
		});
	}
    }

    plotAccordingToChoices();


}




function setTimeAndVarList(jsonObject) {
    timeList=jsonObject.timeSum.timeList;
    varList=jsonObject.timeSum.varList;
}


 

function drawHkTimePlot(canName, plotName, station,run) {
    
    var dataurl=getHkTimeName(station,run);


    function onDataReceived(jsonObject) {
	var l1Array = [];
	var l1ArrayErrors = [];
	var countData=0;
	setTimeAndVarList(jsonObject);
	drawHkTime(canName,plotName);
	    }

    
    $.ajax({
	    url: dataurl,
		type: "GET",
		dataType: "json",
		success: onDataReceived
		}); 
}
