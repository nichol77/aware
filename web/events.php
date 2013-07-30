<? 
ob_start("ob_gzhandler"); 
header("Connection: keep-alive");
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
"http://www.w3.org/TR/html4/strict.dtd"> 
<html>
<head>
<meta name="viewport" 
  content="width=device-width, initial-scale=1.0, user-scalable=no">
<link rel="StyleSheet" href="styles/base.css" type="text/css" media="screen" />
<link rel="StyleSheet" href="styles/aware.css" type="text/css" media="screen" />
<link rel="StyleSheet" href="styles/ara.css" type="text/css" media="screen" />

<title>AWARE Events</title><META http-equiv="Content-Type" content="text/html; charset=ISO-8859-1"> 
<script src="src/awareUtils.js"></script>
<script src="src/awareEvent.js"></script>
<script language="javascript" type="text/javascript" src="src/flot/jquery.min.js.gz"></script>
<script language="javascript" type="text/javascript" src="src/flot/examples/shared/jquery-ui/jquery-ui.min.js.gz"></script>
<script language="javascript" type="text/javascript" src="src/flot/jquery.flot.min.js.gz"></script>
<script language="javascript" type="text/javascript" src="src/flot/jquery.flot.errorbars.min.js.gz"></script>
<script language="javascript" type="text/javascript" src="src/flot/jquery.flot.time.min.js.gz"></script>
<script language="javascript" type="text/javascript" src="src/flot/jquery.flot.selection.min.js.gz"></script>
<script language="javascript" type="text/javascript" src="src/flot/jquery.flot.resize.js.gz"></script>
<script language="javascript" type="text/javascript" src="src/fft.js"></script>

<script type="text/javascript">

  $(function() {



      function updateLastRun(setStartToLast) {
	var tempString="output/"+getInstrumentNameFromForm()+"/lastEvent";
	
	function actuallyUpdateLastRun(runString) {
	  setLastRun(Number(runString));
	  if(setStartToLast) {
	    setRunOnForm(Number(runString));
	    readEventLayout();
	  }
	}
	
	if(setStartToLast) {
	  $('#titleContainer').empty();
	  $('#titleContainer').append("<h2>Fetching most recent run</h2>");

	}
	

	$.ajax({
	  url: tempString,
	      type: "GET",
	      dataType: "text", 
	      success: actuallyUpdateLastRun
	      }); 
	
      }

      $.urlParam = function(name){
	var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
	if(results != null) {
	  return results[1];
	}
	return null;
      }

  
      function readEventLayout() {	
	function actuallyReadEventLayout(jsonObject) {
	  setupEventDisplay(jsonObject);
	  drawPlot();
	  
	}	
	eventLayout=getLayoutFromForm();
	
	$.ajax({
	    //url: "config/eventLayout5by4.json",
	  url: "config/"+eventLayout+".json",
	      type: "GET",
	      dataType: "json", 
	      success: actuallyReadEventLayout
	      }); 
      }

      
      //This is something to do with the touch interface
      document.body.addEventListener('touchmove', function(event) {
				       event.preventDefault();
				     }, false);   
      
      
      run=document.getElementById("runForm").value;
      var runAlreadySet=false;
      if($.urlParam('run')) {
	run=$.urlParam('run');
	runAlreadySet=true;
      }


      if(!runAlreadySet) {
	updateLastRun(true);
      }
      else {
	readEventLayout();
      }




      $('#instrumentForm').change(function() {
				    setEventIndexOnForm(0);
				    runAlreadySet=false;
				    updateLastRun(true);
				    readEventLayout();
				  });


      $('#layoutForm').change(function() {
				readEventLayout();
			      });

      $('#waveformForm').change(function() {
				  drawPlot();
			      });

      $('#eventIndexInput').change(function() {
				     drawPlot();
				   });

      $('#eventNumberInput').change(function() {
				      getEventIndexFromNumber(drawPlot);
				   });
      $('#debugContainer').hide();



      $('#includeCables').change(function() {
				   drawPlot();
				 });

      $('#xAutoScale').change(function() {
				if($(this).attr('checked')) {
				  //Switching to autoscale
				  $('#xMinInput').attr('disabled','disabled');
				  $('#xMaxInput').attr('disabled','disabled');
				}
				else {
				  //Switching to fixed scale
				  $('#xMinInput').removeAttr('disabled');
				  $('#xMaxInput').removeAttr('disabled');
				}
			      });


      $('#refreshButton').click(function() {
				  drawPlot();
				});


});  

</script>
</head>



<body>


<DIV class="heading">
<h1>AWARE Event Display</h1>
</DIV>
<DIV class=middle>
<DIV class=content>
<div id="titleContainer"></div>
<div id="divEvent" style="width:100%; height:85%; padding: 0px; float : left;"></div>
<div id="debugContainer"></div>


</div></div>

<div class="vertical" id="leftbar">
<?php
include("leftEvent.php");
?>
</div>
</body></html>

