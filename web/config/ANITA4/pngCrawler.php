<?php
//
// php file which returns a simple json string of pngs of the vents images  
// from a given run number. Or returns all pngs if no run number given.
//
// Define the base run directory as a constant
define(RUNDIR, "output/ANITA4/event/all/");
// Define the base run directory as a constant
define(GPUDIR, "output/ANITA4/gpu/");



if (@isset($_REQUEST['gpu']))
{
// jsonOutput is where the output string is built up
$jsonOutput = "[";
// Get run number from ajax request if supplied
if(@isset($_REQUEST['run'])){
	$runNum = $_REQUEST['run'];
	//$runNum = 10583;
	$runPngDir = glob(GPUDIR."run$runNum/*.png");
	foreach($runPngDir as $png){
		  $event=end(explode("_",basename($png,".png")));
			$jsonOutput .= "{\"name\":\"$png\",\"event\":\"$event\"}";
			// If not last png, add the comma
			if($png !== end($runPngDir)){
				$jsonOutput .= ",";	 
			}
		}
	}

	// close first dimention
	$jsonOutput .= "]";
  echo $jsonOutput;
}
else
{
// jsonOutput is where the output string is built up
$jsonOutput = "[";
// Get run number from ajax request if supplied
if(@isset($_REQUEST['run'])){
	$runNum = $_REQUEST['run'];
	//$runNum = 10583;
	$runEvtDir = glob(RUNDIR."run$runNum/*");
	foreach($runEvtDir as $evtDir){
		// Keep the original copy to see if the last object has been reached below
		$evtDirOriginal = $evtDir;
		// Remove dir tree
		$evtDir = str_replace(RUNDIR."run$runNum/","",$evtDir);
		// First dimention of json
		//		$jsonOutput .= "\"$evtDir\":[";
		$runPngDir = glob(RUNDIR."run$runNum/$evtDir/*.png");
		foreach($runPngDir as $png){
			// Second dimention of json, leaving in the dir tree this time
		  $event=end(explode("_",basename($png,".png")));
			$jsonOutput .= "{\"name\":\"$png\",\"event\":\"$event\"}";
			// If not last png, add the comma
			if($png !== end($runPngDir)){
				$jsonOutput .= ",";	 
			}
		}
		// close second dimention
		//		$jsonOutput .= "]";
		// If not last evt, add the comma
		if($evtDirOriginal !== end($runEvtDir)){
					$jsonOutput .= ",";	 
				 }
	}
	// close first dimention
	$jsonOutput .= "]";
}
else {
	// No run number supplied get ALL pngs from ALL runs
	
	$runDir = glob(RUNDIR."*");
	foreach($runDir as $run) {
		$runNum = str_replace(RUNDIR."run","",$run);
		$runEvtDir = glob(RUNDIR."run$runNum/*");
		$jsonOutput .= "\"run$runNum\":[{";
		foreach($runEvtDir as $evtDir){
			// Keep the original copy to see if the last object has been reached below
			$evtDirOriginal = $evtDir;
			// Remove dir tree
			$evtDir = str_replace(RUNDIR."run$runNum/","",$evtDir);
			// First dimention of json
			$jsonOutput .= "\"$evtDir\":[";
			$runPngDir = glob(RUNDIR."run$runNum/$evtDir/*.png");
			foreach($runPngDir as $png){
				// Second dimention of json, leaving in the dir tree this time
				$jsonOutput .= "{\"png\":\"$png\"}";
				// If not last png, add the comma
				if($png !== end($runPngDir)){
					$jsonOutput .= ",";	 
				}
			}
			// close second dimention
			$jsonOutput .= "]";
			// If not last evt, add the comma
			if($evtDirOriginal !== end($runEvtDir)){
				$jsonOutput .= ",";	 
			}
			else {
				$jsonOutput .= "}"; 
			}
		}
		// close first dimention
		$jsonOutput .= "]";
		// If not last run, add the comma
		if($run !== end($runDir)){
				$jsonOutput .= ",";	 
		}
	}
	// close first dimention
	$jsonOutput .= "}";
}
echo $jsonOutput;
}

?>
