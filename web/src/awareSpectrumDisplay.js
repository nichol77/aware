/**
 * A simple javascript module for displaying waveform event data using png files generated by SpectrumDisplay
 * @file awareSpectrumDisplay.js
 * @author Ryan Nichol <r.nichol@ucl.ac.uk>
 * @author Chris Davenport
 */




/**
 * The AwareSpectrum namespace
 * @namespace
 */
var AwareSpectrum = {};




/**
 * The UI interface function that gets the run from the runInput form.
 * @returns {number}
 */
function getRunFromForm() {
    return document.getElementById("runInput").value;
} 

/**
 * The UI interface function that sets the run on the runInput form.
 */
function setRunOnForm(thisRun) {
    document.getElementById("runInput").value=thisRun;
} 


/**
 * The UI interface function that sets the maximum run on the runInput form.
 */
function setLastRun(thisRun) {
    document.getElementById("runInput").max=thisRun;
} 


function getEventNumberFromForm() {
    return document.getElementById("eventNumberAuto").value;
}


function getEventPngName() {
    return AwareSpectrum.pngList[AwareSpectrum.eventIndex];
    //    return document.getElementById("eventNumberForm").value;
    //    return sessionStorage.getItem(getEventNumberFromForm());
}



/**
 * The UI interface function that gets the next event and then executes nextFunction, which is typically to draw the event
 */
function getNextEvent(nextFunction) {
    if(AwareSpectrum.eventIndex<AwareSpectrum.eventList.length-1) AwareSpectrum.eventIndex++;
    $('#eventIndex').val(AwareSpectrum.eventIndex);
    $('#eventNumberAuto').val(AwareSpectrum.eventList[AwareSpectrum.eventIndex]);
    nextFunction();
}


/**
 * The UI interface function that gets the previous event and then executes nextFunction, which is typically to draw the event
 */
function getPreviousEvent(nextFunction) {
    if(AwareSpectrum.eventIndex>0) AwareSpectrum.eventIndex--;
    $('#eventIndex').val(AwareSpectrum.eventIndex);
    $('#eventNumberAuto').val(AwareSpectrum.eventList[AwareSpectrum.eventIndex]);
    nextFunction();
}


/**
 * The UI interface function that is executed when the play button is pressed. The code executes getNextEvent at am interval specified by the speedSlide form.
 */
function playEvents() {
   if(document.getElementById("playButton").value=='Play') {
      document.getElementById("playButton").value='Stop';
      var playInt=document.getElementById("speedSlide").value;
      AwareSpectrum.playVar=setInterval(function(){getNextEvent(plotEvent())},(10000/playInt));
   }
   else {
      document.getElementById("playButton").value='Play';
      clearInterval(AwareSpectrum.playVar);
   }
}





/**
 * The function that updates both the plot title and the URL in the lcoation bar, to ensure if reload is hit that same event display is returned. This works at some level but does not remember things like the xAutoScale
 */
function updatePlotTitle(jsonObject) {
    //Also update the page URL
    var currentUrl = [location.protocol, '//', location.host, location.pathname].join('');
    //    var currentUrl = window.location.href;
    currentUrl=currentUrl+"?run="+getRunFromForm()+"&instrument="+getInstrumentNameFromForm()+"&eventNumber="+getEventNumberFromForm();
    var stateObj = { foo: "bar" };
    history.replaceState(stateObj, "page 2", currentUrl);

    var titleContainer = $("#titleContainer"); 
    titleContainer.empty();
    
}


/**
* The function that is actually called to plot the event
*/
function plotEvent() {
    titleContainer=$("#titleContainer");
    titleContainer.empty();
    //    $("#debugContainer").append("<p>getEventNumberFromForm: "+getEventNumberFromForm()+"</p>");
    //    $("#debugContainer").append("<p>"+AwareSpectrum.eventIndex+" "+AwareSpectrum.pngList.length+"</p>");
    //    $("#debugContainer").append("<p>getEventPngName: "+getEventPngName()+"</p>");
    $("#divEvent").empty();
    $("#divEvent").append("<a target=\"_zoom\" href=\""+getEventPngName()+"\"><img class=\"spectrumDisplay\" src=\""+getEventPngName()+"\"></a>");
    //    $("#img").attr("src", getEventPngName());
    $("#loader").css("visibility","hidden");


}

