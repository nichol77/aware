<!DOCTYPE html>
<html>
    <head>
        <script src="src/mygraph.js"></script>
        <script src="src/awareHk.js"></script>
        <script language="javascript" type="text/javascript" src="src/flot/jquery.js"></script>
        <script language="javascript" type="text/javascript" src="src/flot/jquery.flot.js"></script>
        <script language="javascript" type="text/javascript" src="src/flot/jquery.flot.errorbars.js"></script>

<?php

   include("/uhen/ara/monitor/styles.shtml");
   echo "<link rel=\"StyleSheet\" href=\"/uhen/ara/monitor/styles/base.css\" type=\"text/css\" media=\"screen\" />
<link rel=\"StyleSheet\" href=\"/uhen/ara/monitor/styles/default.css\" type=\"text/css\" media=\"screen\" title=\"RJN default\" />";


   echo "<TITLE>Event HK Run</TITLE>";
?>

    </head>
    <body onload="loadXmlSummaryHk(); drawRunSummaryHk('divHk');" onresize="drawRunSummaryHk('divHk');">
   
<?php

   echo "<DIV class=\"heading\">"; 
   echo "<h1>Event Page</h1>";
   echo "</DIV>";
   echo "<DIV class=middle><DIV class=content>";
?>

<div id="divHk" style="width:600px; height:300px; padding: 0px; position : relative;"></div>

<?php
   echo "</div></div>";

   include("left.php");

   echo "</body></html>";
?>
