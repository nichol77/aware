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
<title>Event Housekeeping</title><META http-equiv="Content-Type" content="text/html; charset=ISO-8859-1"> 
<script type="text/javascript" src="src/awareUtils.js"></script>
<script type="text/javascript" src="src/awareHkTime.js"></script>
<script language="javascript" type="text/javascript" src="src/flot/jquery.min.js.gz"></script>
<script type="text/javascript" src="src/jquerytools/jquery.tools.min.js"></script>
<script language="javascript" type="text/javascript" src="src/flot/jquery.flot.min.js.gz"></script>
<script language="javascript" type="text/javascript" src="src/flot/jquery.flot.errorbars.min.js.gz"></script>
<script language="javascript" type="text/javascript" src="src/flot/jquery.flot.time.min.js.gz"></script>
<script language="javascript" type="text/javascript" src="src/flot/jquery.flot.canvas.min.js.gz"></script>
<script language="javascript" type="text/javascript" src="src/flot/jquery.flot.selection.min.js.gz"></script>
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
      var timeType='simple'; 
      if("timeType" in urlVars) {
	timeType=urlVars["timeType"];
      }

      var hkType='sensorHk';
      if($.urlParam('hkType')) {
	hkType=$.urlParam('hkType');
      }


      var instrument='STATION2';
      if("instrument" in urlVars) {
	instrument=urlVars["instrument"];
      }

      var run=2047;//Number($('#lastRun').text());
      var runAlreadySet=false;
      $('#lastRun').hide();
      if("run" in urlVars) {
	run=urlVars["run"];
	runAlreadySet=true;
      }

      var endrun=run;
      if("endrun" in urlVars) {
	endrun=urlVars["endrun"];
      }

      

      setHkTypeAndCanName(hkType,'divTime',timeType);

      var plotFormArray =[			  
	{sym:"singleChannelRate",desc:"L1 Rate",hkCode:"eventHk"},
	{sym:"singleChannelThreshold",desc:"L1 Threshold",hkCode:"eventHk"},
	{sym:"oneOfFour",desc:"L2 (1 of 4)",hkCode:"eventHk"},
	{sym:"twoOfFour",desc:"L2 (2 of 4)",hkCode:"eventHk"},
	{sym:"threeOfFour",desc:"L2 (3 of 4)",hkCode:"eventHk"},
	{sym:"threeOfEight",desc:"L3 (3 of 8)",hkCode:"eventHk"},
	{sym:"l4Scaler",desc:"L4",hkCode:"eventHk"},
	{sym:"vadj",desc:"V_adj",hkCode:"eventHk"},
	{sym:"vdly",desc:"V_dly",hkCode:"eventHk"},
	{sym:"wilkinsonC",desc:"Wilkinson",hkCode:"eventHk"},
	{sym:"pps",desc:"PPS",hkCode:"eventHk"},
	{sym:"clock",desc:"100MHz",hkCode:"eventHk"},
	{sym:"atriCurrent",desc:"ATRI Current",hkCode:"sensorHk"},
	{sym:"atriVoltage",desc:"ATRI Voltage",hkCode:"sensorHk"},
	{sym:"ddaCurrent",desc:"DDA Current",hkCode:"sensorHk"},
	{sym:"ddaVoltage",desc:"DDA Voltage",hkCode:"sensorHk"},
	{sym:"ddaTemp",desc:"DDA Temperature",hkCode:"sensorHk"},
	{sym:"tdaCurrent",desc:"TDA Current",hkCode:"sensorHk"},
	{sym:"tdaVoltage",desc:"TDA Voltage",hkCode:"sensorHk"},
	{sym:"tdaTemp",desc:"TDA Temperature",hkCode:"sensorHk"},
	{sym:"eventRate",desc:"Event Rate",hkCode:"header"},
	{sym:"rms",desc:"RMS",hkCode:"header"}];



      function fillPlotForm(array) {
	$('#plotForm').empty();
	for (i=0;i<array.length;i++){             
	  $('<option/>').val(array[i].sym).html(array[i].desc).appendTo('#plotForm');
	}
      }
      
      function updateHkType(thisHkType) {
	hkType=thisHkType;
	setHkTypeAndCanName(hkType,'divTime',timeType);
	var tempArray = $.grep( plotFormArray, function(elem){ return elem.hkCode  == thisHkType; });	   
	fillPlotForm(tempArray);
      }

      function updateLastRun() {
	var tempString="output/"+instrument+"/lastRun";
	if(hkType == "eventHk") 
	  var tempString="output/"+instrument+"/lastEventHk";
	if(hkType == "sensorHk")
	  var tempString="output/"+instrument+"/lastSensorHk";
	if(hkType == "header")
	  var tempString="output/"+instrument+"/lastEvent";

	function actuallyUpdateLastRun(runString) {
	  setStartRunOnForm(Number(runString));
	  setEndRunOnForm(Number(runString));
	  drawPlot();
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
	   drawPlot();
      });
      


      $('#plotForm').change(function() {
				  drawPlot();
				});				
      

      $('#instrumentForm').change(function() {
				    instrument=$(this).val();
				    runAlreadySet=false;
				    updateLastRun();
				  });				
      



    


      function drawLeftFormParts() {
	$('#endRunDiv').append("End Run<br />");
	$('#endRunDiv').append('<button type="button" value="Previous" onclick="javascript:getPreviousEndRun(drawPlot);">-</button>');
	$('#endRunDiv').append("<input type=\"text\" name=\"endRunInput\" id=\"endRunInput\" value=\"\" onchange=\"javascript:drawPlot();\"  />");
	$('#endRunDiv').append('<button type="button" value="Next" onclick="javascript:getNextEndRun(drawPlot);">+</button>');
	document.getElementById("endRunInput").value=(endrun);	

	$('#timeRangeDiv').append("Time Range:<br />");
	$('#timeRangeDiv').append("Start:<input type=\"date\" name=\"startDate\" id=\"startDate\" value=\"Date\";\"  /><br/>");
	//	$('#timeRangeDiv').append("<input type=\"time\" name=\"startTime\" id=\"startTime\" value=\"00:00\";\"  /><br/>");
	$('#timeRangeDiv').append("End:<input type=\"date\" name=\"endDate\" id=\"endDate\" value=\"Date\";\"  /><br/>");
//	$('#timeRangeDiv').append("<input type=\"time\" name=\"endTime\" id=\"endTime\" value=\"23:59\";\"  />");
	$('#timeRangeDiv').append('<button type="button" id=\"setRunRange\" value="Get Data">Run Range</button>');

      }

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


      drawLeftFormParts();
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

	//	$("#debugContainer").append(startDateRunListUrl);
//	$("#debugContainer").append(endDateRunListUrl);
	

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
      
      $('#fullMaxDiv').append("Max Plot Points:<br />");
      $('#fullMaxDiv').append("<input type=\"text\" name=\"fullMaxForm\" id=\"fullMaxForm\" value=\"100\" onchange=\"javascript:drawPlot();\"  />");
     

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

      if(!runAlreadySet) updateLastRun();
      updateHkType(hkType);

      drawPlot();
  });  

</script>
</head>



<body>


<DIV class="heading">
<h1>Event Housekeeping</h1>
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

<p id="choices" style=""></p>
</div>


</div></div>

<div class="vertical" id="leftbar">
<?php
include("leftHk.php");
?>
</div>
</body></html>

