
<?php
include("leftMain.php");
?>




<form name="runForm" id="runForm" action="">  

<?php
 //Load the defaults
$defaults_array = parse_ini_file("config/defaultValues.ini", true);
$realDefaults = array();
foreach($defaults_array as $ignore => $properties){
  $realDefaults["instrument"]=$properties[instrument];
  $realDefaults["layoutType"]=$properties[layoutType];
}

$layoutType=$realDefaults[layoutType];

$instrument=$_GET["instrument"];
if($_GET["instrument"] === null) {
  $instrument=$realDefaults[instrument];
 }

$run=$_GET["run"];
if($_GET["run"] === null) {
  $run=1667; //This number is never really used
 }

echo "<fieldset>";     
echo "<legend>Update Plot</legend>";
echo "<ul>";
echo "<li>";
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
echo "</li>";

echo "<li>";
///Load the instrument array config file
$layout_array = parse_ini_file("config/layoutList.ini", true);
echo '<label>Layout:</label> <select id="layoutForm" >';
foreach($layout_array as $layout => $properties){
  $key=$properties[name];
  $value=$properties[title];
  $pos = strpos($layoutType,$key);
  if($pos !== false) {
  echo "<option value=$key selected=\"selected\" label=\"$value\">$value</option>";
  }
  else {
    echo "<option value=$key label=\"$value\">$value</option>";    
  }         
}
echo "</select>";
echo "<a href=\"#openLayoutHelp\">?</a>";
echo "</li>";
echo "<li>";
echo "<label>Run:</label>";
echo "<input type=\"number\" name=\"runInput\" id=\"runInput\" value=\"$run\" max=\"100000\" min=\"0\" onchange=\"javascript:drawPlot();\" >";
echo "</li>";

echo "<li>";
$eventIndex=$_GET["eventIndex"];
if($_GET["eventIndex"] === null) {
  $eventIndex=0;
 }
$eventNumber=$_GET["eventNumber"];
if($_GET["eventNumber"] === null) {
  $eventNumber=0;
 }		
echo "<label>Index:</label> <input type=\"number\" name=\"eventIndexInput\" id=\"eventIndexInput\" value=\"$eventIndex\" step =\"1\" >";
echo "<label>Number:</label> <input type=\"number\" name=\"eventNumberInput\" id=\"eventNumberInput\" value=\"$eventNumber\" step =\"1\" >";
echo '<button type="button" value="Previous" onclick="javascript:getPreviousEvent(drawPlot);">Previous</button>';
echo '<button type="button" value="Next" onclick="javascript:getNextEvent(drawPlot);">Next</button>';
echo "</li>";



echo "<li>";
echo "<input id='playButton' type='button' value='Play' onclick='javascript:playEvents();'>";
echo "</li>";
echo "<li>";
echo "<label>Speed:</label><input id='speedSlide' type='range' value='10' min='1' max='1000'>";
echo "</li>";
?>
</ul>
</fieldset>
<fieldset>
<legend>Time Axis Options</legend>
<ul>
<li>
<label for = "includeCables">Cable Delays</label>
<input type = "checkbox"
  id = "includeCables"
  value = "includeCables"
  checked>
</li>
<li>
<label for = "xAutoScale">Auto Scale</label>
<input type = "checkbox"
  id = "xAutoScale"
  value = "xAutoScale"
  checked >
</li>
<li>
<label>x-min:</label>
<input type="number" name="xMin" id="xMinInput" value="" disabled>
</li>
<li>
<label>x-max:</label>
<input type="number" name="xMax" id="xMaxInput" value="" disabled> 
</li>
<li>
<button type="button" id="refreshButton">Refresh</button>
</li>
</ul>
</fieldset>
</form>







