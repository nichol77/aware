<?php
require("jsonwrapper.php");
$defaults_array = parse_ini_file("config/defaultValues.ini", true);
$realDefaults = array();
foreach($defaults_array as $ignore => $properties){
  $realDefaults["instrument"]=$properties[instrument];
}

$instrument=$_GET["instrument"];
if($_GET["instrument"] === null) {
  $instrument=$realDefaults[instrument];
 }

class mFile
{
    public $name;
    public $run;
}



foreach (glob("output/ANITA4/runs*/runs*/run*/config") as $curFilename)
{
    $curFileObj = new mFile;
    $curFileObj->name = $curFilename;
    $curFileObj->run = substr(basename(dirname($curFilename)),3);	
  //  $fileArray[] = $curFileObj;
  $fileArray[] = intval($curFileObj->run);
}

sort($fileArray);
printf("%s", json_encode($fileArray));
?> 
