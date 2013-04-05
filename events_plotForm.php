<?php


$event=$_GET["event"];
if($_GET["event"] === null) {
  $event=0;
 }
echo "<form name=\"eventForm\"   id=\"eventForm\" action=\"javascript:drawPlot(); javascript:void(0);\">";		

echo "Event: <input type=\"text\" name=\"eventInput\" id=\"eventInput\" value=\"$event\"  />";
echo '<br />';
echo '<button type="button" value="Previous" onclick="javascript:getPreviousEvent(drawPlot);">Previous</button>';
echo '<button type="button" value="Next" onclick="javascript:getNextEvent(drawPlot);">Next</button>';
echo '<br />';
echo "<input id='playButton' type='button' value='Play' onclick='javascript:playEvents();'>";
echo "<br />";
echo "Speed:<input id='speedSlide' type='range' value='10' min='1' max='100'>";
echo "<br />";
echo "</form>";

?>