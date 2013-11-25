
/**
 * Generic useful functions for the AWARE web plotting library 
 * @file awareUtils.js
 * @author Ryan Nichol <r.nichol@ucl.ac.uk>
 */




/**
 * The AwareUtils namespace
 * @namespace
 */
var AwareUtils = {};// new Object();


/**
* Utility function that capitalises the first letter of the string
 * @param string {String}
 * @returns {String}
*/
function capitaliseFirstLetter(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}


/**
* Utility function that zero pads a number to four digits, eg. 777 -> 0777
 * @param number {Number}
 * @returns {String}
*/
function pad4(number) {
   
     return (number < 1000 ? '0' : '') + number
   
}


/**
* Utility function that zero pads a number to two digits, eg. 7 -> 07
* @param number {Number}
* @returns {String}
*/
function pad2(number) {
   
     return (number < 10 ? '0' : '') + number
   
}


/**
* Utility function that return an object of the URL Variables
* @returns {Object}
*/
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
						 vars[key] = value;
					     });
    return vars;
}


/**
* Utility function that returns the name of the run list JSON file
* @returns {String}
*/
function getRunListName(instrument, run) {
    var run1000=run - (run%1000);
    var name="output/"+instrument+"/runList"+run1000+".json";
    return name;
}


/**
* Utility function that returns the name of the summary hk JSON file
* @returns {String}
*/
function getHkName(instrument, run, year, datecode, hkType) {
    var name="output/"+instrument+"/"+year+"/"+pad4(parseInt(datecode))+"/run"+run+"/"+hkType+"Summary.json.gz"; 
    return name;
}


/**
* Utility function that returns the name of the hk time JSON file
* @returns {String}
*/
function getHkTimeName(instrument, run, year, datecode,hkType) {
    var name="output/"+instrument+"/"+year+"/"+pad4(parseInt(datecode))+"/run"+run+"/"+hkType+"Time.json.gz"; 
    return name;
}


/**
* Utility function that returns the name of the full hk JSON file
* @returns {String}
*/
function getFullHkName(instrument,run,year,datecode,hkFile,hkType) {
    var name="output/"+instrument+"/"+year+"/"+pad4(parseInt(datecode))+"/run"+run+"/full/"+hkType+"_"+hkFile+".json.gz"; 
    return name;
}


/**
* Utility function that returns the name of the full hk time JSON file
* @returns {String}
*/
function getFullHkTimeName(instrument,run,year,datecode,hkType) {
    var name="output/"+instrument+"/"+year+"/"+pad4(parseInt(datecode))+"/run"+run+"/full/"+hkType+"_time.json.gz"; 
    return name;
}


/**
* Utility function that returns the name of the run list file for a specific date
* @returns {String}
*/
function getDateRunListName(instrument,year,datecode) {
   var name="output/"+instrument+"/"+year+"/"+pad4(parseInt(datecode))+"/runList.json";
   return name;
}


/**
* Utility function that returns the name of the JSON event file
* @returns {String}
*/
function getEventName(instrument, run, year, datecode, eventNumber) {
   var name="output/"+instrument+"/"+year+"/"+pad4(parseInt(datecode))+"/run"+run+"/events"+(eventNumber-(eventNumber%1000))+"/event"+eventNumber+".json.gz"; 
    return name;
}


/**
* Utility function that returns the path of the JSON event list file for a run
* @returns {String}
*/
function getEventListName(instrument, run, year, datecode) {
    var name="output/"+instrument+"/"+year+"/"+pad4(parseInt(datecode))+"/run"+run+"/eventList.json"; 
    return name;
}


/**
* Utility function for logging an AJAX JSON URL load request in the debug container
*/
function ajaxLoadingLog(urlName) {
    if($('#debugContainer').is(":visible"))
	$('#debugContainer').append("<p>Loading... "+urlName+"</p>");
}


