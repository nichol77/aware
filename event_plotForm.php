<?php


$event=$_GET["event"];
if($_GET["event"] === null) {
  $event=1999;
 }
echo "<form name=\"eventForm\"   id=\"eventForm\" action=\"javascript:drawPlot(); javascript:void(0);\">";		

echo "Event: <input type=\"text\" name=\"eventInput\" id=\"eventInput\" value=\"$event\"  />";
echo '<br />';
echo '<button type="button" value="Next" onclick="javascript:getPreviousEvent(drawPlot);">Previous</button>';
echo '<button type="button" value="Next" onclick="javascript:getNextEvent(drawPlot);">Next</button>';
echo "<br />";
echo "</form>";

?>