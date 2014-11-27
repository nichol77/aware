<?php
	//
	// php file which returns a simple json string of the modified time of the 
	// housekeeping and event files from the hkTypeList.ini
	//

	//Get a list of types
	$hkType_array = parse_ini_file("config/ANITA3/hkTypeList.ini", true);
	// Atempts lastevent check also, suppress a warning if failed
	@$lastEvent = filemtime('output/ANITA3/lastEvent');
	
	//Start json string
	echo "{\"Event\":\"$lastEvent\"";
	
	//For each item in the hklist add a new item to the json string
	foreach($hkType_array as $inst => $properties){
		$key = ucfirst($properties['name']);
		$lastHk="output/ANITA3/last$key";
		if (file_exists($lastHk)) {
			$time =  filemtime($lastHk);
			echo ",\"$key\":\"$time\"";
		}
	}
	//Finish the json string.
	echo "}";
?>