
<div class="formDiv">
<?php
  //First up include the really static links
include("leftMain.php");
?>



<form class="runForm" id="runForm" action="">  

<?php

$run=$_GET["run"];
if($_GET["run"] === null) {
  $run=117; //This number is never really used
 }

echo "<fieldset>";     
echo "<legend>Update Plot</legend>";
echo "<ul>";
echo "<li>";
echo "<label>Run:</label>";
echo "<input type=\"number\" name=\"runInput\" id=\"runInput\" value=\"$run\" max=\"100000\" min=\"0\">";
echo "</li>";
echo "</ul>";
echo "</fieldset>";
?>	
