
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

echo "<ul>";
echo "<fieldset>";     
echo "<legend>Update Plot</legend>";
echo "<li>";
echo "<label>Run:</label>";
echo "<input type=\"number\" name=\"runInput\" id=\"runInput\" value=\"$run\" max=\"100000\" min=\"0\">";
echo "</fieldset>";
echo "</li>";
?>


<li>
<label>Show Events:</label> <br>
<form>
  <input type="radio" name="showRun" id="showRunYes" value="yes" checked> Yes<br>
  <input type="radio" name="showRun" id="showRunNo" value="no"> No<br>
</form> 
</li>

<li>

<label>Show Above Horizon:</label> <br>
<form>
  <input type="radio" name="showAbove" id="showAboveYes" value="yes" checked> Yes<br>
  <input type="radio" name="showAbove" id="showAboveNo" value="no"> No<br>
</form> 

</li>

</ul>
 <fieldset>
    <legend>Priorities: </legend>
    <label for="checkboxPri-1">1</label>
    <input type="checkbox" name="checkboxPri-1" id="checkboxPri-1" checked="checked">
    <label for="checkboxPri-2">2</label>
    <input type="checkbox" name="checkboxPri-2" id="checkboxPri-2" checked="checked">
    <label for="checkboxPri-3">3</label>
    <input type="checkbox" name="checkboxPri-3" id="checkboxPri-3" checked="checked">
    <label for="checkboxPri-4">4</label>
    <input type="checkbox" name="checkboxPri-4" id="checkboxPri-4" checked="checked">
    <label for="checkboxPri-5">5</label>
    <input type="checkbox" name="checkboxPri-5" id="checkboxPri-5">
    <label for="checkboxPri-6">6</label>
    <input type="checkbox" name="checkboxPri-6" id="checkboxPri-6">
    <label for="checkboxPri-7">7</label>
    <input type="checkbox" name="checkboxPri-7" id="checkboxPri-7">
    <label for="checkboxPri-8">8</label>
    <input type="checkbox" name="checkboxPri-8" id="checkboxPri-8">
    <label for="checkboxPri-9">9</label>
    <input type="checkbox" name="checkboxPri-9" id="checkboxPri-9">
  </fieldset>