/**
* Utility function for logging an AJAX JSON URL load success in the debug container
*/
function ajaxLoadedLog(urlName) {    
    if($('#debugContainer').is(":visible"))
	$('#debugContainer').append("<p>Loaded... "+urlName+"</p>");
}


/**
* Utility function for handling an AJAX error
*/
function handleAjaxError(jqXHR, exception) {
    
    var canContainer = $("#titleContainer"); 
    var debugContainer = $("#debugContainer"); 
    if (jqXHR.status === 0) {
        canContainer.append('Not connect.\n Verify Network.');
	if($('#debugContainer').is(":visible"))
	    debugContainer.append('Not connect.\n Verify Network.');
    } else if (jqXHR.status == 404) {
        canContainer.append('Requested page not found. [404]');
	if($('#debugContainer').is(":visible"))
	    debugContainer.append('Requested page not found. [404]');
    } else if (jqXHR.status == 500) {
        canContainer.append('Internal Server Error [500].');
	if($('#debugContainer').is(":visible"))
	    debugContainer.append('Internal Server Error [500].');
    } else if (exception === 'parsererror') {
        canContainer.append('Requested JSON parse failed.');
	if($('#debugContainer').is(":visible"))
	    debugContainer.append('Requested JSON parse failed.');
    } else if (exception === 'timeout') {
        canContainer.append('Time out error.');
	if($('#debugContainer').is(":visible"))
	    debugContainer.append('Time out error.');
    } else if (exception === 'abort') {
            canContainer.append('Ajax request aborted.');
	    if($('#debugContainer').is(":visible"))
		debugContainer.append('Ajax request aborted.');
    } else {
        canContainer.append('Uncaught Error.\n' + jqXHR.responseText);
	if($('#debugContainer').is(":visible"))
	    debugContainer.append('Uncaught Error.\n' + jqXHR.responseText);
    }
}




/**
 * This is a sorting algorithm which is used to sort arrays by time (zeroth index).
 * @param {Array} a
 * @param {Array} b
 * @returns {Number}
 */
function timeSortData(a,b) {
    return a[0]-b[0];
}

/**
 * This is a sorting algorithm which is used to sort arrays by voltage (first index).
 * @param {Array} a
 * @param {Array} b
 * @returns {Number}
 */
function voltageSortData(a,b) {
    return b[1]-a[1];
}


/**
* Utility function for sorting numbers
 * @param {Number} a
 * @param {Number} b
 * @returns {Number}
*/
function numberSort(a,b) {
    return a - b;
}




/**
* Utility function that initialises the left menu of the hk pages
* @returns {Object}
*/
function initialiseHkMenu(doTimeType) {
    var hkValues = new Object();


    /**
     * Utility function that returns the value of a URL variable or null
     * @returns {String}
     */
    $.urlParam = function(name){
	var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
	if(results != null) {
	    return results[1];
	}
	return null;
    };
    


    hkValues.hkType=document.getElementById("hkTypeForm").value;
    if($.urlParam('hkType')) {
	hkValues.hkType=$.urlParam('hkType');
    }

    hkValues.instrument=document.getElementById("instrumentForm").value;
    if($.urlParam('instrument')) {
	hkValues.instrument=$.urlParam('instrument');//urlVars["instrument"];
    }

    hkValues.run=document.getElementById("runForm").value;
    hkValues.runAlreadySet=false;
    if($.urlParam('run')) {
	hkValues.run=$.urlParam('run');//urlVars["run"];
	hkValues.runAlreadySet=true;
    }


    if(doTimeType) {
	hkValues.timeType=document.getElementById("timeForm").value;
	if($.urlParam('timeType')) {
	    hkValues.timeType=$.urlParam('timeType');//urlVars["timeType"];
	}

	
	hkValues.endrun=hkValues.run;
	if($.urlParam('endrun')) {
	    hkValues.endrun=$.urlParam('endrun');
	}
    }


  
    

    return hkValues;
}




