
<div class="formDiv">
<?php
  //First up include the really static links
include("leftMain.php");
?>




<form class="cmdForm" id="cmdForm" action="">  
<fieldset>
<h4>Cmd Echo</h4>
<div class="ui-widget">
  <label for="groundCmdSentStart">Ground: </label>
  <input type="number" id="groundCmdStart" min="0" max="100000">
  <input  type="number" min="0" max="100000" id="groundCmdSentEnd" disabled>
</div>
<div class="ui-widget">
  <label for="payloadCmdSentStart">Payload: </label>
  <input type="number" id="payloadCmdStart" min="0" max="100000">
  <input  type="number" min="0" max="100000" id="payloadCmdSentEnd" disabled>
</div>
<h4>Cmd Sent</h4>
<div class="ui-widget">
  <label for="tdrssCmdSentStart">Palestine: </label>
  <input type="number" id="tdrssCmdStart" min="0" max="100000">
  <input  type="number" min="0" max="100000" id="tdrssCmdSentEnd" disabled>
</div>
<div class="ui-widget">
  <label for="losCmdSentStart">LOS: </label>
  <input type="number" id="losCmdStart" min="0" max="100000">
  <input  type="number" min="0" max="100000" id="losCmdSentEnd" disabled>
</div>
</fieldset>