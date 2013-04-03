
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

$stationarray=array(
		    "STATION1B" => "ARA01",
		    "STATION2" => "ARA02",
		    "STATION3" => "ARA03",
		    );

echo 'Station: <select id="stationForm" onchange="javascript:drawPlot();">';
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


echo "Run: <input type=\"text\" name=\"runInput\" id=\"runInput\" value=\"$run\"  />";
echo '<br />';
echo '<button type="button" value="Next" onclick="javascript:getPreviousRun(drawPlot);">Previous</button>';
echo '<button type="button" value="Next" onclick="javascript:getNextRun(drawPlot);">Next</button>';
echo "<br />";
echo "</form>";

#Also include the plot list
$contentPage=basename($_SERVER['PHP_SELF'], ".php");
include("${contentPage}_plotForm.php");

?>
<br />
</p> 
</div>