/**
* Utility function that initialises the plot form on the left menu
*/
function fillPlotForm(array) {
    $('#plotForm').empty();
    for (i=0;i<array.length;i++){             
	$('<option/>').val(array[i].sym).html(array[i].desc).appendTo('#plotForm');
    }
}

/**
* Utitlity function that draws the UI buttons for time view
*/
function initialiseTimeViewButtons() {

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

    $("#layoutRadio").buttonset();

    $("input:radio[name=layoutRadio]").click(function(){
	var str=$(this).val();	;
	if(str.indexOf("both")>=0) {
	    $('#divTime-1').width("70%");
	    $('#divProjection-1').width("30%");
	    $('#divTime-1').show();
	    $('#divProjection-1').show();
	    
	}
	else if(str.indexOf("time")>=0) {
	    $('#divTime-1').width("100%");
	    $('#divTime-1').show();
	    $('#divProjection-1').hide();
	    
						 }
	else if(str.indexOf("projection")>=0) {
	    $('#divProjection-1').width("100%");
	    $('#divTime-1').hide();
	    $('#divProjection-1').show();
	}	
    });

    ///Here is the logic for delaying with the scale buttons
    $('#xScaleDiv').hide();
    $('#yScaleDiv').hide();

    $('#showScaleButton').click( function() {
				     $('#xScaleDiv').toggle();
				     $('#yScaleDiv').toggle();
				 });
    
    $('#yAutoScale').change(function() {
	if($('#yAutoScale').prop('checked')) {
	    $('#debugContainer').append("<p>yAutoScale checked</p>");
	    //Switching to autoscale
	    $('#yMinInput').attr('disabled','disabled');
	    $('#yMaxInput').attr('disabled','disabled');
	}
	else {
	    $('#debugContainer').append("<p>yAutoScale not checked</p>");
	    //Switching to fixed scale
	    $('#yMinInput').removeAttr('disabled');
	    $('#yMaxInput').removeAttr('disabled');
	}
    });
    

    $('#xAutoScale').change(function() {
	if($('#xAutoScale').prop('checked')) {
	    //Switching to autoscale
	    $('#xMinDateInput').attr('disabled','disabled');
	    $('#xMaxDateInput').attr('disabled','disabled');
	    $('#xMinTimeInput').attr('disabled','disabled');
	    $('#xMaxTimeInput').attr('disabled','disabled');
	}
	else {
	    //Switching to fixed scale
	    $('#xMinDateInput').removeAttr('disabled');
	    $('#xMaxDateInput').removeAttr('disabled');
	    $('#xMinTimeInput').removeAttr('disabled');
	    $('#xMaxTimeInput').removeAttr('disabled');
	}
    });



    $('#runForm2').change(function() {
	drawPlot(AwareUtils);
    });				
      			        

    $('#timeForm').change(function(e) {			      
	AwareUtils.timeType = $(this).val();
	e.stopPropagation();
	if(AwareUtils.timeType == "timeRange") {
	    $('#endRunDiv').show();
	    $('#timeRangeDiv').show();	     
	}
	else if(AwareUtils.timeType == "multiRun") {
	    $('#endRunDiv').show();
	    $('#fullMaxDiv').show();
	    $('#timeRangeDiv').hide();
	}
	else {
	    $('#endRunDiv').hide();
	    if(AwareUtils.timeType == "full") {
		$('#fullMaxDiv').show();
		$('#timeRangeDiv').hide();
	    }
	    else {
		$('#fullMaxDiv').show();
		$('#timeRangeDiv').hide();
	    }
	    
	}
		
	drawPlot(AwareUtils);
    });


      
    $('#refreshButton').click(function() {
	drawPlot(AwareUtils);
    });
    


    $('#setRunRange').bind('click', function() {
	var startDate=document.getElementById("startDate").value;
	var startYear=startDate.split("/")[0];
	var startMonth=startDate.split("/")[1];
	var startDay=startDate.split("/")[2];
	var startDatecode=startMonth+startDay;	
	var startDateRunListUrl=getDateRunListName(AwareUtils.instrument,startYear,startDatecode);	
	var endDate=document.getElementById("endDate").value;
	var endYear=endDate.split("/")[0];
	var endMonth=endDate.split("/")[1];
	var endDay=endDate.split("/")[2];
	var endDatecode=endMonth+endDay;
	var endDateRunListUrl=getDateRunListName(AwareUtils.instrument,endYear,endDatecode);
		
	var numGot=0;
	function handleStartDateRunList(jsonObject) {
	    for(var i=0;i<jsonObject.runList.length;i++) {
		var thisRun=jsonObject.runList[i];
		setStartRunOnForm(Number(thisRun));	    
		break;
	    }
	    numGot++;
	    if(numGot==2) drawPlot(AwareUtils);
	}
	
	function handleEndDateRunList(jsonObject) {
	    for(var i=0;i<jsonObject.runList.length;i++) {
		var thisRun=jsonObject.runList[i];
		setEndRunOnForm(Number(thisRun));	    
	    }
	    numGot++;
	    if(numGot==2) drawPlot(AwareUtils);
	}
	
	function handleFailure() {
	    numGot++;
	    if(numGot==2) drawPlot(AwareUtils);
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
    $( "#startDate" ).change(function(e) {			      
	e.stopPropagation();
    });
    
    $( "#endDate" ).change(function(e) {			      
	e.stopPropagation();
    });
    
    
    $( "#startDate" ).datepicker({
	dateFormat:"yy/mm/dd",
	maxDate:0,
	onClose: function( selectedDate ) {
	    $( "#endDate" ).datepicker( "option", "minDate", selectedDate );
	}
    });     
    $( "#endDate" ).datepicker({
	dateFormat:"yy/mm/dd",
	maxDate:0,
	onClose: function( selectedDate ) {
	    $( "#startDate" ).datepicker( "option", "maxDate", selectedDate );
	}
    });

    $('#fullMaxDiv').show();
    if(AwareUtils.timeType == "multiRun")
	$('#endRunDiv').show();
    if(AwareUtils.timeType == "timeRange") {
	$('#endRunDiv').show();
	$('#timeRangeDiv').show();	  
    }

}


function initialisePlotHolder() {
    var docHeight=$(window).height();
    var docWidth=$(window).width();
    var heightPercentage=60;
    if(docWidth>=800) heightPercentage=80;
    var maxPlotHeight=Math.round((heightPercentage*docHeight)/100);
    $('#plot-holder-1').height(maxPlotHeight); 


    $('#divProjection-1').show();

    //This is actually for the time plot stuff ... or maybe it isn't maybe this is for any plot-holder
    $( ".plot-holder" ).addClass( "ui-widget ui-widget-content ui-helper-clearfix ui-corner-all" )
	.resizable()
	.find( ".plot-header" )
        .addClass( "ui-widget-header ui-corner-all" )
        .prepend( "<span class='ui-icon ui-icon-minusthick'></span>")
        .end()
	.find( ".plot-content" );        
      
      
    $( ".plot-header .ui-icon" ).click(function() {
	$( this ).toggleClass( "ui-icon-minusthick" ).toggleClass( "ui-icon-plusthick" );
	$( this ).parents( ".plot-holder:first" ).find( ".plot-content" ).toggle();
	if($( this ).parents( ".plot-holder:first" ).height()>maxPlotHeight) {
	    maxPlotHeight=$( this ).parents( ".plot-holder:first" ).height();
	}
					     
	
	toggleHeight=100;
	if( $( this ).parents( ".plot-holder:first" ).find( ".plot-content" ).is(':visible')) {
	    toggleHeight=maxPlotHeight;
	}
	$( this ).parents( ".plot-holder:first" ).height( toggleHeight );
    });
    
}

function updateHkType(thisHkType) {
    AwareUtils.hkType=thisHkType;	
    
    function actuallyUpdateHkType(plotFormArray) {
	var tempArray = $.grep( plotFormArray, function(elem){ return elem.hkCode  == thisHkType; });	   
	fillPlotForm(tempArray);
	drawPlot(AwareUtils);	   
    }
    
    $.ajax({
	url: "config/plotTypeList.json",
	type: "GET",
	dataType: "json", 
	success: actuallyUpdateHkType
    });      
 }

function updateLastRun(setStartToLast) {
    //	var tempString="output/"+hkValues.instrument+"/lastRun";
    var tempString="output/"+AwareUtils.instrument+"/last"+capitaliseFirstLetter(AwareUtils.hkType);

    function actuallyUpdateLastRun(runString) {
	setLastRun(Number(runString));
	if(setStartToLast) {
	    setStartRunOnForm(Number(runString));
	    if(typeof(setEndRunOnForm) == "function") {
		setEndRunOnForm(Number(runString));
	    }
	    drawPlot(AwareUtils);
	}
    }
    
    
    $.ajax({
	url: tempString,
	type: "GET",
	dataType: "text", 
	success: actuallyUpdateLastRun
    });     
}


function initialiseMenuButtions() {
  
   

    
    $('#runForm').change(function() {
	drawPlot(AwareUtils);
    });
    
    $('#instrumentForm').change(function(e) {
	AwareUtils.instrument=$(this).val();
	AwareUtils.runAlreadySet=false;
	e.stopPropagation();
	updateLastRun(true);
    });	

    $('#hkTypeForm').change(function(e) {
	var selectedValue = $(this).val();
	e.stopPropagation();
	updateHkType(selectedValue);	
    });

}


/**
 * Sets the maximum run on the UI form elements
 * @params thisRun is an integer corresponding to the maximum allowed run number
 */
function setLastRun(thisRun) {
    document.getElementById("runInput").max=thisRun;
    document.getElementById("endRunInput").max=thisRun;
}


/**
 * Gets the run number from the runInput UI element
 * @returns The run number from the runInput UI element
 */
function getStartRunFromForm() {
    return document.getElementById("runInput").value;
} 

/**
 * Sets the runInput UI element to thisRun
 * @params thisRun is the new start run number 
 */
function setStartRunOnForm(thisRun) { 
    document.getElementById("runInput").value=thisRun;
	
} 



/**
* Utility function that initialises the the aware hk time plotting thing
*/
function initialiseAwareHkTime() {


    $('#debugContainer').show();

    //First initialise the plot-holder div
    initialisePlotHolder();
    
    //Now initialise the other bits of the UI
    var hkValues=initialiseHkMenu(1);
    AwareUtils.hkType=hkValues.hkType;
    AwareUtils.instrument=hkValues.instrument;
    AwareUtils.timeType=hkValues.timeType;
    AwareUtils.run=hkValues.run;
    AwareUtils.runAlreadySet=hkValues.runAlreadySet;
    AwareUtils.timeCanName='divTime-1';
    AwareUtils.projCanName='divProjection-1';
    AwareUtils.plotId=1;
    initialiseMenuButtions();
    initialiseTimeViewButtons();
               
    updateLastRun(false);
    setEndRunOnForm(hkValues.endrun);
        
    updateHkType(AwareUtils.hkType);
    if(!AwareUtils.runAlreadySet) updateLastRun(true);
}

/**
* Utility function that initialises the the aware hk time plotting thing
*/
function initialiseRunSummary() {


    $('#debugContainer').show();

    
    //Now initialise the other bits of the UI
    var hkValues=initialiseHkMenu(0);
    AwareUtils.hkType=hkValues.hkType;
    AwareUtils.instrument=hkValues.instrument;
    AwareUtils.run=hkValues.run;
    AwareUtils.runAlreadySet=hkValues.runAlreadySet;
    initialiseMenuButtions();
                     
    updateHkType(AwareUtils.hkType);

    if(!AwareUtils.runAlreadySet) {
	updateLastRun(true);
    }
    else {	
	updateLastRun(false);  
    }
}
