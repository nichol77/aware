<?php
	$hkType_array = parse_ini_file("config/ANITA3/hkTypeList.ini", true);
	@$lastEvent = filemtime('output/ANITA3/lastEvent');
	echo "{\"Event\":\"$lastEvent\"";
	
	foreach($hkType_array as $inst => $properties){
		$key = ucfirst($properties['name']);
		$lastHk="output/ANITA3/last$key";
		if (file_exists($lastHk)) {
			$time =  filemtime($lastHk);
			echo ",\"$key\":\"$time\"";
		}
	}
	echo "}";
?>