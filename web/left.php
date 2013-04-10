
<?php
include("leftMain.php");
?>
<h2 class="navigation">Update Plot</h2>
<p class="navigation">
<form name="runForm"   id="runForm" action="javascript:drawPlot(); javascript:void(0);">       
<?php

$station=$_GET["station"];
if($_GET["station"] === null) {
  $station=STATION1B;
 }


$run=$_GET["run"];
if($_GET["run"] === null) {
  $run=2000;
 }


$endrun=$_GET["endrun"];
if($_GET["endrun"] === null) {
  $endrun=2000;
 }

$stationarray=array(
		    "STATION1B" => "ARA01",
		    "STATION2" => "ARA02",
		    "STATION3" => "ARA03",
		    );

echo 'Station: <select id="instrumentForm" onchange="javascript:drawPlot();">';
foreach ($stationarray as $key => $value) {
  $pos = strpos($station,$key);
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


echo "Run: ";
echo '<br />';
echo '<button type="button" value="Previous" onclick="javascript:getPreviousStartRun(drawPlot);">-</button>';
echo "<input type=\"text\" name=\"runInput\" id=\"runInput\" value=\"$run\"  />";
echo '<button type="button" value="Next" onclick="javascript:getNextStartRun(drawPlot);">+</button>';

echo "End Run:";
echo '<button type="button" value="Previous" onclick="javascript:getPreviousEndRun(drawPlot);">-</button>';
echo "<input type=\"text\" name=\"endRunInput\" id=\"endRunInput\" value=\"$endrun\"  />";
echo '<button type="button" value="Next" onclick="javascript:getNextEndRun(drawPlot);">+</button>';
echo "<br />";
echo "</form>";

#Also include the plot list
$contentPage=basename($_SERVER['PHP_SELF'], ".php");
include("${contentPage}_plotForm.php");

?>
<br />
</p> 
</div>

