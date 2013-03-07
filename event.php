<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
"http://www.w3.org/TR/html4/strict.dtd"> 
<html>
<head>
<link rel="StyleSheet" href="styles/aware.css" type="text/css" media="screen" title="AWARE default" />
<link rel="StyleSheet" href="styles/ara.css" type="text/css" media="screen" title="RJN default" />
<link rel="StyleSheet" href="styles/base.css" type="text/css" media="screen" />

<title>Event</title><META http-equiv="Content-Type" content="text/html; charset=ISO-8859-1"> 
<script src="src/awareUtils.js"></script>
<script src="src/awareEvent.js"></script>
<script language="javascript" type="text/javascript" src="src/flot/jquery.js"></script>
<script language="javascript" type="text/javascript" src="src/flot/examples/shared/jquery-ui/jquery-ui.min.js"></script>
<script language="javascript" type="text/javascript" src="src/flot/jquery.flot.js"></script>
<script language="javascript" type="text/javascript" src="src/flot/jquery.flot.errorbars.js"></script>
<script language="javascript" type="text/javascript" src="src/flot/jquery.flot.time.js"></script>
<script language="javascript" type="text/javascript" src="src/flot/jquery.flot.selection.js"></script>
<script language="javascript" type="text/javascript" src="src/flot/jquery.flot.resize.js"></script>
<script type="text/javascript">

  $(function() {
  
  var urlVars=getUrlVars();
  var timeType='simple'; 
  if("timeType" in urlVars) {
  timeType=urlVars["timeType"];
  }
  
  setRowsAndCols(5,4);
  fillEventDivWithWaveformContainers();
  plotEvent();
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
<div id="divEvent" style="width:100%; height:100%; padding: 0px; float : left;"></div>

<p id="choices" style=""></p>
</div>


</div></div>

<div class="vertical" id="leftbar">
<?php
include("left.php");
?>
</div>
</body></html>

