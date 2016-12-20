<?php 
ob_start("ob_gzhandler"); 
header("Connection: keep-alive");
?>

<!DOCTYPE html>
<html>
<head>
<meta name="viewport" 
  content="width=device-width, initial-scale=1.0, user-scalable=yes">
  <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
<link rel="StyleSheet" href="styles/jquery-ui-1.10.3.custom.min.css" type="text/css" media="screen" >
<link rel="StyleSheet" href="styles/base.css" type="text/css" media="screen" >
<link rel="StyleSheet" href="styles/aware.css" type="text/css" media="screen" >
<link rel="StyleSheet" href="styles/help.css" type="text/css" media="screen" >
<link rel="StyleSheet" href="styles/local.css" type="text/css" media="screen" >

<title>ANITA Map</title><META http-equiv="Content-Type" content="text/html; charset=ISO-8859-1"> 
<script src="src/awareUtils.js"></script>
<script src="src/awareMap.js"></script>
<script type="text/javascript" src="src/flot/jquery.min.js.gz"></script>
<script src="src/jqueryui/js/jquery-ui.min.js"></script>
<script type="text/javascript" src="src/flot/jquery.flot.js.gz"></script>
<script type="text/javascript" src="src/flot/jquery.flot.errorbars.min.js.gz"></script>
<script type="text/javascript" src="src/flot/jquery.flot.time.min.js.gz"></script>
<script type="text/javascript" src="src/flot/jquery.flot.canvas.min.js.gz"></script>
<script type="text/javascript" src="src/flot/jquery.flot.image.min.js.gz"></script>
<script type="text/javascript" src="src/flot/jquery.flot.selection.min.js.gz"></script>
<script type="text/javascript" src="src/flot/jquery.flot.resize.js.gz"></script>
<script type="text/javascript" src="src/flot/jquery.flot.symbol.js.gz"></script>
<script  type="text/javascript" src="src/highcharts/highcharts.js"></script>
<script src="https://code.highcharts.com/highcharts-more.js"></script>
<script  type="text/javascript" src="src/highcharts/exporting.js"></script>

<script type="text/javascript">

  $(function() {
  	       initialiseAwareMap();
  	       
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
<h3>ANITA Course</h3>
</div>

<form>
  <div id="mapRadio" style="float:right; padding-right:10px;">
    <input type="radio" value="old" id="mapOld" name="mapRadio"  /><label for="mapOld">Bedmap1</label>
    <input type="radio" value="low" id="mapLow" name="mapRadio" checked="checked" /><label for="mapLow">Bedmap2 (SD)</label>
    <input type="radio" value="high" id="mapHigh" name="mapRadio" /><label for="mapHigh">Bedmap2 (HD)</label>
  </div>
  </form>
<div id="plot-content-1" class="plot-content" style="width:100%; height:96% ; ">

<div id="divMap-1" style="width:60%; height:80%; padding: 0px; float : left; "></div>
<div id="divMapInfo" style="width:20%; height:80%; padding: 20px; float : left; "></div>
</div>

<div id="debugContainer"></div>
</div>
</div>


<div class="leftBar" id="leftbar">
<?php
include("leftMap.php");
?>
</div>



</body></html>

