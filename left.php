<div class="vertical">
<?php
virtual("/uhen/ara/monitor/leftMain.shtml");
?>
<!--#include virtual="/uhen/ara/monitor/leftMain.shtml" -->
<!--#include virtual="/uhen/ara/monitor/leftTimes.shtml" -->
<h2 class="navigation">Update Run</h2>
<?php
$contentPage=basename($_SERVER['PHP_SELF'], ".php");
echo  "<form action=\"$contentPage\" method=\"get\">";
echo  "Run: <input type=\"text\" name=\"run\" value=\"$run\" /><br />";
echo  "<button type=\"Go To\" value=\"Go To\">Go To</button>";
echo  "</form>";
?>
</p>

