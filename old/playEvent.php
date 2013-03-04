<!DOCTYPE html>
<html>
    <head>
        <script src="src/mygraph.js"></script>
        <script src="src/aware.js"></script>
<?php
require("utils.php");
   include("/uhen/ara/monitor/styles.shtml");
   echo "<link rel=\"StyleSheet\" href=\"/uhen/ara/monitor/styles/base.css\" type=\"text/css\" media=\"screen\" />
<link rel=\"StyleSheet\" href=\"/uhen/ara/monitor/styles/default.css\" type=\"text/css\" media=\"screen\" title=\"RJN default\" />";


echo "<TITLE>Event Page</TITLE>";


$wait=$_GET["wait"];
$run=$_GET["run"];
$index=$_GET["index"];
$eventList=getEventListArray($run);
$event=$eventList[$index];
$eventIndex=$index;
$eventCount=count($eventList);
$nextIndex=$index+1;


if($index<$eventCount-1) {  
  echo "<meta http-equiv='refresh' content='$wait;url=playEvent.php?run=$run&index=$nextIndex&wait=$wait'>";
 }

echo "</head>";


echo "<body onload=\"loadXmlEventFromRunEvent($run,$event); drawAllChannels(false,20,18,false);\" onresize=\"drawAllChannels(false,16,18,false);\">";
  

echo "<DIV class=\"heading\">"; 
echo "<h1>Event Page</h1>";
echo "</DIV>";
echo "<DIV class=middle><DIV class=content>";

echo "<h2>In Play Mode</h2>";
echo "<button type=\"button\" onclick=\"location.href='oneEvent.php?run=$run&event=$event'\">Stop</button>";


?>
    
      <canvas id="canTitle" width="90%" height="100%" style="background-color:#ffffff; resize:both;" >
	Unfortunately, your browser does not support the canvas tag
      </canvas>


      <table border="0">
   <tr>
<?php

for($i=0; $i<16; $i++) {
  if($i%4==0 )
    echo "<tr>";
  echo "<td>";
  echo "<a href=\"oneChannel.php?run=$run&event=$event&&chan=$i\">";
  echo "<canvas id=\"can$i\" style=\"background-color:#ffffff; resize:both;\" >";  
  echo "Unfortunately, your browser does not support the canvas tag";
  echo "</canvas>";
  echo "</a>";
  echo "</td>";

  if($i%4==3 )
    echo "</tr>";
}
?>
      </table>

<?php
   echo "</div></div>";

   include("left.php");

   echo "</body></html>";
?>
