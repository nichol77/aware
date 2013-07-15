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
		       "timeRange" => "Time Range",
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
echo "<a href=\"#openTypeHelp\">?</a>";
echo "<br />";
echo '<div id="fullMaxDiv"></div>';


echo "Run: ";
echo '<br />';
echo '<button type="button" value="Previous" onclick="javascript:getPreviousStartRun(drawPlot);">-</button>';
echo "<input type=\"text\" name=\"runInput\" id=\"runInput\" value=\"$run\" onchange=\"javascript:drawPlot();\"  />";
echo '<button type="button" value="Next" onclick="javascript:getNextStartRun(drawPlot);">+</button>';
?>
<div id="endRunDiv"></div>
<div id="timeRangeDiv"></div>

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


<div id="openTypeHelp" class="helpDialog">
  <div>
<a href="#close" title="Close" class="close">X</a>
<h2>Type</h2>
<p>The AWARE database contains two types of file representing the housekeeping data.</p>
<ul>
<li>Simple -- Summary files with one data point every 5 minutes</li>
<li>Full -- Files with one data point for each recorded housekeeping event, that is every 10 seconds for the sensor and every second for the event housekeeping.</li>
</ul>
<p>In either case only Max Plot Points are shown, and the data is averaged into this number of even sized bins.</p>
</div>
</div>