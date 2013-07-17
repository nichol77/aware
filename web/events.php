<? 
ob_start("ob_gzhandler"); 
header("Connection: keep-alive");
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
"http://www.w3.org/TR/html4/strict.dtd"> 
<html>
<head>
<meta name="viewport" 
  content="width=device-width, initial-scale=1.0, user-scalable=no">
<link rel="StyleSheet" href="styles/base.css" type="text/css" media="screen" />
<link rel="StyleSheet" href="styles/aware.css" type="text/css" media="screen" />
<link rel="StyleSheet" href="styles/ara.css" type="text/css" media="screen" />

<title>AWARE Events</title><META http-equiv="Content-Type" content="text/html; charset=ISO-8859-1"> 
<script src="src/awareUtils.js"></script>
<script src="src/awareEvent.js"></script>
<script language="javascript" type="text/javascript" src="src/flot/jquery.min.js.gz"></script>
<script language="javascript" type="text/javascript" src="src/flot/examples/shared/jquery-ui/jquery-ui.min.js.gz"></script>
<script language="javascript" type="text/javascript" src="src/flot/jquery.flot.min.js.gz"></script>
<script language="javascript" type="text/javascript" src="src/flot/jquery.flot.errorbars.min.js.gz"></script>
<script language="javascript" type="text/javascript" src="src/flot/jquery.flot.time.min.js.gz"></script>
<script language="javascript" type="text/javascript" src="src/flot/jquery.flot.selection.min.js.gz"></script>
<script language="javascript" type="text/javascript" src="src/flot/jquery.flot.resize.js.gz"></script>

<script type="text/javascript">

  $(function() {
document.body.addEventListener('touchmove', function(event) {
  event.preventDefault();
}, false);   

  var urlVars=getUrlVars();
  var timeType='simple'; 
  if("timeType" in urlVars) {
  timeType=urlVars["timeType"];
  }
  var colLabels= new Array("1/5","2/6","3/7","4/8");
  var rowLabels= new Array("V1-4","V5-8","H1-4","H5-8","S1-4");
  
  setRowsAndCols(5,4,rowLabels,colLabels);
  fillEventDivWithWaveformContainers();
  drawPlot();
});  

</script>
</head>



<body>


<DIV class="heading">
<h1>Event Housekeeping</h1>
</DIV>
<DIV class=middle>
<DIV class=content>

<div id="debugContainer"></div>
<div id="titleContainer"></div>
<div id="divEvent" style="width:100%; height:85%; padding: 0px; float : left;"></div>

<p id="choices" style=""></p>
</div>


</div></div>

<div class="vertical" id="leftbar">
<?php
include("leftEvent.php");
?>
</div>
</body></html>

