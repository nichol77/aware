
<div class="formDiv">
<?php
  //First up include the really static links
include("leftMain.php");
?>


<form class="runForm" id="runForm" action=" javascript:void(0);">  
<?php
 //Load the defaults
$defaults_array = parse_ini_file("config/defaultValues.ini", true);
$realDefaults = array();
foreach($defaults_array as $ignore => $properties){
  $realDefaults["instrument"]=$properties[instrument];
  $realDefaults["hkType"]=$properties[hkType];
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

echo "<fieldset>";     
echo "<legend>Update Plot</legend>";
///Load the instrument array config file
$inst_array = parse_ini_file("config/instrumentList.ini", true);
echo '<label>Station:</label> <select id="instrumentForm" >';
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
echo "<br>";

//Load the hkType array config file
$hkType_array = parse_ini_file("config/hkTypeList.ini", true);
echo 'Hk. Type:<br> <select id="hkTypeForm">';
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

echo "<br>";

echo "Plot:<br> <select id=\"plotForm\"></select>";
echo "<br>";

echo "</fieldset>";
echo "</form>";
echo "</div>";



 
