<? 
ob_start("ob_gzhandler"); 
header("Connection: keep-alive");
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
"http://www.w3.org/TR/html4/strict.dtd"> 
<html>
<head>
<link rel="StyleSheet" href="styles/base.css.gz" type="text/css" media="screen" />
<link rel="StyleSheet" href="styles/help.css" type="text/css" media="screen" />
<link rel="StyleSheet" href="styles/calendar.css" type="text/css" media="screen" />
<link rel="StyleSheet" href="styles/default.css.gz" type="text/css" media="screen" title="RJN default" />
<title>Date View</title><META http-equiv="Content-Type" content="text/html; charset=ISO-8859-1"> 

<script type="text/javascript" src="src/awareUtils.js.gz"></script>
<script type="text/javascript" src="src/awareHkTime.js.gz"></script>
<script language="javascript" type="text/javascript" src="src/flot/jquery.min.js.gz"></script>

<script type="text/javascript" src="src/jquerytools/jquery.tools.min.js"></script>

<script type="text/javascript">
 $(function() {

     $.urlParam = function(name){
       var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
       if(results != null) {
	 return results[1];
       }
       return null;
     }
     
     
     var instrument='STATION2';
     if($.urlParam('instrument')) {
       instrument=$.urlParam('instrument');
     }
     
     $('#titleContainer').append("<H1>"+instrument+"</H1>");

     // initialize dateinput
     $(":date").dateinput( {
 
	 // closing is not possible
       onHide: function()  {
	   return false;
	 },
	   
	   // when date changes update the day display
	   change: function(e, date)  {
	   var year=this.getValue("yyyy");
	   var datecode=this.getValue("mdd");

	   var dateRunListUrl=getDateRunListName(instrument,year,datecode);
	   

	   function handleDateRunList(jsonObject) {
	     $("#runList").empty();
	     $("#runList").append("<H2>Run List</H2><br>");
	     $("#runList").append("<ul>");
	     for(var i=0;i<jsonObject.runList.length;i++) {
	       var thisRun=jsonObject.runList[i];
	       $("#runList").append("<li>"+thisRun+" <a href=\"awareHk.php?run="+thisRun+"&instrument="+instrument+"\">Housekeeping</a></li>");
	     }
	   }
	   
	   function handleFailure(jqXHR, exception) {
	     $("#runList").empty();
 
	     if (jqXHR.status === 0) {
	       $("#runList").append('Not connect.\n Verify Network.');
	     } else if (jqXHR.status == 404) {
	       $("#runList").append("No runs for this date. Well no runs in the AWARE database at least");
	     } else if (jqXHR.status == 500) {
	       $("#runList").append('Internal Server Error [500].');
	     } else if (exception === 'parsererror') {
	       $("#runList").append('Requested JSON parse failed.');
	     } else if (exception === 'timeout') {
	       $("#runList").append('Time out error.');
	     } else if (exception === 'abort') {
	       $("#runList").append('Ajax request aborted.');
	     } else {
	       $("#runList").append('Uncaught Error.\n' + jqXHR.responseText);
	     }

	   }
	   


	   $.ajax({
	     url: dateRunListUrl,
		 type: "GET",
		 dataType: "json",
		 success: handleDateRunList,
		 error: handleFailure
		 });
	   
	   

	 }
	 
	 // set initial value and show dateinput when page loads
       }).data("dateinput").setValue(0).show();         
   });

</script>
 
</head>



<body>

<DIV class="heading">
<h1>Date View</h1>
</DIV>
<DIV class=middle>
<DIV class=content>

<div id="debugContainer"></div>
<div id="titleContainer"></div>

<!-- wrapper element -->
<div id="calendar">
  <input type="date" name="mydate" value="0" />
</div>
 
<div id="runList"></div>


</div></div></div>

<div class="vertical" id="leftbar">
<?php
include("leftDate.php");
?>
</div>
</body></html>

