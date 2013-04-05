<?php

echo '<h2 class="navigation">Event Housekeeping</h2>';
echo "<form>";
$plot=$_GET["plot"];
if($_GET["plot"] === null) {
  $plot=atriCurrent;
 }

$plotarray = array(
    "atriCurrent" => "ATRI Current",
    "atriVoltage" => "ATRI Voltage",
    "stack_0.ddaCurrent" => "DDA A Current",
    "stack_0.ddaVoltage" => "DDA A Voltage",
    "stack_0.ddaTemp" => "DDA A Temperature",
    "stack_1.ddaCurrent" => "DDA B Current",
    "stack_1.ddaVoltage" => "DDA B Voltage",
    "stack_1.ddaTemp" => "DDA B Temperature",
    "stack_2.ddaCurrent" => "DDA C Current",
    "stack_2.ddaVoltage" => "DDA C Voltage",
    "stack_2.ddaTemp" => "DDA C Temperature",
    "stack_3.ddaCurrent" => "DDA D Current",
    "stack_3.ddaVoltage" => "DDA D Voltage",
    "stack_3.ddaTemp" => "DDA D Temperature",
    "stack_0.tdaCurrent" => "TDA A Current",
    "stack_0.tdaVoltage" => "TDA A Voltage",
    "stack_0.tdaTemp" => "TDA A Temperature",
    "stack_1.tdaCurrent" => "TDA B Current",
    "stack_1.tdaVoltage" => "TDA B Voltage",
    "stack_1.tdaTemp" => "TDA B Temperature",
    "stack_2.tdaCurrent" => "TDA C Current",
    "stack_2.tdaVoltage" => "TDA C Voltage",
    "stack_2.tdaTemp" => "TDA C Temperature",
    "stack_3.tdaCurrent" => "TDA D Current",
    "stack_3.tdaVoltage" => "TDA D Voltage",
    "stack_3.tdaTemp" => "TDA D Temperature",
);

echo 'Plot: <select id="plotForm" onchange="javascript:drawPlot();">';
foreach ($plotarray as $key => $value) {
  $pos = strpos($plot,$key);

  if($pos !== false) {
#  echo "<p>$plot and $key and $pos</p>";
  echo "<option value=$key selected=\"selected\" label=\"$value\">$value</option>";
  }
  else {
    echo "<option value=$key label=\"$value\">$value</option>";    
  }    
}
echo "</select>";
echo "</form>";

echo "<form>";

$timeType=$_GET["timeType"];
if($_GET["timeType"] === null) {
  $timeType=full;
 }


$timeTypearray = array(
		       "simple" => "Simple",
		       "full" => "Full"
		       );


echo 'Type: <select id="timeForm" onchange="javascript:updateTimeTypeFromForm(); javascript:drawPlot();">';
foreach ($timeTypearray as $key => $value) {
  $pos = strpos($timeType,$key);  
  if($pos !== false) {
#  echo "<p>$plot and $key and $pos</p>";
    echo "<option value=$key selected=\"selected\" label=\"$value\">$value</option>";
  }
  else {
    echo "<option value=$key label=\"$value\">$value</option>";    
  }    
}
echo "</select>";
echo "</form>";



?>