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
  $run=$realDefaults[run];
 }


class mFile
{
    public $name;
}

$runThousand = $run - ($run % 10000);
$runHundred = $run - ($run % 100);


foreach (glob("output/ANITA3/runs$runThousand/runs$runHundred/run$run/config/*") as $curFilename)
{
    $curFileObj = new mFile;
    $curFileObj->name = $curFilename;
    $fileArray[] = $curFileObj;
}
printf("%s", json_encode($fileArray));
?> 
