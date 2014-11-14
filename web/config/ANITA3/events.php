<? 
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

<title>AWARE Events</title><META http-equiv="Content-Type" content="text/html; charset=ISO-8859-1"> 
<script src="src/awareUtils.js"></script>
<script src="src/awareMagicDisplay.js"></script>
<script type="text/javascript" src="src/flot/jquery.min.js.gz"></script>
<script src="src/jqueryui/js/jquery-ui.min.js"></script>
<script type="text/javascript" src="src/flot/jquery.flot.js.gz"></script>
<script type="text/javascript" src="src/flot/jquery.flot.errorbars.min.js.gz"></script>
<script type="text/javascript" src="src/flot/jquery.flot.time.min.js.gz"></script>
<script type="text/javascript" src="src/flot/jquery.flot.selection.min.js.gz"></script>
<script type="text/javascript" src="src/flot/jquery.flot.resize.js.gz"></script>
<script type="text/javascript" src="src/flot/jquery.flot.symbol.js.gz"></script>

<script type="text/javascript">

  $(function() {
  	       initialiseAwareMagicDisplay();
  	       
});  

</script>
</head>



<body>


<DIV class="heading">
<h1>AWARE Event Display</h1>
</DIV>
<DIV class=middle>
<DIV class=content>
<div id="titleContainer"></div>
<div id="divEvent" style="width:100%; height:85%; padding: 0px; float : left;"></div>
<div id="debugContainer"></div>


</div></div>

<div class="leftBar" id="leftbar">
<?php
include("leftEvent.php");
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

