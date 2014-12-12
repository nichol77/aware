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
}



foreach (glob("output/ANITA3/aux/run*") as $curFilename)
{
    $curFileObj = new mFile;
    $curFileObj->name = $curFilename;
    $fileArray[] = $curFileObj;
}
printf("%s", json_encode($fileArray));
?> 
