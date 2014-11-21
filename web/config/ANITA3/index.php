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
<?php 


// Events are considered fresh untill an hour old (green)
// then they mid aged (orange) then after the old point (red)
$oldPoint = 86400; //In seconds 86400 is 24 hours
$midPoint = 3600;  //One hour

$lastEvent='output/ANITA3/lastEvent';

  if (file_exists($lastEvent)) {
    $timeStarted =  " started " . date ("F d Y H:i.", filemtime($lastEvent));
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

$hkType_array = parse_ini_file("config/ANITA3/hkTypeList.ini", true);

foreach($hkType_array as $inst => $properties){
  $key=$properties[name];
  $Key= ucfirst($key);
  $value=$properties[title];
  # echo "$key";
  $lastHk="output/ANITA3/last$Key";
if (file_exists($lastHk)) {
    $timeStarted =  " started " . date ("F d Y H:i.", filemtime($lastHk));
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


  echo "<a href=\"awareHk.php?instrument=ANITA3&hkType=$key\">";
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
