<!DOCTYPE html>
<html>
    <head>
        <script src="src/mygraph.js"></script>
        <script src="src/awareHk.js"></script>
<?php

   include("/uhen/ara/monitor/styles.shtml");
   echo "<link rel=\"StyleSheet\" href=\"/uhen/ara/monitor/styles/base.css\" type=\"text/css\" media=\"screen\" />
<link rel=\"StyleSheet\" href=\"/uhen/ara/monitor/styles/default.css\" type=\"text/css\" media=\"screen\" title=\"RJN default\" />";


   echo "<TITLE>Sensor HK Run</TITLE>";
?>

    </head>
    <body onload="loadXmlHk(); drawHk('canHk',true);" onresize="drawHk('canHk',true);">
   
<?php

   echo "<DIV class=\"heading\">"; 
   echo "<h1>Event Page</h1>";
   echo "</DIV>";

   echo "<DIV class=middle><DIV class=content>";
?>


<div>
<?php

  echo "<canvas id=\"canHk\" style=\"background-color:#ffffff; resize:both;\" >";  
  echo "Unfortunately, your browser does not support the canvas tag";
  echo "</canvas>";
  echo "</a>";
?>
</div>
<?php
   echo "</div></div>";

   include("left.php");

   echo "</body></html>";
?>
