<?php
//
// php file which returns a simple json string of pngs of the events images  
// from a given run number. Or returns all pngs if no run number given.
//



class mFile
{
    public $name;
    public $event;
}

// Define the base run directory as a constant
define(RUNDIR, "output/ANITA3/event/all/");

// Get run number from ajax request if supplied
if(@isset($_REQUEST['run'])){
	$runNum = $_REQUEST['run'];
	$runEvtDir = glob(RUNDIR."run$runNum/*");
	foreach($runEvtDir as $evtDir){
		// Keep the original copy to see if the last object has been reached below
		$evtDirOriginal = $evtDir;
		// Remove dir tree
		$evtDir = str_replace(RUNDIR."run$runNum/","",$evtDir);
		// First dimention of json
		$runPngDir = glob(RUNDIR."run$runNum/$evtDir/*.png");
		foreach($runPngDir as $png){
			// Second dimention of json, leaving in the dir tree			this time
			 $curFileObj = new mFile;  
			 $curFileObj->name = $png;
			 $curFileObj->event=end(explode("_",basename($png,".png")));
    			 $fileArray[] = $curFileObj;
		}
		// close second dimention
	}
}

printf("%s", json_encode($fileArray));
?>
