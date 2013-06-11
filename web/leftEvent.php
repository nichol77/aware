
<?php
include("leftMain.php");
?>
<h2 class="navigation">Update Plot</h2>
<p class="navigation">
<form name="runForm"   id="runForm" action="javascript:drawPlot(); javascript:void(0);">       
<?php

$station=$_GET["station"];
if($_GET["station"] === null) {
  $station=STATION2;
 }


$run=$_GET["run"];
if($_GET["run"] === null) {
  $run=1868;
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
echo '<button type="button" value="Previous" onclick="javascript:getPreviousRun(drawPlot);">-</button>';
echo "<input type=\"text\" name=\"runInput\" id=\"runInput\" value=\"$run\" onchange=\"javascript:drawPlot();\"  />";
echo '<button type="button" value="Next" onclick="javascript:getNextRun(drawPlot);">+</button>';


echo "<br />";



$event=$_GET["event"];
if($_GET["event"] === null) {
  $event=0;
 }
echo "<form name=\"eventForm\"   id=\"eventForm\" action=\"javascript:drawPlot(); javascript:void(0);\">";		

echo "Event: <input type=\"text\" name=\"eventInput\" id=\"eventInput\" value=\"$event\"  />";
echo '<br />';
echo '<button type="button" value="Previous" onclick="javascript:getPreviousEvent(drawPlot);">Previous</button>';
echo '<button type="button" value="Next" onclick="javascript:getNextEvent(drawPlot);">Next</button>';
echo '<br />';
echo "<input id='playButton' type='button' value='Play' onclick='javascript:playEvents();'>";
echo "<br />";
echo "Speed:<input id='speedSlide' type='range' value='10' min='1' max='100'>";
echo "<br />";
echo "</form>";

?>
<br />
</p> 
</div>

