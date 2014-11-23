
<div class="formDiv">
<?php
  //First up include the really static links
include("leftMain.php");
?>


<form class="runForm" id="runForm" action=" javascript:void(0);">  
<?php

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

//Load the telemType array config file
$telemType_array = parse_ini_file("config/$instrument/telemTypeList.ini", true);
echo 'Hk. Type:<br> <select id="telemTypeForm">';
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
?>
<fieldset>
<div id="telemRunDiv">
<label>Telem Run:</label>
<input type="number" name="telemRun" id="telemRun" value="" min="0" max="100000" step="1" >
</div>
</fieldset>
<fieldset>
<div id="telemFileDiv">
<label>Telem File:</label>
<input type="number" name="telemRun" id="telemRun" value="" min="0" max="100000" step="1" >
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




 
