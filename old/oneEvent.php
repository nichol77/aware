<!DOCTYPE html>
<html>
    <head>
        <script src="mygraph.js"></script>
        <script src="aware.js"></script>
<?php

   include("/uhen/ara/monitor/styles.shtml");
   echo "<link rel=\"StyleSheet\" href=\"/uhen/ara/monitor/styles/base.css\" type=\"text/css\" media=\"screen\" />
<link rel=\"StyleSheet\" href=\"/uhen/ara/monitor/styles/default.css\" type=\"text/css\" media=\"screen\" title=\"RJN default\" />";


   echo "<TITLE>Event Page</TITLE>";
?>

    </head>
    <body onload="parseXmlEvent('foo.xml');  drawAllChannels(false,20,18,false);" onresize="drawAllChannels(false,16,18,false);">
   
<?php

require("utils.php");

   echo "<DIV class=\"heading\">"; 
   echo "<h1>Event Page</h1>";
   echo "</DIV>";
   echo "<DIV class=middle><DIV class=content>";



?>
    
      <canvas id="canTitle" width="90%" height="100%" style="background-color:#ffffff; resize:both;" >
	Unfortunately, your browser does not support the canvas tag
      </canvas>


      <table border="0">
   <tr>
<?php

for($i=0; $i<64; $i++) {
  if($i%8==0 )
    echo "<tr>";
  echo "<td>";
  echo "<a href=\"oneChannel.php?run=$run&event=$event&&chan=$i\">";
  echo "<canvas id=\"can$i\" width=\"5%\" style=\"background-color:#ffffff; resize:both;\" >";  
  echo "Unfortunately, your browser does not support the canvas tag";
  echo "</canvas>";
  echo "</a>";
  echo "</td>";

  if($i%8==7 )
    echo "</tr>";
}
?>
      </table>

<?php
   echo "</div></div>";

   include("left.php");

   echo "</body></html>";
?>
