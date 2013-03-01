<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
"http://www.w3.org/TR/html4/strict.dtd"> 
<html>
<head>
<link rel="StyleSheet" href="/uhen/ara/monitor/styles/base.css" type="text/css" media="screen" />
<link rel="StyleSheet" href="/uhen/ara/monitor/styles/default.css" type="text/css" media="screen" title="RJN default" />
<title>Event Housekeeping</title><META http-equiv="Content-Type" content="text/html; charset=ISO-8859-1"> 
<script src="src/awareUtils.js"></script>
<script src="src/awareHk.js"></script>
<script language="javascript" type="text/javascript" src="src/flot/jquery.js"></script>
<script language="javascript" type="text/javascript" src="src/flot/jquery.flot.js"></script>
<script language="javascript" type="text/javascript" src="src/flot/jquery.flot.errorbars.js"></script>
</head>

<?php
$run=$_GET["run"];
if($_GET["run"] === null) {
  $run=1999;
 }


echo "<body onload=\"drawRunSummaryHkJSON('divL1','divThresh','STATION1B',$run);\" onresize=\"drawRunSummaryHkJSON('divL1','divThresh','STATION1B',$run);\">";


echo '<DIV class="heading">';
echo "<h1>Event Housekeeping</h1>";
echo "</DIV>";
echo "<DIV class=middle>";
echo "<DIV class=content>";
echo "<h1>Run $run</h1>";

echo "<a href=\"eventHkRunTime.php?run=$run&plot=singleChannelRate\">";
echo '<h2>Average L1 Scalers</h2> ';
echo '<div id="divL1" style="width:100%; height:300px; padding: 0px; position : relative;"></div>';
echo "</a>";

echo '<h2>Average Thresholds</h1>';
echo '<div id="divThresh" style="width:100%; height:300px; padding: 0px; position : relative;"></div>';

echo "</div></div>";




include("left.php");

echo "</body></html>";

?>