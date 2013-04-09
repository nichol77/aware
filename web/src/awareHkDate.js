


//Here are the plots that use the date selector
function drawDateHkTimePlot() {
    getRunListFromDateAndPlot();
}



function getRunListFromDateAndPlot() {

    plotName=getPlotNameFromForm();    
    instrumentName=getInstrumentNameFromForm();
    var dateString=document.getElementById("datepicker").value;
    var firstSlash=dateString.indexOf("/");
    var monthString=dateString.substring(0,dateString.indexOf("/"));
    var dayString=dateString.substring(dateString.indexOf("/")+1,dateString.lastIndexOf("/"));
    var yearString=dateString.substring(dateString.lastIndexOf("/")+1);
    var realDateCode=monthString+dayString;
    datecode=parseInt(realDateCode);
    year=parseInt(yearString);
    var dateRunListUrl=getDateRunListName(instrumentName,year,datecode);


    var canContainer = $("#titleContainer"); 

    var countFilesNeeded=0;
    function handleDateRunList(jsonObject) {
	
	canContainer.empty();
	canContainer.append("<h1>"+instrumentName+" -- Date "+dayString+"/"+monthString+"/"+year+"</h1>");
	canContainer.append("<h2> Plot "+plotName+"</h2>");

	//	timeArray.length=0;// = new Array();
	var choiceContainer = $("#choices");
	choiceContainer.empty();
	
	
	for(var i=0;i<jsonObject.runList.length;i++) {
	    var startRun=jsonObject.runList[i];
	    var hkFileName=getHkTimeName(instrumentName,startRun,year,datecode,thisHkType);
	    //	    canContainer.append("<p>"+hkFileName+" "+countFilesNeeded+"</p>");
	    countFilesNeeded++;
	    
	    

	    $.ajax({
		    url: hkFileName,
			type: "GET",
			dataType: "json",
			success: addHkTimeFileToArrays
			});
	    //Get simple hk files
	    //Add to some arrays
	    //Fill variables for plot
    
	}
    }

    
    
    $.ajax({
	    url: dateRunListUrl,
		type: "GET",
		dataType: "json",
		success: handleDateRunList
		});
    

    var countFilesGot=0;
    function addHkTimeFileToArrays(jsonObject) {
	countFilesGot++;
	var varNameKey=plotName;
	var timeList=jsonObject.timeSum.timeList;
	var tempTimeArray = new Array();
	var varList=jsonObject.timeSum.varList;
	for(var index=0;index<timeList.length;index++) {
	    var timePoint=timeList[index];
	    timeArray.push(timePoint.startTime*1000); ///< Javascript needs the number in milliseconds
	    tempTimeArray.push(timePoint.startTime*1000); ///< Javascript needs the number in milliseconds
	    //	    canContainer.append("<p>"+timeArray[timeArray.length-1]+"</p>")
	}

	//	canContainer.append("<p>"+countFilesGot+"</p>");
	//	canContainer.append("<p>"+timeArray.length+" "+tempTimeArray.length+"</p>");

	
	for(var varIndex=0;varIndex<varList.length;varIndex++) {
	    var varPoint=varList[varIndex];
	    var varName = new String(varPoint.name);
	    var varLabel = new String(varPoint.label);
	    //	document.write(varName+"<br>");
	    if(varName.indexOf(varNameKey)>=0) {
		if(varName in datasets) {
		//		canContainer.append("<p>Got"+varName+"</p>");
		}
		else {
		    //	    document.write(varNameKey);
		    ///Got a variable
		    var dataSetsIndex=$.inArray(varName, datasets);
		    //		canContainer.append("<p>Not got"+varName+"</p>");
		    if(dataSetsIndex<0) {
			
			var dataList = new Object();
			dataList.label=varLabel;
			dataList.data= new Array();
			
			
			datasets[varName]=dataList;
		    }
		}
	    
		var varTimeList=varPoint.timeList;	    
		for(var index=0;index<varTimeList.length;index++) {
		    var dataPoint=varTimeList[index];
		    datasets[varName].data.push([tempTimeArray[index],dataPoint.mean,dataPoint.stdDev]); ///< Need to add stdDev 
		    //		    canContainer.append("<p>"+index+" "+tempTimeArray[index]+" "+dataPoint.mean+"</p>");
		}
	    
	    //	    canContainer.append("<p>"+varName+" "+datasets[varName].data.length+" "+timeList.length+"</p>");
	    
	    }
	}
	
	if(countFilesNeeded==countFilesGot) {
	    //	    canContainer.append("<p>"+countFilesNeeded+"  "+countFilesGot+"</p>");
	    actuallyDrawTheStuff();
	}
    }

}