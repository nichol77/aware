<?php
ob_start("ob_gzhandler"); 
header("Connection: keep-alive");
?>
<!DOCTYPE html>
<html>
<head>
<link rel="StyleSheet" href="styles/jquery-ui-1.10.3.custom.min.css" type="text/css" media="screen" >
<link rel="StyleSheet" href="styles/aware.css" type="text/css" media="screen">
<link rel="StyleSheet" href="styles/base.css" type="text/css" media="screen">
<link rel="StyleSheet" href="styles/help.css" type="text/css" media="screen" >
<link rel="StyleSheet" href="styles/local.css" type="text/css" media="screen" />


<title>Status</title>
<script type="text/javascript" src="src/awareUtils.js"></script>
<script type="text/javascript" src="src/awareHk.js"></script>
<script type="text/javascript" src="src/awareHkTime.js"></script>
<script src="src/jqueryui/js/jquery.min.js"></script>
<script src="src/jqueryui/js/jquery-ui.min.js"></script>
<script type="text/javascript" src="src/flot/jquery.flot.min.js.gz"></script>
<script type="text/javascript" src="src/flot/jquery.flot.errorbars.min.js.gz"></script>
<script type="text/javascript" src="src/flot/jquery.flot.time.min.js.gz"></script>
<script type="text/javascript" src="src/flot/jquery.flot.canvas.min.js.gz"></script>
<script type="text/javascript" src="src/flot/jquery.flot.selection.min.js.gz"></script>
<script type="text/javascript" src="src/flot/jquery.flot.resize.min.js.gz"></script>
<script type="text/javascript" src="src/awareAnalysisPlotter.js"></script>
<script type="text/javascript">

  $(function() {
      //initialiseAwareConfigTime();
	  //initialisePlotHolder();
  });  

</script>
</head>
<body>
<script language="javascript" type="text/javascript">
	var allConfigs = {};
	
	function viewMostRecentRun() {
	// Get lastest run from lastRun file
	//console.log("Getting latest run number...");
	var runNum;
	$.ajax({ 
        type: 'GET', 
        url: 'output/ANITA3/lastRun', 
		success: function (data) { 
			runNum = data;
			//console.log(runNum);
		},
		async:   false
		});
		
	//Get thousands etc
	//First pad to 4 then take the right digit
	var runNumPadded = runNum+"";
    while (runNumPadded.length < 5) {runNumPadded = "0" + runNumPadded};
	var runThousand = runNumPadded.charAt(0);
	var runHundred = runNumPadded.charAt(1);
	if(runHundred != 0) {runHundred = runHundred * 100} // IE add 00 to the end
	
	//Load config data
	//console.log("Getting run configs for run: "+runNum);
	$.ajax({ 
		type: 'GET', 
		url: 'output/ANITA3/runs'+runThousand+'/runs'+runHundred+'/run'+runNum+'/config/Acqd.json',
		success: function (data) { 
			var configs = $.parseJSON(data);
			//console.log(configs);
			$.each(configs.sectionList, function(topConfigKey,topConfigValue) {
				$.each(topConfigValue.itemList, function(configKey, configValue) {
					allConfigs[configValue.name] = configValue.value;
					//console.log(configValue.name+":"+configValue.value);
					
				});
			});
		 },
		 async:   false
		});
		updateConfigOptions(allConfigs);
	//console.log(allConfigs);
	
	// Add 1 to the number of times i have forgotten to wait for the page to be ready...
	// If the config entry is interesting print it
	$( document ).ready(function() {
		$.each(allConfigs, function(name, value) {
			if(name == "enablePPS1Trigger"
			|| name == "enablePPS2Trigger"
			|| name == "disableExtTrigger"
			
			|| name == "sendSoftTrigger"
			|| name == "softTrigPeriod"
			
			|| name == "enabledDynamicPhiMasking"
			|| name == "enabledDynamicAntMasking"
			
			|| name == "dynamicPhiThresholdOverRate"
			|| name == "dynamicPhiThresholdOverWindow"
			|| name == "dynamicPhiThresholdUnderRate"
			|| name == "dynamicPhiThresholdUnderWindow"
			
			|| name == "dynamicAntThresholdOverRate"
			|| name == "dynamicAntThresholdOverWindow"
			|| name == "dynamicAntThresholdUnderRate"
			|| name == "dynamicAntThresholdUnderWindow"
			
			|| name == "enableChanServo"
			|| name == "pidGoals"
			){
				$('#output').append(name+":"+value+"<br>");
			}
		});
	});
	}
	function viewAllConfig() {
		$('#output').html("");
		$( document ).ready(function() {
			$.each(allConfigs, function(name, value) {
				$('#output').append(name+":"+value+"<br>");
			});
		});
	}
	
	
</script>
<div class="heading">
    <div id="titleContainer">
    <h1>AWARE Status</h1>
    </div>
</div>
<div class=middle><div id="plot-holder-1" class="plot-holder"  >
<div id="plot-header-1" class="plot-header">
	<h3>Time Plot</h3>
</div>
<div id="plot-content-1" class="plot-content" style="width:100%; height:80%;">

<div>
<form>

<div>
<div>
<span id="color" style="float:left;">
  <input type="radio" name="color" id="default" /><label for="default">Default</label>
  <input type="radio" name="color" id="single" /><label for="single">Mono</label>
  <input type="radio" name="color" id="multi" checked="checked" /><label for="multi">Multi</label>
  </span>
  </div>
  </div>
  <div id="layoutRadio" style="float:right; padding-right:10px;">
    <input type="radio" value="both" id="layoutBoth" name="layoutRadio" checked="checked" /><label for="layoutBoth">Both</label>
    <input type="radio" value="time" id="layoutTime" name="layoutRadio"  /><label for="layoutTime">Time</label>
    <input type="radio" value="projection" id="layoutProjection" name="layoutRadio" /><label for="layoutProjection">Projection</label>
  </div>
</form>
</div>

<br>
<div id="divTime-1" style="width:70%; height:70%; padding: 0px; float : left; "></div>
<div id="divProjection-1" style="width:30%; height:70%; padding: 0px; float : left;"></div>
<div id="plot-preamble" class="plot-preamble" style="height:10%">
<span style="float:left;" id="plot-text-1" class="plot-text"></span>
</div>
<div id="divChoices-1" style="width:80%; height:10%; padding: 0px; float : left;">
  <p class="choiceList" id="choices-1" style=""></p></div>
</div>
</div>

<h4 style="margin-top:100px;">Configuration values from the most recent run</h4>
<div id="output"></div>
<br> 
<button onClick="viewAllConfig();"  value="View all">View all</button>
<br>
<h4>CONSOLE OUTPUT</h4>
<div id="debugContainer" style="height:500px; overflow:scroll;"></div>

</div>

<div class="leftBar" id="leftbar">
<?php
include("leftStatus.php"); //COPY THE LEFTSTATUS PHP PAGE TO THE MAIN FOLDER
?>
</div>



<div id="openTimeTypeHelp" class="helpDialog">
  <div>
<a href="#close" title="Close" class="close">X</a>
<?php
include "help/timeTypeHelp.php";
?>
</div>
</div>


<div id="openStationHelp" class="helpDialog">
  <div>
<a href="#close" title="Close" class="close">X</a>
<?php
include "help/stationHelp.php";
?>
</div>
</div>



<div id="openHkTypeHelp" class="helpDialog">
  <div>
<a href="#close" title="Close" class="close">X</a>
<?php
include "help/hkTypeHelp.php";
?>
</div>
</div>

</body>
</html>

