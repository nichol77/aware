<?php
  //First up include the really static links
include("leftMain.php");
?>
<h2 class="navigation">Update Plot</h2>
<p class="navigation">
<form name="runForm"   id="runForm" action="javascript:drawPlot(); javascript:void(0);">       
<?php
 //Load the defaults
$defaults_array = parse_ini_file("config/defaultValues.ini", true);
$realDefaults = array();
foreach($defaults_array as $ignore => $properties){
  $realDefaults["instrument"]=$properties[instrument];
  $realDefaults["hkType"]=$properties[hkType];
  $realDefaults["timeType"]=$properties[timeType];
}


$instrument=$_GET["instrument"];
if($_GET["instrument"] === null) {
  $instrument=$realDefaults[instrument];
 }


$run=$_GET["run"];
if($_GET["run"] === null) {
  $run=1667; //This number is never really used
 }



$hkType=$_GET["hkType"];
if($_GET["hkType"] === null) {
  $hkType=$realDefaults[hkType];
 }


$timeType=$_GET["timeType"];
if($_GET["timeType"] === null) {
  $timeType=$realDefaults[timeType];
 }


///Load the instrument array config file
$inst_array = parse_ini_file("config/instrumentList.ini", true);
echo 'Station: <select id="instrumentForm" >';
foreach($inst_array as $inst => $properties){
  $key=$properties[name];
  $value=$properties[title];
  $pos = strpos($instrument,$key);
  if($pos !== false) {
  echo "<option value=$key selected=\"selected\" label=\"$value\">$value</option>";
  }
  else {
    echo "<option value=$key label=\"$value\">$value</option>";    
  }         
}
echo "</select>";
echo "<a href=\"#openStationHelp\">?</a>";
echo "<br />";

//Load the hkType array config file
$hkType_array = parse_ini_file("config/hkTypeList.ini", true);
echo 'Hk. Type: <select id="hkTypeForm">';
foreach($hkType_array as $inst => $properties){
  $key=$properties[name];
  $value=$properties[title];
  $pos = strpos($hkType,$key);
  if($pos !== false) {
  echo "<option value=$key selected=\"selected\" label=\"$value\">$value</option>";
  }
  else {
    echo "<option value=$key label=\"$value\">$value</option>";    
  }    
}
echo "</select>";
echo "<a href=\"#openHkTypeHelp\">?</a>";

echo "<br />";

echo "Plot: <select id=\"plotForm\"></select>";
echo "<br />";


//Load the timeType array config file
$timeType_array = parse_ini_file("config/timeTypeList.ini", true);
echo 'Type: <select id="timeForm"">';
foreach($timeType_array as $inst => $properties){
  $key=$properties[name];
  $value=$properties[title];
  $pos = strpos($timeType,$key);  
  if($pos !== false) {
    echo "<option value=$key selected=\"selected\" label=\"$value\">$value</option>";
  }
  else {
    echo "<option value=$key label=\"$value\">$value</option>";    
  }    
}
echo "</select>";
echo "<a href=\"#openTimeTypeHelp\">?</a>";
echo "<br />";
echo '<div id="fullMaxDiv"></div>';


echo "Run: ";
echo '<br />';
echo '<button type="button" value="Previous" id="prevRunButton" onclick="javascript:getPreviousStartRun(drawPlot);">-</button>';
echo "<input type=\"text\" name=\"runInput\" id=\"runInput\" value=\"$run\" onchange=\"javascript:drawPlot();\"  />";
echo '<button type="button" value="Next" id="nextRunButton" onclick="javascript:getNextStartRun(drawPlot);">+</button>';
?>
<div id="endRunDiv"></div>
<div id="timeRangeDiv"></div>


</div>
<br />
</p> 
</div>

 
<div id="openTimeTypeHelp" class="helpDialog">
  <div>
<a href="#close" title="Close" class="close">X</a>
<?php
include "help/timeTypeHelp.php";
?>
</div>
</div>


<div id="openStationHelp" class="helpDialog">
  <div>
<a href="#close" title="Close" class="close">X</a>
<?php
include "help/stationHelp.php";
?>
</div>
</div>



<div id="openHkTypeHelp" class="helpDialog">
  <div>
<a href="#close" title="Close" class="close">X</a>
<?php
include "help/hkTypeHelp.php";
?>
</div>
</div>