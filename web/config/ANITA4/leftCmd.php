
<div class="formDiv">
<?php
  //First up include the really static links
include("leftMain.php");
?>




<form class="cmdForm" id="cmdForm" action="">  
<fieldset>
<h4>Cmd Echo</h4>
<div class="ui-widget">
  <label for="cmdEchoGroundStart">Ground: </label> <br />
  <input type="number" id="cmdEchoGroundStart" min="0" max="100000">

  <input  type="number" min="0" max="100000" id="cmdEchoGroundEnd" disabled>
</div>
<div class="ui-widget">
  <label for="cmdEchoPayloadStart">Payload: </label> <br />
  <input type="number" id="cmdEchoPayloadStart" min="0" max="100000">
  <input  type="number" min="0" max="100000" id="cmdEchoPayloadEnd" disabled>
</div>
<h4>Cmd Sent</h4>
<div class="ui-widget">
  <label for="tdrssCmdSentStart">Palestine: </label> <br />
  <input type="number" id="tdrssCmdSentStart" min="0" max="100000">
  <input  type="number" min="0" max="100000" id="tdrssCmdSentEnd" disabled>
</div>
<div class="ui-widget">
  <label for="losCmdSentStart">LOS: </label> <br />
  <input type="number" id="losCmdSentStart" min="0" max="100000">
  <input  type="number" min="0" max="100000" id="losCmdSentEnd" disabled>
</div>
</fieldset>
</form>
