<?php
require("utils.php");
$contentPage=basename($_SERVER['PHP_SELF'], ".php");
doPage("content/$contentPage.php","Browse Events","Browse Events");
//doPage("content/browseEvents.php");
?>