<div class="formDiv">
<?php
include("leftMain.php");
?>



<form class="runForm" id="runForm" action="">  

<?php
 //Load the defaults
$defaults_array = parse_ini_file("config/defaultValues.ini", true);
$realDefaults = array();
foreach($defaults_array as $ignore => $properties){
  $realDefaults["instrument"]=$properties[instrument];
  $realDefaults["layoutType"]=$properties[layoutType];
  $realDefaults["waveformType"]=$properties[waveformType];
}



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
echo "<div id=\"instrumentDiv\">";
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



echo "<div id=\"alternateDiv\">";
echo "<li>";
echo '<label>Alternate:</label> <select id="alternateForm" >';
echo "</select>";
echo "</li>";
echo "</div>";


echo "<li>";
echo "<label>Run:</label>";
echo "<input type=\"number\" name=\"runInput\" id=\"runInput\" value=\"$run\" max=\"100000\" min=\"0\" onchange=\"javascript:plotEvent();\" >";
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
?>	
<fieldset>
<div id="eventNumberDiv">
<label>Event:</label>
<select id="eventNumberForm"></select>
</div>
<div class="ui-widget">
  <label for="eventNumberAuto">Event: </label>
  <input id="eventNumberAuto">
</div>
</fieldset>
<button type="button" value="Previous" onclick="javascript:getPreviousEvent(plotEvent);">Previous</button>
<button type="button" value="Next" onclick="javascript:getNextEvent(plotEvent);">Next</button>
</li>
<li>
<input id='playButton' type='button' value='Play' onclick='javascript:playEvents();'>
</li>
<li>
<label>Speed:</label><input id='speedSlide' type='range' value='10' min='1' max='1000'>
</li>
</ul>
</fieldset>
</form>
</div>







