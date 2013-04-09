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
    "ddaCurrent" => "DDA Current",
    "ddaVoltage" => "DDA Voltage",
    "ddaTemp" => "DDA Temperature",
    "tdaCurrent" => "TDA Current",
    "tdaVoltage" => "TDA Voltage",
    "tdaTemp" => "TDA Temperature",
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