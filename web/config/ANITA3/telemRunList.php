<?php
require("jsonwrapper.php");
$defaults_array = parse_ini_file("config/defaultValues.ini", true);
$realDefaults = array();
foreach($defaults_array as $ignore => $properties){
  $realDefaults["instrument"]=$properties[instrument];
  $realDefaults["telemType"]=$properties[telemType];
}

$instrument=$_GET["instrument"];
if($_GET["instrument"] === null) {
  $instrument=$realDefaults[instrument];
 }

$telemType=$_GET["telemType"];
if($_GET["telemType"] === null) {
  $telemType=$realDefaults[telemType];
 }


class mFile
{
    public $name;
}


$telemDir=ucfirst($telemType);

foreach (glob("output/ANITA3/ghd/$telemDir/*") as $curFilename)
{
    $curFileObj = new mFile;
    $curFileObj->name = $curFilename;
    $fileArray[] = $curFileObj;
}
printf("%s", json_encode($fileArray));
?> 
