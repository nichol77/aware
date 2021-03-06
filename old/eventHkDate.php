<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
"http://www.w3.org/TR/html4/strict.dtd"> 
<html>
<head>
<link rel="StyleSheet" href="styles/base.css" type="text/css" media="screen" />
<link rel="StyleSheet" href="styles/default.css" type="text/css" media="screen" title="RJN default" />
<title>Event Housekeeping</title><META http-equiv="Content-Type" content="text/html; charset=ISO-8859-1"> 

<script src="src/awareUtils.js"></script>
<script src="src/awareHkTime.js"></script>
<script language="javascript" type="text/javascript" src="src/flot/jquery.js"></script>
<script language="javascript" type="text/javascript" src="src/flot/jquery.flot.js"></script>
<script language="javascript" type="text/javascript" src="src/flot/jquery.flot.errorbars.js"></script>
<script language="javascript" type="text/javascript" src="src/flot/jquery.flot.time.js"></script>
<script language="javascript" type="text/javascript" src="src/flot/jquery.flot.selection.js"></script>
<script language="javascript" type="text/javascript" src="src/jqueryui/js/jquery-ui-1.10.1.custom.js"></script>


<script type="text/javascript">

  $(function() {
      setHkTypeAndCanName('eventHk','divTime');
      drawDateHkTimePlot();
  });  


  $(function() {
    $( "#datepicker" ).datepicker({
      onSelect: function() {
	  drawDateHkTimePlot();
	}
      });
    });

</script>

</head>



<body>


<DIV class="heading">
<h1>Event Housekeeping</h1>
</DIV>
<DIV class=middle>
<DIV class=content>


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
<h2>Update</h2>


<form name="runForm"   id="runForm" action="javascript:drawDateHkTimePlot(); javascript:void(0);">
Station: <select id="stationForm" onchange="javascript:drawDateHkTimePlot();">
  <option value="STATION1B">ARA01</option>
  <option value="STATION2">ARA02</option>
  <option value="STATION3">ARA03</option>
</select> <br />
Plot: <select id="plotForm" onchange="javascript:drawDateHkTimePlot();">
  <option value="singleChannelRate">L1 Rate</option>
  <option value="singleChannelThreshold">L1 Threshold</option>
  <option value="oneOfFour">L2 (1 of 4)</option>
  <option value="twoOfFour">L2 (2 of 4)</option>
  <option value="threeOfFour">L2 (3 of 4)</option>
  <option value="threeOfEight">L2 (3 of 8)</option>
  <option value="vadj">V_adj</option>
  <option value="vdly">V_dly</option>
  <option value="wilkinsonC">Wilkinson</option>
  <option value="pps">PPS</option>
  <option value="clock">100MHz</option>
</select>
</form>

Date: <input type="text" id="datepicker" value="01/07/2013"  />

</div>


</body></html>

