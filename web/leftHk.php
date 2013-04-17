<?php
include("leftMain.php");
?>
<h2 class="navigation">Update Plot</h2>
<p class="navigation">
<form name="runForm"   id="runForm" action="javascript:drawPlot(); javascript:void(0);">       
<?php

$instrument=$_GET["instrument"];
if($_GET["instrument"] === null) {
  $instrument=STATION2;
 }


$run=$_GET["run"];
if($_GET["run"] === null) {
  $run=1667;
 }


$endrun=$_GET["endrun"];
if($_GET["endrun"] === null) {
  $endrun=1667;
 }

$hkType=$_GET["hkType"];
if($_GET["hkType"] === null) {
  $hkType=sensorHk;
 }


$timeType=$_GET["timeType"];
if($_GET["timeType"] === null) {
  $timeType=simple;
 }


$stationarray=array(
		    "STATION1B" => "ARA01",
		    "STATION2" => "ARA02",
		    "STATION3" => "ARA03",
		    );

echo 'Station: <select id="instrumentForm" >';
foreach ($stationarray as $key => $value) {
  $pos = strpos($instrument,$key);
  if($pos !== false) {
#  echo "<p>$plot and $key and $pos</p>";
  echo "<option value=$key selected=\"selected\" label=\"$value\">$value</option>";
  }
  else {
    echo "<option value=$key label=\"$value\">$value</option>";    
  }    
}
echo "</select>";


echo "<br />";


$hkTypeArray=array(
		    "eventHk" => "Event Hk.",
		    "sensorHk" => "Sensor Hk.",
		    "header" => "Header",
		    );

echo 'Hk. Type: <select id="hkTypeForm">';
foreach ($hkTypeArray as $key => $value) {
  $pos = strpos($hkType,$key);
  if($pos !== false) {
#  echo "<p>$plot and $key and $pos</p>";
  echo "<option value=$key selected=\"selected\" label=\"$value\">$value</option>";
  }
  else {
    echo "<option value=$key label=\"$value\">$value</option>";    
  }    
}
echo "</select>";


echo "<br />";

echo "Plot: <select id=\"plotForm\"></select>";
echo "<br />";


$timeTypearray = array(
		       "simple" => "Simple",
		       "full" => "Full",
		       "multiRun" => "Multiple Runs",
		       );


echo 'Type: <select id="timeForm"">';
foreach ($timeTypearray as $key => $value) {
  $pos = strpos($timeType,$key);  
  if($pos !== false) {
    echo "<option value=$key selected=\"selected\" label=\"$value\">$value</option>";
  }
  else {
    echo "<option value=$key label=\"$value\">$value</option>";    
  }    
}
echo "</select>";
echo "<br />";



echo "Run: ";
echo '<br />';
echo '<button type="button" value="Previous" onclick="javascript:getPreviousStartRun(drawPlot);">-</button>';
echo "<input type=\"text\" name=\"runInput\" id=\"runInput\" value=\"$run\" onchange=\"javascript:drawPlot();\"  />";
echo '<button type="button" value="Next" onclick="javascript:getNextStartRun(drawPlot);">+</button>';
?>
<div id="endRunDiv"></div>

<span id="lastRun">
<?php
$lastSensorHk="output/";
$lastSensorHk.=$instrument;
$lastSensorHk.="/lastSensorHk";
include $lastSensorHk ;
?>
</span>
</div>
<br />
</p> 
</div>

