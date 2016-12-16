<?php
ob_start("ob_gzhandler"); 
header("Connection: keep-alive");
?>

<!DOCTYPE html>
<html>
<head>
<meta name="viewport" 
  content="width=device-width, initial-scale=1.0, user-scalable=yes">
<link rel="StyleSheet" href="styles/jquery-ui-1.10.3.custom.min.css" type="text/css" media="screen" >
<link rel="StyleSheet" href="styles/base.css" type="text/css" media="screen" >
<link rel="StyleSheet" href="styles/aware.css" type="text/css" media="screen" >
<link rel="StyleSheet" href="styles/help.css" type="text/css" media="screen" >
<link rel="StyleSheet" href="styles/local.css" type="text/css" media="screen" >

<title>AWARE Telemetry</title><META http-equiv="Content-Type" content="text/html; charset=ISO-8859-1"> 
<script src="src/awareUtils.js"></script>
<script src="src/awareTelem.js"></script>
<script type="text/javascript" src="src/flot/jquery.min.js.gz"></script>
<script src="src/jqueryui/js/jquery-ui.min.js"></script>
<script type="text/javascript" src="src/flot/jquery.flot.js.gz"></script>
<script type="text/javascript" src="src/flot/jquery.flot.errorbars.min.js.gz"></script>
<script type="text/javascript" src="src/flot/jquery.flot.time.min.js.gz"></script>
<script type="text/javascript" src="src/flot/jquery.flot.canvas.min.js.gz"></script>
<script type="text/javascript" src="src/flot/jquery.flot.selection.min.js.gz"></script>
<script type="text/javascript" src="src/flot/jquery.flot.resize.js.gz"></script>
<script type="text/javascript" src="src/flot/jquery.flot.symbol.js.gz"></script>

<script type="text/javascript">

  $(function() {
  	       initialiseAwareTelem();
  	       
});  

</script>
</head>



<body>


<div class="heading">
<div id="titleContainer">
<h1>AWARE Housekeeping</h1>
</div>
</div>
<div class=middle><div id="plot-holder-1" class="plot-holder"  >

<div id="plot-header-1" class="plot-header">
<h3>Time Plot</h3>
</div>
<div id="plot-content-1" class="plot-content" style="width:100%; height:96% ; ">
<div id="plot-preamble" class="plot-preamble">
<span style="float:left;" id="plot-text-1" class="plot-text"></span>
<form>
<div id="layoutRadio" style="float:right; padding-right:10px;">
    <input type="radio" value="both" id="layoutBoth" name="layoutRadio" checked="checked" /><label for="layoutBoth">Both</label>
    <input type="radio" value="time" id="layoutTime" name="layoutRadio"  /><label for="layoutTime">Time</label>
    <input type="radio" value="projection" id="layoutProjection" name="layoutRadio" /><label for="layoutProjection">Projection</label>
  </div>
</form>
</div>
<div id="divTime-1" style="width:70%; height:70%; padding: 0px; float : left; "></div>
<div id="divProjection-1" style="width:30%; height:70%; padding: 0px; float : left;"></div>
<div id="divLabel-1" style="width:0%; height:0%; padding: 0px; float : right;"></div>
<div id="divChoices-1" style="width:80%; height:10%; padding: 0px; float : left;">
  <p class="choiceList" id="choices-1" style=""></p></div>
</div>
</div>
<div id="debugContainer"></div>

</div>

<div class="leftBar" id="leftbar">
<?php
include("leftTelem.php");
?>
</div>



<div id="openStationHelp" class="helpDialog">
  <div>
<a href="#close" title="Close" class="close">X</a>
<?php
include "help/stationHelp.php";
?>
</div>
</div>



<div id="openLayoutHelp" class="helpDialog">
  <div>
<a href="#close" title="Close" class="close">X</a>
<?php
include "help/layoutHelp.php";
?>
</div>
</div>



<div id="openWaveformHelp" class="helpDialog">
  <div>
<a href="#close" title="Close" class="close">X</a>
<?php
include "help/waveformHelp.php";
?>
</div>
</div>

</body></html>

