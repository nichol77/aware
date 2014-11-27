
<div class="formDiv">
<?php
  //First up include the really static links
include("leftMain.php");
?>


<form class="runForm" id="runForm" action=" javascript:void(0);">  
<?php
$defaults_array = parse_ini_file("config/defaultValues.ini", true);
$realDefaults = array();
foreach($defaults_array as $ignore => $properties){
  $realDefaults["telemType"]=$properties[telemType];
 }
                                                  
$telemType=$_GET["telemType"];
if($_GET["telemType"] === null) {
  $telemType=$realDefaults[telemType];
 }                             

echo "<fieldset>";     
echo "<legend>Update Plot</legend>";
///Load the instrument array config file
$inst_array = parse_ini_file("config/instrumentList.ini", true);
echo '<label>Instrument:</label> <select id="instrumentForm" >';
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
echo "</fieldset>";
echo "<fieldset>";
//Load the telemType array config file
echo "<label>Telem Type:</label>";
$telemType_array = parse_ini_file("config/ANITA3/telemTypeList.ini", true);
echo '<select id="telemTypeForm">';
foreach($telemType_array as $inst => $properties){
  $key=$properties[name];
  $value=$properties[title];
  $pos = strpos($telemType,$key);
  if($pos !== false) {
  echo "<option value=$key selected=\"selected\" label=\"$value\">$value</option>";
  }
  else {
    echo "<option value=$key label=\"$value\">$value</option>";    
  }    
}
echo "</select>";
echo "</fieldset>";
echo "<fieldset>";
echo "<label>Plot:</label><select id=\"plotForm\"></select>";
echo "</fieldset>";
echo "<fieldset>";
//Load the timeType array config file
$timeType_array = parse_ini_file("config/ANITA3/telemTimeTypeList.ini", true);
echo 'Type:<br> <select id="timeForm">';
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
echo "</fieldset>";
?>

<fieldset>
<div id="telemRunDiv">
<label>Telem Run:</label>
<select id="telemRunForm"></select>
</div>
</fieldset>

<fieldset>
<div id="telemFileDiv">
<label>Telem File:</label>
<select id="telemFileForm"></select>
</div>
</fieldset>

<fieldset>
<div id="telemEndFileDiv">
<label>Telem End File:</label>
<select id="telemEndFileForm"></select>
</div>
</fieldset>

<div id="fullMaxDiv">
<fieldset>
<legend>Plot Points</legend>
<label>Time:</label><input type="number"id="maxTimePointsForm" value="100" step="1" >
<label>Histo:</label><input type="number"id="maxProjPointsForm" value="100" step="1" >
</fieldset>
<fieldset>
<button type="button" id="showScaleButton">Show Scale Options</button>
</fieldset>
</div>
</form>
</div>


<div id="yScaleDiv" class="formDiv" >
<form id="yScaleForm" class="scaleForm">
<fieldset>
<legend>y-axis</legend>
<ul>
<li>
<label for = "yAutoScale">Auto Scale</label>
<input type = "checkbox"
  id = "yAutoScale"
  value = "yAutoScale"
  checked>
</li>
<li>
<label>y-min:</label>
<input type="number" name="yMin" id="yMinInput" value="0" step="any" disabled> 
</li>
<li>
<label>y-max:</label>
<input type="number" name="yMax" id="yMaxInput" value="0" step="any" disabled>
</li>
</ul>
</fieldset>
</form>
</div>
<div class="formDiv" id="xScaleDiv">
<form id="xScaleForm" class="scaleForm">
<fieldset>
<legend>x-axis</legend>
<ul>
<li>
<label for = "xAutoScale">Auto Scale</label>
<input type = "checkbox"
  id = "xAutoScale"
  value = "xAutoScale"
  checked >
</li>
<li>
<label>x-min:</label>
<input type="date" name="xMinDate" id="xMinDateInput" value="" disabled>
<input type="time" name="xMinTime" id="xMinTimeInput" step="1" value="" disabled> 
</li>
<li>
<label>x-max:</label>
<input type="date" name="xMaxDate" id="xMaxDateInput" value="" disabled> 
<input type="time" name="xMaxTime" id="xMaxTimeInput" step="1" value="" disabled> 
</li>
</ul>
</fieldset>
<fieldset>
<button type="button" id="refreshButton">Refresh</button>
</fieldset>
</form>
</div>




 