function updateEventList(plotLastEvent) {
    
    //    $("#debugContainer").append("<p>updateEventList</p>");

    if(!plotLastEvent) {
	var lastIndex=0;
    	var lastEvent= $('#eventNumberAuto').val();
    }
    else {	  
	$("#loader").css("visibility","visible");
    }
    //    $('#eventNumberForm').empty();
    //    sessionStorage.clear();
    function handleEventNumberList(eventNumberArray) {
	AwareSpectrum.eventList = new Array();
	AwareSpectrum.pngList = new Array();
	//	AwareSpectrum.eventKey = new Object();


        var pngName="";
	var eventName="";
	if($('#debugContainer').is(":visible")) {
	    $("#debugContainer").append("<p>Num events:"+eventNumberArray.length+"</p>");
	}
	for(var i=0;i<eventNumberArray.length;i++) {
	//	for(var i=0;i<1000;i++) {
            pngName=eventNumberArray[i].name;
            eventName=eventNumberArray[i].event;
	    AwareSpectrum.eventList.push(eventName);
	    AwareSpectrum.pngList.push(pngName);
	    AwareSpectrum.eventIndex=i;
	    //            $('<option/>').val(pngName).html(eventName).appendTo('#eventNumberForm');
	    //	    sessionStorage.setItem(eventName,pngName);
        }
	// Set maximum for eventIndex
	document.getElementById("eventIndex").max=AwareSpectrum.eventIndex;
	document.getElementById("maxEventIndex").value=AwareSpectrum.eventIndex;
	

	$( "#eventNumberAuto" ).autocomplete({
		source: AwareSpectrum.eventList,
		close: function() {

		    AwareSpectrum.eventIndex=AwareSpectrum.eventList.indexOf($("#eventNumberAuto").val());
		    $('#eventIndex').val(AwareSpectrum.eventIndex);
		    plotEvent();
		}});
		


	if(plotLastEvent) {
	    $('#eventIndex').val(AwareSpectrum.eventIndex);
	    $('#eventNumberAuto').val(eventName);
	    plotEvent();
	}
	else {
	    $('#eventNumberAuto').val(lastEvent);
	    AwareSpectrum.eventIndex=AwareSpectrum.eventList.indexOf($("#eventNumberAuto").val());
	    $('#eventIndex').val(AwareSpectrum.eventIndex);

	}
    }
    
    eventNumberUrl="pngCrawler.php?gpu&run="+getStartRunFromForm();
    
    
    ajaxLoadingLog(eventNumberUrl);
    $.ajax({
            url: eventNumberUrl,
		type: "GET",
		dataType: "json",
		success: handleEventNumberList,
		error: handleAjaxError
		});   
}



function initialiseAwareSpectrumDisplay() {


      var docHeight=$(window).height();
      var docWidth=$(window).width();
      var heightPercentage=100;
      if(docWidth>=800) heightPercentage=100;

      var maxPlotHeight=Math.round((heightPercentage*docHeight)/100);
      $('#divEvent').height(maxPlotHeight); 


      function updateLastRun(setStartToLast) {
	var tempString="output/"+getInstrumentNameFromForm()+"/lastGpuPowerSpectra";
	
	function actuallyUpdateLastRun(runString) {
	    setRunOnForm(Number(runString));
	    updateEventList(true);	  
	}

	  $('#titleContainer').empty();
	  $('#titleContainer').append("<h2>Fetching most recent run</h2>");
	

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




      $('#instrumentForm').change(function() {
				    runAlreadySet=false;
				    updateLastRun(true);
				  });


      $("#eventIndex").change(function() {
	      AwareSpectrum.eventIndex=$(this).val();
	      //	      $("#debugContainer").append("<p>Got event index "+AwareSpectrum.eventIndex+"</p>");
	      $("#eventNumberAuto").val(AwareSpectrum.eventList[AwareSpectrum.eventIndex]);
	      plotEvent();

	  });


      $('#runInput').change(function() {
	      updateEventList(true);
	  });
    

      $('#debugContainer').hide();
      $('#instrumentDiv').hide();

    $(document).ready(function () {var timer = setInterval(runRefresher,30000)});

}

function runRefresher(){
    updateEventList(false)
}
