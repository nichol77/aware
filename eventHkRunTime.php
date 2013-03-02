<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
"http://www.w3.org/TR/html4/strict.dtd"> 
<html>
<head>
<link rel="StyleSheet" href="/uhen/ara/monitor/styles/base.css" type="text/css" media="screen" />
<link rel="StyleSheet" href="/uhen/ara/monitor/styles/default.css" type="text/css" media="screen" title="RJN default" />
<title>Event Housekeeping</title><META http-equiv="Content-Type" content="text/html; charset=ISO-8859-1"> 
<script src="src/awareUtils.js"></script>
<script src="src/awareHkTime.js"></script>
<script language="javascript" type="text/javascript" src="src/flot/jquery.js"></script>
<script language="javascript" type="text/javascript" src="src/flot/jquery.flot.js"></script>
<script language="javascript" type="text/javascript" src="src/flot/jquery.flot.errorbars.js"></script>
<script language="javascript" type="text/javascript" src="src/flot/jquery.flot.time.js"></script>
</head>

<?php
$run=$_GET["run"];
if($_GET["run"] === null) {
  $run=1999;
 }


$plot=$_GET["plot"];
if($_GET["plot"] === null) {
  $plot=singleChannelRate;
 }



echo "<body onload=\"drawHkTimePlot('divTime','$plot','STATION1B',$run);\" onresize=\"drawHkTimePlot('divTime','$plot','STATION1B',$run);\">";


echo '<DIV class="heading">';
echo "<h1>Event Housekeeping</h1>";
echo "</DIV>";
echo "<DIV class=middle>";
echo "<DIV class=content>";


echo "<h1>Run $run</h1>";
echo "<h2>Plot $plot</h2>";
echo '<div class="demo-container">';
echo '<div id="divTime" style="width:85%; height:300px; padding: 0px; float : left;"></div>';

echo '<p id="choices" style="float:right; width:15%;"></p>';
echo '</div>';


echo "</div></div>";




include("left.php");

echo "</body></html>";

?>