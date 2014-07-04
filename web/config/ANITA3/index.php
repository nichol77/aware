<? 
ob_start("ob_gzhandler"); 
header("Connection: keep-alive");
?>
<!DOCTYPE html>
<html>
<head>
<link rel="StyleSheet" href="styles/base.css" type="text/css" media="screen" >
<link rel="StyleSheet" href="styles/aware.css" type="text/css" media="screen" />
<link rel="StyleSheet" href="`styles/local.css" type="text/css" media="screen" />
<title>ANITA-3 - AWARE</title><META http-equiv="Content-Type" content="text/html; charset=utf-8"> 
<script language="javascript" type="text/javascript" src="src/flot/jquery.min.js.gz"></script>
</head>



<body>


<DIV class="heading">
<h1>ANITA Web Monitor</h1>
</DIV>
<DIV class=single>
<DIV class=content>
<h2>ANITA-3</h2>
<a href="events.php?instrument=ANITA3">
<div class="lastBox">
  Last Event: 
<span id="lastEvent">
<?php
$lastEvent='output/ANITA3/lastEvent';
include $lastEvent ;
echo "</span>";
if (file_exists($lastEvent)) {
    echo " started " . date ("F d Y H:i.", filemtime($lastEvent));
}
?>
</div>
</a>


<a href="awareHk.php?instrument=ANITA3&hkType=hk">
<div class="lastBox">
  Last Hk: 
<span id="lastHk">
<?php
$lastHk='output/ANITA3/lastHk';
include $lastHk ;
echo "</span>";
if (file_exists($lastHk)) {
    echo " started " . date ("F d Y H:i.", filemtime($lastHk));
}
?>
</div>
</a>

<a href="awareHk.php?instrument=ANITA3&hkType=header">
<div class="lastBox">
  Last Header: 
<span id="lastHeader">
<?php
$lastHeader='output/ANITA3/lastHeader';
include $lastHeader ;
echo "</span>";
if (file_exists($lastHeader)) {
    echo " started " . date ("F d Y H:i.", filemtime($lastHeader));
}
?>
</div>
</a>


</div>
</div>

</body></html>

