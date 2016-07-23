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

$run=$_GET["run"];
if($_GET["run"] === null) {
  $run=1;
}


class mFile
{
    public $name;
public $time;	
}

foreach (glob("output/ANITA4/aux/run$run/archive/*") as $curFilename)
{
    $curFileObj = new mFile;
    $curFileObj->name = $curFilename;
    $curFileObj->time = date("d/m/Y - H:i", filectime($curFilename));
    $fileArray[] = $curFileObj;
}
printf("%s", json_encode($fileArray));
?> 
