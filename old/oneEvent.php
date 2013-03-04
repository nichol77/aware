<!DOCTYPE html>
<html>
    <head>
        <script src="src/mygraph.js"></script>
        <script src="src/aware.js"></script>
<?php

   include("/uhen/ara/monitor/styles.shtml");
   echo "<link rel=\"StyleSheet\" href=\"/uhen/ara/monitor/styles/base.css\" type=\"text/css\" media=\"screen\" />
<link rel=\"StyleSheet\" href=\"/uhen/ara/monitor/styles/default.css\" type=\"text/css\" media=\"screen\" title=\"RJN default\" />";


   echo "<TITLE>Event Page</TITLE>";
?>

    </head>
    <body onload="loadXmlEvent(); drawAllChannels(false,20,18,false);" onresize="drawAllChannels(false,16,18,false);">
   
<?php

require("utils.php");

   echo "<DIV class=\"heading\">"; 
   echo "<h1>Event Page</h1>";
   echo "</DIV>";
   echo "<DIV class=middle><DIV class=content>";



$run=$_GET["run"];
$event=$_GET["event"];

$eventList=getEventListArray($run);
$eventIndex=getEventIndex($eventList,$event);
$eventCount=count($eventList);
if($eventIndex > 0 ) {
  $previousEvent =$eventList[$eventIndex-1];
  echo "<button type=\"button\" onclick=\"location.href='oneEvent.php?run=$run&event=$previousEvent'\">Previous Event</button>";
 }
if($eventIndex < $eventCount-1) {
  $nextEvent=$eventList[$eventIndex+1];
  echo "<button type=\"button\" onclick=\"location.href='oneEvent.php?run=$run&event=$nextEvent'\">Next Event</button>";
 }



echo  "<form action=\"oneEvent.php\" method=\"get\">";
echo  "Run: <input type=\"text\" name=\"run\" value=\"$run\" /><br />";
echo  "Event: <input type=\"text\" name=\"event\" value=\"$event\" /><br />";
echo  "<button type=\"Go To\" value=\"Go To\">Go To</button>";
echo  "</form>";

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
