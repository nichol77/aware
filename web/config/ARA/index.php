<? 
ob_start("ob_gzhandler"); 
header("Connection: keep-alive");
?>
<!DOCTYPE html>
<html>
<head>
<link rel="StyleSheet" href="styles/base.css" type="text/css" media="screen" >
<link rel="StyleSheet" href="styles/aware.css" type="text/css" media="screen" />
<link rel="StyleSheet" href="styles/ara.css" type="text/css" media="screen" />
<title>ARA - AWARE</title><META http-equiv="Content-Type" content="text/html; charset=utf-8"> 
<script language="javascript" type="text/javascript" src="src/flot/jquery.min.js.gz"></script>
<script src="http://code.highcharts.com/highcharts.js"></script>
</head>



<body>


<DIV class="heading">
<h1>ARA Web Monitor</h1>
</DIV>
<DIV class=single>
<DIV class=content>
<h2>ARA02</h2>
<a href="events.php?instrument=STATION2">
<div class="lastBox">
  Last Event: 
<span id="lastEvent">
<?php
$lastEvent='output/STATION2/lastEvent';
include $lastEvent ;
echo "</span>";
if (file_exists($lastEvent)) {
    echo " started " . date ("F d Y H:i.", filemtime($lastEvent));
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

<a href="awareHk.php?instrument=STATION2&hkType=header">
<div class="lastBox">
  Last Header: 
<span id="lastHeader">
<?php
$lastHeader='output/STATION2/lastHeader';
include $lastHeader ;
echo "</span>";
if (file_exists($lastHeader)) {
    echo " started " . date ("F d Y H:i.", filemtime($lastHeader));
}
?>
</div>
</a>


<h2>ARA03</h2>
<a href="events.php?instrument=STATION3">
<div class="lastBox">
  Last Event:
<span id="lastEvent">
<?php
$lastEvent='output/STATION3/lastEvent';
include $lastEvent ;
echo "</span>";
if (file_exists($lastEvent)) {
    echo " started " . date ("F d Y H:i.", filemtime($lastEvent));
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

<a href="awareHk.php?instrument=STATION3&hkType=header">
<div class="lastBox">
  Last Header: 
<span id="lastHeader">
<?php
$lastHeader='output/STATION3/lastHeader';
include $lastHeader ;
echo "</span>";
if (file_exists($lastHeader)) {
    echo " started " . date ("F d Y H:i.", filemtime($lastHeader));
}
?>
</div>
</a>



<h2>ARA01</h2>
<a href="events.php?instrument=STATION1B">
<div class="lastBox">
  Last Event:
<span id="lastEvent">
<?php
$lastEvent='output/STATION1B/lastEvent';
include $lastEvent ;
echo "</span>";
if (file_exists($lastEvent)) {
    echo " started " . date ("F d Y H:i.", filemtime($lastEvent));
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

<a href="awareHk.php?instrument=STATION1B&hkType=header">
<div class="lastBox">
  Last Header: 
<span id="lastHeader">
<?php
$lastHeader='output/STATION1B/lastHeader';
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

