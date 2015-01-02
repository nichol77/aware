<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Status</title>
<script language="javascript" type="text/javascript" src="src/flot/jquery.min.js.gz"></script>
</head>

<body>
<script language="javascript" type="text/javascript">
	// Get lastest run from lastRun file
	console.log("Getting latest run number...");
	var runNum;
	$.ajax({ 
        type: 'GET', 
        url: 'output/ANITA3/lastRun', 
		success: function (data) { 
			runNum = data;
			console.log(runNum);
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
	
	var allConfigs = {};
	//Load config data
	console.log("Getting run configs for run: "+runNum);
	$.ajax({ 
		type: 'GET', 
		url: 'output/ANITA3/runs'+runThousand+'/runs'+runHundred+'/run'+runNum+'/config/Acqd.json',
		success: function (data) { 
			var configs = $.parseJSON(data);
			console.log(configs);
			$.each(configs.sectionList, function(topConfigKey,topConfigValue) {
				$.each(topConfigValue.itemList, function(configKey, configValue) {
					allConfigs[configValue.name] = configValue.value;
					console.log(configValue.name+":"+configValue.value);
				});
			});
		 },
		 async:   false
		});
	console.log(allConfigs);
	
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
	
	function viewAllConfig() {
		$('#output').html("");
		$( document ).ready(function() {
			$.each(allConfigs, function(name, value) {
				$('#output').append(name+":"+value+"<br>");
			});
		});
	}
	
	
</script>
<h2>Configuration values from the most recent run</h2>
<div id="output"> </div>
<br> 
<button onClick="viewAllConfig();"  value="View all">View all</button>
</body>
</html>