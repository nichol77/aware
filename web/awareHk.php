<? 
ob_start("ob_gzhandler"); 
header("Connection: keep-alive");
?>
<!DOCTYPE html>
<html>
<head>
<link rel="StyleSheet" href="styles/jquery-ui-1.10.3.custom.min.css" type="text/css" media="screen" >
<link rel="StyleSheet" href="styles/aware.css" type="text/css" media="screen">
<link rel="StyleSheet" href="styles/base.css" type="text/css" media="screen">
<link rel="StyleSheet" href="styles/help.css" type="text/css" media="screen" >

<title>AWARE Housekeeping</title><META http-equiv="Content-Type" content="text/html; charset=utf-8"> 
<script type="text/javascript" src="src/awareUtils.js"></script>
<script type="text/javascript" src="src/awareHkTime.js"></script>
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js"></script>
<script type="text/javascript" src="src/newflot/jquery.flot.min.js.gz"></script>
<script type="text/javascript" src="src/newflot/jquery.flot.errorbars.min.js.gz"></script>
<script type="text/javascript" src="src/newflot/jquery.flot.time.min.js.gz"></script>
<script type="text/javascript" src="src/newflot/jquery.flot.canvas.min.js.gz"></script>
<script type="text/javascript" src="src/newflot/jquery.flot.selection.min.js.gz"></script>
<script type="text/javascript" src="src/newflot/jquery.flot.resize.min.js.gz"></script>
<script type="text/javascript">

  $(function() {
      initialiseAwareHkTime();
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
include("leftHk.php");
?>
</div>



<div id="openTimeTypeHelp" class="helpDialog">
  <div>
<a href="#close" title="Close" class="close">X</a>
<?php
include "help/timeTypeHelp.php";
?>
</div>
</div>


<div id="openStationHelp" class="helpDialog">
  <div>
<a href="#close" title="Close" class="close">X</a>
<?php
include "help/stationHelp.php";
?>
</div>
</div>



<div id="openHkTypeHelp" class="helpDialog">
  <div>
<a href="#close" title="Close" class="close">X</a>
<?php
include "help/hkTypeHelp.php";
?>
</div>
</div>

</body></html>

