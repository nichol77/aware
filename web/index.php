<? 
ob_start("ob_gzhandler"); 
header("Connection: keep-alive");
?>
<!DOCTYPE html>
<html>
<head>
<link rel="StyleSheet" href="styles/base.css.gz" type="text/css" media="screen" >
<link rel="StyleSheet" href="styles/aware.css" type="text/css" media="screen" />

<link rel="StyleSheet" href="styles/default.css.gz" type="text/css" media="screen" title="RJN default" >
<title>ARA - AWARE</title><META http-equiv="Content-Type" content="text/html; charset=utf-8"> 
<script language="javascript" type="text/javascript" src="src/flot/jquery.min.js.gz"></script>

</head>



<body>


<DIV class="heading">
<h1>ARA Web Monitor</h1>
</DIV>
<DIV class=middle>
<DIV class=content>
<h2>ARA02</h2>
<a href="awareHk.php?instrument=STATION2">
<div class="lastBox">
  Last Run: 
<span id="lastRun">
<?php
$lastRun='output/STATION2/lastRun';
include $lastRun ;
echo "</span>";
if (file_exists($lastRun)) {
    echo " started " . date ("F d Y H:i.", filemtime($lastRun));
}
?>
</div>
</a>

<a href="awareHk.php?instrument=STATION2&hkType=eventHk">
<div class="lastBox">
  Last Event Hk: 
<span id="lastEventHk">
<?php
$lastEventHk='output/STATION2/lastEventHk';
include $lastEventHk ;
echo "</span>";
if (file_exists($lastEventHk)) {
    echo " started " . date ("F d Y H:i.", filemtime($lastEventHk));
}
?>
</div>
</a>
<a href="awareHk.php?instrument=STATION2&hkType=sensorHk">
<div class="lastBox">
  Last Sensor Hk: 
<span id="lastSensorHk">
<?php
$lastSensorHk='output/STATION2/lastSensorHk';
include $lastSensorHk ;
echo "</span>";
if (file_exists($lastSensorHk)) {
    echo " started " . date ("F d Y H:i.", filemtime($lastSensorHk));
}
?>
</div>
</a>


<h2>ARA03</h2>
<a href="awareHk.php?instrument=STATION3">
<div class="lastBox">
  Last Run:
<span id="lastRun">
<?php
$lastRun='output/STATION3/lastRun';
include $lastRun ;
echo "</span>";
if (file_exists($lastRun)) {
    echo " started " . date ("F d Y H:i.", filemtime($lastRun));
}
?>

</div>
</a>
<a href="awareHk.php?instrument=STATION3&hkType=eventHk">
<div class="lastBox">
  Last Event Hk:
<span id="lastEventHk">
<?php
$lastEventHk='output/STATION3/lastEventHk';
include $lastEventHk ;
echo "</span>";
if (file_exists($lastEventHk)) {
    echo " started " . date ("F d Y H:i.", filemtime($lastEventHk));
}
?>
</div>
</a>
<a href="awareHk.php?instrument=STATION3&hkType=sensorHk">
<div class="lastBox">
  Last Sensor Hk:
<span id="lastSensorHk">
<?php
$lastSensorHk='output/STATION3/lastSensorHk';
include $lastSensorHk ;
echo "</span>";
if (file_exists($lastSensorHk)) {
    echo " started " . date ("F d Y H:i.", filemtime($lastSensorHk));
}
?>
</div>
</a>


<h2>ARA01</h2>
<a href="awareHk.php?instrument=STATION1B">
<div class="lastBox">
  Last Run:
<span id="lastRun">
<?php
$lastRun='output/STATION1B/lastRun';
include $lastRun ;
echo "</span>";
if (file_exists($lastRun)) {
    echo " started " . date ("F d Y H:i.", filemtime($lastRun));
}
?>

</div>
</a>
<a href="awareHk.php?instrument=STATION1B&hkType=eventHk">
<div class="lastBox">
  Last Event Hk:
<span id="lastEventHk">
<?php
$lastEventHk='output/STATION1B/lastEventHk';
include $lastEventHk ;
echo "</span>";
if (file_exists($lastEventHk)) {
    echo " started " . date ("F d Y H:i.", filemtime($lastEventHk));
}
?>
</div>
</a>
<a href="awareHk.php?instrument=STATION1B&hkType=sensorHk">
<div class="lastBox">
  Last Sensor Hk:
<span id="lastSensorHk">
<?php
$lastSensorHk='output/STATION1B/lastSensorHk';
include $lastSensorHk ;
echo "</span>";
if (file_exists($lastSensorHk)) {
    echo " started " . date ("F d Y H:i.", filemtime($lastSensorHk));
}
?>
</div>
</a>


</div>
</div>

<div class="vertical" id="leftbar">
<?php
include("leftMain.php");
?>
</div>
</body></html>

