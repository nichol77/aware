/**
 * A simple javascript module for getting telemetry or housekeeping 
 * data in JSON format and storing a number of events in local storage
 * plotting using the <a href="www.flotcharts.org">Flot Library</a>.
 * This can take the form of a map or other types of plot,
 * the data can then be filtered to give more useful events.
 * @author Chris Davenport <chrispdavenport@googlemail.com>
 */

/****************************************************************************/
/************REQUIRES awareMap.js TO BE INCLUDED IN THE MAIN PAGE************/
/****************************************************************************/

//////////////////////////////////////////////////////////////////////////////
/////                                                                    /////
/////   awareAnalysisPlotter.js                                          /////
/////                                                                    /////
/////   Simple javascript for plotting ANITA config or events            /////
/////                                                                    /////
/////   Jan 2015, chrispdavenport@googlemail.com                         /////
/////																	 /////
//////////////////////////////////////////////////////////////////////////////

var plotHolderID = '#plot-content-1';
var Events = new Object();

$(document).ready(function(e) {
	// Initilise
	//localStorage.clear();
	viewMostRecentRun();
	loadEventJson(300,350);
	var plotData = preparePlotData('dynamicPhiThresholdOverRate',300,350);
	var plotOptions = {
						series: {
							points: { show: true }
						},
						data: 'rawData'
						};
	initialisePlotHolder();	
	var plot = $.plot($(plotHolderID), [plotData], plotOptions);
});

function consoleLog(msg) {
	// wrapper to handle the fact that chrome doesn't allow the overriding/alteration of the default console.log method
	console.log(msg);
	$("#debugContainer").append("<p>"+msg+"</p>");
}

function updateConfigOptions(configOptions) {
	// Called by the last run config getter to also update the options in the selector box for the rest of the plotting.
	$.each(configOptions, function(name, value) {
		$("#configSelector")
					.append($("<option></option>")
					.attr("value",name)
					.text(name));
	
	});
}

function handleParamChange() {
	//Function to handle the changing of any of the plotting values then updating the plot.
	var startRun = $('#runInput').val();
	var stopRun = $('#endRunInput').val();
	var configSelection = $("#configSelector").val();
	
	loadEventJson(startRun, stopRun);
	consoleLog(configSelection+" "+startRun+" "+stopRun);
	var plotData = preparePlotData(configSelection, startRun, stopRun);
	var plotOptions = {
						series: {
							points: { show: true }
						},
						data: 'rawData'
						};
	var plot = $.plot($(plotHolderID), [plotData], plotOptions);
	
	//Update the title
	//~~~~~~~~~TODO~~~~~~~~~~//
		
}

function preparePlotData(configName, startRunNum, stopRunNum) { //returns an array for flot
	i = startRunNum;
	plotData = new Array();
	while (i<=stopRunNum) { 
		try{
			plotData.push([parseInt(i),parseInt(eval("JSON.parse(localStorage.getItem(i)).config."+configName))]);
		}
		catch(err){
			consoleLog("WARNING: Run "+i+" has no config entry for "+configName);
		}
		i++;
	}
	return plotData;
}

function loadEventJson(startRunNum, stopRunNum) {
	consoleLog("Loading data from run "+startRunNum+" to "+stopRunNum);
	var i = startRunNum;
	while (i<=stopRunNum) {
		var runNum = i;
		if(localStorage.getItem(runNum) != null) {
			consoleLog("Skipping run "+runNum+" because it is already in local storage.");
			i++;
			continue;
		}
		//Get thousands etc
		//First pad to 4 then take the right digit
		var runNumPadded = runNum+"";
		while (runNumPadded.length < 4) {runNumPadded = "0" + runNumPadded};
		var runThousand = runNumPadded.charAt(0);
		var runHundred = runNumPadded.charAt(1);
		if(runHundred != 0) {runHundred = runHundred * 100} // IE add 00 to the end
		
		consoleLog("Starting new run "+runNum);
		//Form run object
		var run = new Object();
		run.num = runNum;
		run.config = loadConfig(runThousand, runHundred, runNum);

		//Store run object
		localStorage.setItem(runNum,JSON.stringify(run));
		consoleLog("Run stored");
		
		i++;	
	}
		
	function loadConfig(runThousand, runHundred, runNum) {
		//Load config data
		var allConfigs = {};
		consoleLog("	Getting run configs");
		try {
		$.ajax({ 
			type: 'GET', 
			url: 'output/ANITA4/runs'+runThousand+'/runs'+runHundred+'/run'+runNum+'/config/Acqd.json',
			success: function (data) { 
				var configs = $.parseJSON(data);
				//consoleLog(configs);
				$.each(configs.sectionList, function(topConfigKey,topConfigValue) {
					$.each(topConfigValue.itemList, function(configKey, configValue) {
						allConfigs[configValue.name] = configValue.value;
						//consoleLog(configValue.name+":"+configValue.value);
					});
				});
				consoleLog("	Config loaded");
			 },
			 async:   false,
			 error: function(){
						consoleLog("	Error loading config for run"+runNum);
					}
			});
		}
		catch(err) {
			consoleLog("	Error loading config for run"+runNum);
		}
		//consoleLog(allConfigs);
		
		return allConfigs;
	}
		
}
