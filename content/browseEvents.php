
<?php
function yearDirList() {
Print("<h2>Years </h2>\n");
// open this directory 
$myDirectory = opendir("output");
// get each entry
while($entryName = readdir($myDirectory)) {
	$dirArray[] = $entryName;
}

// close directory
closedir($myDirectory);

//	count elements in array
$indexCount	= count($dirArray);
//Print ("<p>$indexCount directories</p>\n");
$curURL=curPageURL();

for($index=0; $index < $indexCount; $index++) {
  if (substr("$dirArray[$index]", 0, 1) != "."){ // don't list hidden files
    Print("<p><a href=\"$curURL?year=$dirArray[$index]\">$dirArray[$index]</a></p>\n");
  }

 }
}


function dayDirList($yeardir) {
  Print("<h2>Dates in $yeardir</h2>\n");

  $myDirectory = opendir("output/$yeardir");
  // get each entry
  while($entryName = readdir($myDirectory)) {
    $dirArray[] = $entryName;
  }
  
// close directory
  closedir($myDirectory);
  
  sort($dirArray,SORT_NUMERIC);

//	count elements in array
  $indexCount	= count($dirArray);
  //Print ("<p>$indexCount directories</p>\n");
  $curURL=curPageURL();
  
  for($index=0; $index < $indexCount; $index++) {
    if (substr("$dirArray[$index]", 0, 1) != "."){ // don't list hidden files
      Print("<p><a href=\"$curURL&datecode=$dirArray[$index]\">$dirArray[$index]</a></p>\n");
    }
    
  }    
}


function runDirList($yeardir, $datedir) {
  Print("<h2>Runs in $yeardir-$datedir</h2>\n");

  $myDirectory = opendir("output/$yeardir/$datedir");
  // get each entry
  while($entryName = readdir($myDirectory)) {
    $dirArray[] = $entryName;
  }
  

  sort($dirArray,SORT_NUMERIC);

// close directory
  closedir($myDirectory);
  
//	count elements in array
  $indexCount	= count($dirArray);
  //Print ("<p>$indexCount directories</p>\n");
  $curURL=curPageURL();
  
  for($index=0; $index < $indexCount; $index++) {
    $run=substr($dirArray[$index],3);
    if (substr("$dirArray[$index]", 0, 1) != "."){ // don't list hidden files
      Print("<p><a href=\"$curURL&run=$run\">$run</a></p>\n");
    }
    
  }    
}



function eventDirList($run) {
  Print("<h2>Events in $run</h2>\n");
  
  $curURL=curPageURL();
  
  $eventList=getEventListArray($run);
  $indexCount	= count($eventList);

  echo "<form name=\"nav1\">";
  echo "<select name=\"SelectURL\" onChange=\"document.location.href=document.nav1.SelectURL.options[document.nav1.SelectURL.selectedIndex].value\">";
  echo "<OPTION VALUE=\".\"SELECTED>Events:";

  for($index=0; $index < $indexCount; $index++) {
    if (substr("$fileArray[$index]", 0, 1) != "."){ // don't list hidden files
      $event=$eventList[$index];
      Print("<option value=\"/~rjn/ara/aware/oneEvent.php?run=$run&event=$event\">$event</option>\n");
    }    
  }
  echo "</select>";
  echo "</form>";".\"SELECTED>Events:";

}





//Check if we are meant to look at as subdir or a list the subdirs
//printRunList();


$run=$_GET["run"];
if($_GET["run"] === null) {

  $year=$_GET["year"];
  $datecode=$_GET["datecode"];
  if($_GET["year"] === null) {
    yearDirList();
  }
  else if($_GET["datecode"] === null) {
    dayDirList($year);
  }
  else {
    runDirList($year,$datecode);
  }
 }
 else {
   eventDirList($run);
 }




?>