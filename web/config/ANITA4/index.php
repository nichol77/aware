<? 
ob_start("ob_gzhandler"); 
header("Connection: keep-alive");
?>
<!DOCTYPE html>
<html>
<head>
<link rel="StyleSheet" href="styles/base.css" type="text/css" media="screen" >
<link rel="StyleSheet" href="styles/aware.css" type="text/css" media="screen" />
<link rel="StyleSheet" href="styles/local.css" type="text/css" media="screen" />
<title>ANITA-4 - AWARE</title><META http-equiv="Content-Type" content="text/html; charset=utf-8"> 
<script language="javascript" type="text/javascript" src="src/flot/jquery.min.js.gz"></script>
</head>



<body>


<DIV class="heading">
<h1>ANITA Raw Data Monitor</h1>
</DIV>
<DIV class=single>
<DIV class=content>
<h2>ANITA-4</h2>
<?php 


// Events are considered fresh untill an hour old (green)
// then they mid aged (orange) then after the old point (red)
$oldPoint = 86400; //In seconds 86400 is 24 hours
$midPoint = 10800;  //three hours


echo "<h3>Data Types</h3>";

echo '<a href="events.php?instrument=ANITA4">';
$lastEvent='output/ANITA4/lastEvent';

  if (file_exists($lastEvent)) {
    $timeStarted =  " started " . date ("F d Y H:i. e", filemtime($lastEvent));
    $timeSinceLast = floor((time()-filemtime($lastEvent)));
    $colourString = "class='lastBoxNew'";
    if ($timeSinceLast>$oldPoint) {$colourString = "class='lastBoxOld'";}
    else if ($timeSinceLast>$midPoint&&$timeSinceLast<$oldPoint){
    $colourString= "class='lastBoxMiddle'";}
    else {$colourString = "class='lastBoxNew'";}
  }
  else {
    $colourString = "class='lastBoxOld'";
  }


  echo "<div ".$colourString."  >";
  echo "Last Event:";
  echo "<span id=\"lastEvent\">";
  include $lastEvent ;
  echo "</span>";
  echo $timeStarted;
  echo "</div>";
  echo "</a>";



$hkType_array = parse_ini_file("config/ANITA4/hkTypeList.ini", true);

foreach($hkType_array as $inst => $properties){
  $key=$properties[name];
  $Key= ucfirst($key);
  $value=$properties[title];
  # echo "$key";
  $lastHk="output/ANITA4/last$Key";
if (file_exists($lastHk)) {
    $timeStarted =  " from " . date ("F d Y H:i. e", filemtime($lastHk));
    $timeSinceLast = floor((time()-filemtime($lastHk)));
    $colourString = "class='lastBoxNew'";
    if ($timeSinceLast>$oldPoint) {$colourString = "class='lastBoxOld'";}
    else if ($timeSinceLast>$midPoint&&$timeSinceLast<$oldPoint){
    $colourString= "class='lastBoxMiddle'";}
    else {$colourString = "class='lastBoxNew'";}
  }
  else {
    $colourString = "class='lastBoxOld'";
  }


  echo "<a href=\"awareHk.php?instrument=ANITA4&hkType=$key\">";
  echo "<div ".$colourString."  >";
  echo "Last $value:";
  echo "<span id=\"lastHk\">";
  include $lastHk ;
  echo "</span>";
  echo $timeStarted;
  #echo " ".$timeSinceLast." ".$oldPoint." ".$midPoint." ";
  echo "</div>";
  echo "</a>";

}


?>




</div>
</div>

</body></html>
