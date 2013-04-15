<? 
ob_start("ob_gzhandler"); 
header("Connection: keep-alive");
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
"http://www.w3.org/TR/html4/strict.dtd"> 
<html>
<head>
<link rel="StyleSheet" href="styles/base.css.gz" type="text/css" media="screen" />
<link rel="StyleSheet" href="styles/default.css.gz" type="text/css" media="screen" title="RJN default" />
<title>Event Housekeeping</title><META http-equiv="Content-Type" content="text/html; charset=ISO-8859-1"> 
<script type="text/javascript" src="src/awareUtils.js.gz"></script>
<script type="text/javascript" src="src/awareHkTime.js.gz"></script>
<script language="javascript" type="text/javascript" src="src/flot/jquery.min.js.gz"></script>
<script language="javascript" type="text/javascript" src="src/flot/jquery.flot.min.js.gz"></script>
<script language="javascript" type="text/javascript" src="src/flot/jquery.flot.errorbars.min.js.gz"></script>
<script language="javascript" type="text/javascript" src="src/flot/jquery.flot.time.min.js.gz"></script>
<script language="javascript" type="text/javascript" src="src/flot/jquery.flot.selection.min.js.gz"></script>
<script type="text/javascript">

  $(function() {

      var urlVars=getUrlVars();
      var timeType='full'; 
      if("timeType" in urlVars) {
	timeType=urlVars["timeType"];
      }

      //      var canContainer = $("#debugContainer");
      //      canContainer.append("<p>"+timeType+"</p>");
      //      canContainer.append("<p>"+urlVars["timeType"]+"</p>");

      setHkTypeAndCanName('header','divTime',timeType);
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
<div id="divTime" style="width:90%; height:50%; padding: 0px; float : left;"></div>
<div id="divLabel" style="width:10%; height:50%; padding: 0px; float : right;"></div>
<p>
  Click and drag on the background to zoom, double click to unzoom.
</p>

<p id="choices" style=""></p>
</div>


</div></div>

<div class="vertical" id="leftbar">
<?php
include("left.php");
?>
</div>
</body></html>

