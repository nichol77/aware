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
<link rel="StyleSheet" href="styles/local.css" type="text/css" media="screen" >

<title>AWARE Command View</title><META http-equiv="Content-Type" content="text/html; charset=utf-8"> 
<script type="text/javascript" src="src/awareUtils.js"></script>
<script type="text/javascript" src="src/awareCmd.js"></script>
<script src="src/jqueryui/js/jquery.min.js"></script>
<script src="src/jqueryui/js/jquery-ui.min.js"></script>
<script type="text/javascript" src="src/flot/jquery.flot.min.js.gz"></script>
<script type="text/javascript" src="src/flot/jquery.flot.errorbars.min.js.gz"></script>
<script type="text/javascript" src="src/flot/jquery.flot.time.min.js.gz"></script>
<script type="text/javascript" src="src/flot/jquery.flot.canvas.min.js.gz"></script>
<script type="text/javascript" src="src/flot/jquery.flot.selection.min.js.gz"></script>
<script type="text/javascript" src="src/flot/jquery.flot.resize.min.js.gz"></script>
<script type="text/javascript">

  $(function() {
      initialiseCmdView();
  });  

</script>
</head>



<body>


<div class="heading">
<div id="titleContainer">
<h1>AWARE Command View</h1>
</div>
</div>
<div class=middle>


<h3>Commands Sent</h3>
<div id="cmdSent" class="cmdSent" ></div>
<h3>Command Echos</h3>
<h3>Ground</h3>
<div id="cmdEchoGround" class="cmdEchoGround" ></div>
<h3>Payload</h3>
<div id="cmdEchoPayload" class="cmdEchoPayload" ></div>
<div id="debugContainer"></div>

</div> 

<div class="leftBar" id="leftbar">
<?php
include("leftCmd.php");
?>

</div>


</body></html>

