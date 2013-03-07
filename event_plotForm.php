<?php


$run=$_GET["run"];
if($_GET["run"] === null) {
  $run=1999;
 }
echo "<form name=\"runForm\"   id=\"runForm\" action=\"javascript:drawPlot(); javascript:void(0);\">";		

echo "Event: <input type=\"text\" name=\"eventInput\" id=\"eventInput\" value=\"$event\"  />";
echo '<br />';
echo '<button type="button" value="Next" onclick="javascript:getPreviousEvent(drawPlot);">Previous</button>';
echo '<button type="button" value="Next" onclick="javascript:getNextEvent(drawPlot);">Next</button>';
echo "<br />";
echo "</form>";

?>