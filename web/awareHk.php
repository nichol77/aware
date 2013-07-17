<? 
ob_start("ob_gzhandler"); 
header("Connection: keep-alive");
?>
<!DOCTYPE html>
<html>
<head>
<link rel="StyleSheet" href="styles/aware.css" type="text/css" media="screen">
<link rel="StyleSheet" href="styles/base.css.gz" type="text/css" media="screen">
<link rel="StyleSheet" href="styles/help.css" type="text/css" media="screen" >
<link rel="StyleSheet" href="styles/calendar.css" type="text/css" media="screen">
<link rel="StyleSheet" href="styles/default.css.gz" type="text/css" media="screen" title="RJN default">
<title>AWARE Housekeeping</title><META http-equiv="Content-Type" content="text/html; charset=utf-8"> 
<script type="text/javascript" src="src/awareUtils.js"></script>
<script type="text/javascript" src="src/awareHkTime.js"></script>
<script type="text/javascript" src="src/flot/jquery.min.js.gz"></script>
<script type="text/javascript" src="src/jquerytools/jquery.tools.min.js"></script>
<script type="text/javascript" src="src/flot/jquery.flot.min.js.gz"></script>
<script type="text/javascript" src="src/flot/jquery.flot.errorbars.min.js.gz"></script>
<script type="text/javascript" src="src/flot/jquery.flot.time.min.js.gz"></script>
<script type="text/javascript" src="src/flot/jquery.flot.canvas.min.js.gz"></script>
<script type="text/javascript" src="src/flot/jquery.flot.selection.min.js.gz"></script>
<script type="text/javascript">

  $(function() {

      $.urlParam = function(name){
	var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
	if(results != null) {
	  return results[1];
	}
	return null;
      }


      var urlVars=getUrlVars();

      
      var timeType=document.getElementById("timeForm").value;
      if("timeType" in urlVars) {
	timeType=urlVars["timeType"];
      }

      var hkType=document.getElementById("hkTypeForm").value;
      if($.urlParam('hkType')) {
	hkType=$.urlParam('hkType');
      }


      var instrument=document.getElementById("instrumentForm").value;
      if("instrument" in urlVars) {
	instrument=urlVars["instrument"];
      }

      var run=document.getElementById("runForm").value;
      var runAlreadySet=false;
      if("run" in urlVars) {
	run=urlVars["run"];
	runAlreadySet=true;
      }

      var endrun=run;
      if("endrun" in urlVars) {
	endrun=urlVars["endrun"];
      }

      updateLastRun(false);
      

      setHkTypeAndCanName(hkType,'divTime',timeType);


      ///Here is the logic for delaying with the scale buttons
      $('#scaleDiv').toggle();

      $('#showScaleButton').click( function() {
				     $('#scaleDiv').toggle();
				   });
      $('#yAutoScale').change(function() {
				if($(this).checked) {
				  //Switching to autoscale
				  $('#yMinInput').prop('disabled',true);
				  $('#yMaxInput').prop('disabled',true);
				}
				else {
				  //Switching to fixed scale
				  $('#yMinInput').removeAttr('disabled');
				  $('#yMaxInput').removeAttr('disabled');
				}
			      });


      $('#xAutoScale').change(function() {
				if($(this).checked) {
				  //Switching to autoscale
				  $('#xMinDateInput').prop('disabled',true);
				  $('#xMaxDateInput').prop('disabled',true);
				  $('#xMinTimeInput').prop('disabled',true);
				  $('#xMaxTimeInput').prop('disabled',true);
				}
				else {
				  //Switching to fixed scale
				  $('#xMinDateInput').removeAttr('disabled');
				  $('#xMaxDateInput').removeAttr('disabled');
				  $('#xMinTimeInput').removeAttr('disabled');
				  $('#xMaxTimeInput').removeAttr('disabled');
				}
			      });
      
      $('#refreshButton').click(function() {
				  drawPlot();
				});


      $('#runInput').change(function() {			      
			      //When run input changes we can update end run
			      if(document.getElementById("runInput").value>=
				 document.getElementById("endRunInput").value) {
				document.getElementById("endRunInput").value=
				  document.getElementById("runInput").value;
			      }
			      //And set the minimum for endRunInput to the start run
			      document.getElementById("endRunInput").min=
				document.getElementById("runInput").value;
			    });
				



      function fillPlotForm(array) {
	$('#plotForm').empty();
	for (i=0;i<array.length;i++){             
	  $('<option/>').val(array[i].sym).html(array[i].desc).appendTo('#plotForm');
	}
      }
      
      function updateHkType(thisHkType) {
	hkType=thisHkType;
	setHkTypeAndCanName(hkType,'divTime',timeType);
	
	function actuallyUpdateHkType(plotFormArray) {
	  var tempArray = $.grep( plotFormArray, function(elem){ return elem.hkCode  == thisHkType; });	   
	  fillPlotForm(tempArray);
	  drawPlot();	   
	}
	

	$.ajax({
	  url: "config/plotTypeList.json",
	      type: "GET",
	      dataType: "json", 
	      success: actuallyUpdateHkType
	      }); 

      }

      function updateLastRun(setStartToLast) {
	//	var tempString="output/"+instrument+"/lastRun";
	var tempString="output/"+instrument+"/last"+capitaliseFirstLetter(hkType);


	function actuallyUpdateLastRun(runString) {
	  setLastRun(Number(runString));
	  if(setStartToLast) {
	    setStartRunOnForm(Number(runString));
	    setEndRunOnForm(Number(runString));
	    drawPlot();
	  }
	}


	$.ajax({
	  url: tempString,
	      type: "GET",
	      dataType: "text", 
	      success: actuallyUpdateLastRun
	      }); 
	
      }

      $('#hkTypeForm').change(function() {
	   var selectedValue = $(this).val();
	   updateHkType(selectedValue);
      });
      


      $('#plotForm').change(function() {
				  drawPlot();
				});				
      

      $('#instrumentForm').change(function() {
				    instrument=$(this).val();
				    runAlreadySet=false;
				    updateLastRun(true);
				  });				
        

      $('#timeForm').change(function() {			      
	   timeType = $(this).val();
	   if(timeType == "timeRange") {
	     $('#endRunDiv').show();
	     $('#timeRangeDiv').show();	     
	   }
	   else if(timeType == "multiRun") {
	     $('#endRunDiv').show();
	     $('#fullMaxDiv').show();
	     $('#timeRangeDiv').hide();
	   }
	   else {
	     $('#endRunDiv').hide();
	     if(timeType == "full") {
	       $('#fullMaxDiv').show();
	       $('#timeRangeDiv').hide();
	     }
	     else {
	       $('#fullMaxDiv').show();
	       $('#timeRangeDiv').hide();
	     }
	       
	   }


	   setHkTypeAndCanName(hkType,'divTime',timeType);
	   drawPlot();
			    });

      setEndRunOnForm(endrun);


      $('#setRunRange').bind('click', function() {

	var startDate=document.getElementById("startDate").value;
	var startYear=startDate.split("/")[0];
	var startMonth=startDate.split("/")[1];
	var startDay=startDate.split("/")[2];
	var startDatecode=startMonth+startDay;
	var startDateRunListUrl=getDateRunListName(instrument,startYear,startDatecode);

	var endDate=document.getElementById("endDate").value;
	var endYear=endDate.split("/")[0];
	var endMonth=endDate.split("/")[1];
	var endDay=endDate.split("/")[2];
	var endDatecode=endMonth+endDay;
	var endDateRunListUrl=getDateRunListName(instrument,endYear,endDatecode);


	var numGot=0;
	function handleStartDateRunList(jsonObject) {
	  for(var i=0;i<jsonObject.runList.length;i++) {
	    var thisRun=jsonObject.runList[i];
	    setStartRunOnForm(Number(thisRun));	    
	    break;
	  }
	  numGot++;
	  if(numGot==2) drawPlot();
	}

	function handleEndDateRunList(jsonObject) {
	  for(var i=0;i<jsonObject.runList.length;i++) {
	    var thisRun=jsonObject.runList[i];
	    setEndRunOnForm(Number(thisRun));	    
	  }
	  numGot++;
	  if(numGot==2) drawPlot();
	}
	
	function handleFailure() {
	  numGot++;
	  if(numGot==2) drawPlot();
	}
	   	   
	
	$.ajax({
	  url: startDateRunListUrl,
	      type: "GET",
	      dataType: "json",
	      success: handleStartDateRunList,
	      error: handleFailure
	      });
	
	$.ajax({
	  url: endDateRunListUrl,
	      type: "GET",
	      dataType: "json",
	      success: handleEndDateRunList,
	      error: handleFailure
	      });
	
	
	
			     });


      $('#endRunDiv').hide();
      $('#timeRangeDiv').hide();
      
     

      $(":date").dateinput({ trigger: true, format: 'yyyy/mm/dd', max: -1 })
	
	// use the same callback for two different events. possible with bind
	$(":date").bind("onShow onHide", function()  {
			  $(this).parent().toggleClass("active");
			});
      
      // when first date input is changed
      $(":date:first").data("dateinput").change(function() {
						  // we use it's value for the seconds input min option
						  $(":date:last").data("dateinput").setMin(this.getValue(), true);
						});


      // when first date input is changed
      $(":date:last").data("dateinput").change(function() {
						  // we use it's value for the seconds input min option
						  $(":date:first").data("dateinput").setMax(this.getValue(), true);
						});
      

      

      $('#fullMaxDiv').show();
      if(timeType == "multiRun")
	$('#endRunDiv').show();
      if(timeType == "timeRange") {
	$('#endRunDiv').show();
	$('#timeRangeDiv').show();	  
      }

      updateHkType(hkType);
      if(!runAlreadySet) updateLastRun(true);


      //      drawPlot();
  });  

</script>
</head>



<body>


<DIV class="heading">
<h1>AWARE Housekeeping</h1>
</DIV>
<DIV class=middle>
<DIV class=content>

<div id="debugContainer"></div>
<div id="titleContainer"></div>
<div id="divTime" style="width:90%; height:50%; padding: 0px; float : left;"></div>
<div id="divLabel" style="width:10%; height:50%; padding: 0px; float : right;"></div>
<p>
  Click and drag on the background to zoom, double click to unzoom.
</p>
<div>
<p id="choices" style=""></p>
</div>


</div></div>

<div class="vertical" id="leftbar">
<?php
include("leftHk.php");
?>
</div>



<div id="openTimeTypeHelp" class="helpDialog">
  <div>
<a href="#close" title="Close" class="close">X</a>
<?php
include "help/timeTypeHelp.php";
?>
</div>
</div>


<div id="openStationHelp" class="helpDialog">
  <div>
<a href="#close" title="Close" class="close">X</a>
<?php
include "help/stationHelp.php";
?>
</div>
</div>



<div id="openHkTypeHelp" class="helpDialog">
  <div>
<a href="#close" title="Close" class="close">X</a>
<?php
include "help/hkTypeHelp.php";
?>
</div>
</div>

</body></html>

