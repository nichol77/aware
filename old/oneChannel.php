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
    <body onload="loadXmlEvent(); drawOneChannel('canOne',true);" onresize="drawOneChannel('canOne',true);">
   
<?php



   echo "<DIV class=\"heading\">"; 
   echo "<h1>Event Page</h1>";
   echo "</DIV>";

   echo "<DIV class=middle><DIV class=content>";
?>


    <div>
      <canvas id="canTitle" width="90%" height="100%" style="background-color:#ffffff; resize:both;" >
	Unfortunately, your browser does not support the canvas tag
      </canvas>
</div>

<div>
<?php

  echo "<canvas id=\"canOne\" style=\"background-color:#ffffff; resize:both;\" >";  
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
