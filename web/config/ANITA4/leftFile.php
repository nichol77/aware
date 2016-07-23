
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
}

$instrument=$_GET["instrument"];
if($_GET["instrument"] === null) {
  $instrument=$realDefaults[instrument];
 }

$run=$_GET["run"];
if($_GET["run"] === null) {
  $run=151; //This number is never really used
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
?>
</select>
<br>
<div class="ui-widget">
<label>Run:</label>
<input type="number" name="runInput" id="runInput" value="$run" max="100000" min="0"  >
</div>

</fieldset>

<fieldset>
<div id="fileDiv">
<label>File:</label>
<select id="fileForm"></select>
</div>
</fieldset>

</form>
</div>



 
