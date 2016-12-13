<?php
require("jsonwrapper.php");


class mFile
{
    public $name, $time, $size;
}


function sort_by_mtime($a,$b)
{
  $t1 = filemtime($a);
  $t2 = filemtime($b);
  if ($t1 == $t2){
    return 0;
  } else {
    return ( $t1 > $t2 ) ? 1 : -1 ;
  }

}

$file_list=glob("output/ANITA4/cmdSend/palestine/*.json");

usort($file_list, "sort_by_mtime");

foreach ($file_list as $curFilename)
{
    $curFileObj = new mFile;
    $curFileObj->name = $curFilename;
    $curFileObj->time = date("d/m/Y - H:i", filectime($curFilename));
    $curFileObj->size = filesize($curFilename);
    $fileArray[] = $curFileObj;
}
printf("%s", json_encode($fileArray));
?> 
