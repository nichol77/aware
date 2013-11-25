
/**
 * Generic useful functions for the AWARE web plotting library 
 * @file awareUtils.js
 * @author Ryan Nichol <r.nichol@ucl.ac.uk>
 */


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
	
	updateLastRun(false);
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
* Utility function that initialises the the aware hk thingymejig
*/
function initialiseAwareHk() {

    var docHeight=$(window).height();
    var docWidth=$(window).width();
    var heightPercentage=60;
    if(docWidth>=800) heightPercentage=80;
    var maxPlotHeight=Math.round((heightPercentage*docHeight)/100);
    $('#plot-holder-1').height(maxPlotHeight); 


    $('#divProjection-1').show();
    $('#debugContainer').hide();

    //This is actually for the time plot stuff
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
      


    var hkValues=initialiseHkMenu(1);

    $("#layoutRadio").buttonset();

   
    
    var plotControl = new Object();
    plotControl.hkType=hkValues.hkType;
    plotControl.plotId=1;
    plotControl.timeType=hkValues.timeType;
    plotControl.timeCanName='divTime-1';
    plotControl.projCanName='divProjection-1';


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
      
    $('#refreshButton').click(function() {
	drawPlot(plotControl);
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
    
    

    
    function updateHkType(thisHkType) {
	hkValues.hkType=thisHkType;
	plotControl.hkType=thisHkType;
	
	
	function actuallyUpdateHkType(plotFormArray) {
	    var tempArray = $.grep( plotFormArray, function(elem){ return elem.hkCode  == thisHkType; });	   
	    fillPlotForm(tempArray);
	    drawPlot(plotControl);	   
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
	var tempString="output/"+hkValues.instrument+"/last"+capitaliseFirstLetter(hkValues.hkType);


	function actuallyUpdateLastRun(runString) {
	    setLastRun(Number(runString));
	    if(setStartToLast) {
		setStartRunOnForm(Number(runString));
		setEndRunOnForm(Number(runString));
		drawPlot(plotControl);
	    }
	}


	$.ajax({
		url: tempString,
		    type: "GET",
		    dataType: "text", 
		    success: actuallyUpdateLastRun
		    }); 
	
    }


    $('#runForm').change(function() {
			     drawPlot(plotControl);
			 });


    $('#runForm2').change(function() {
			      drawPlot(plotControl);
			  });				
      

    $('#instrumentForm').change(function(e) {
				    hkValues.instrument=$(this).val();
				    hkValues.runAlreadySet=false;
				    e.stopPropagation();
				    updateLastRun(true);
				});	

    $('#hkTypeForm').change(function(e) {
				var selectedValue = $(this).val();
				e.stopPropagation();
				updateHkType(selectedValue);
	   
			    });
      
			
        

    $('#timeForm').change(function(e) {			      
			      hkValues.timeType = $(this).val();
			      e.stopPropagation();
			      if(hkValues.timeType == "timeRange") {
				  $('#endRunDiv').show();
				  $('#timeRangeDiv').show();	     
			      }
			      else if(hkValues.timeType == "multiRun") {
				  $('#endRunDiv').show();
				  $('#fullMaxDiv').show();
				  $('#timeRangeDiv').hide();
			      }
			      else {
				  $('#endRunDiv').hide();
				  if(hkValues.timeType == "full") {
				      $('#fullMaxDiv').show();
				      $('#timeRangeDiv').hide();
				  }
				  else {
				      $('#fullMaxDiv').show();
				      $('#timeRangeDiv').hide();
				  }
	       
			      }


			      plotControl.timeType=hkValues.timeType;
			      drawPlot(plotControl);
			  });

    setEndRunOnForm(hkValues.endrun);


    $('#setRunRange').bind('click', function() {
	
	var startDate=document.getElementById("startDate").value;
	var startYear=startDate.split("/")[0];
	var startMonth=startDate.split("/")[1];
	var startDay=startDate.split("/")[2];
	var startDatecode=startMonth+startDay;	
	var startDateRunListUrl=getDateRunListName(hkValues.instrument,startYear,startDatecode);	
	var endDate=document.getElementById("endDate").value;
	var endYear=endDate.split("/")[0];
	var endMonth=endDate.split("/")[1];
	var endDay=endDate.split("/")[2];
	var endDatecode=endMonth+endDay;
	var endDateRunListUrl=getDateRunListName(hkValues.instrument,endYear,endDatecode);
	
	
	var numGot=0;
	function handleStartDateRunList(jsonObject) {
	    for(var i=0;i<jsonObject.runList.length;i++) {
		var thisRun=jsonObject.runList[i];
		setStartRunOnForm(Number(thisRun));	    
		break;
	    }
	    numGot++;
	    if(numGot==2) drawPlot(plotControl);
	}
	
	function handleEndDateRunList(jsonObject) {
	    for(var i=0;i<jsonObject.runList.length;i++) {
		var thisRun=jsonObject.runList[i];
		setEndRunOnForm(Number(thisRun));	    
	    }
	    numGot++;
	    if(numGot==2) drawPlot(plotControl);
	}
	
	function handleFailure() {
	    numGot++;
	    if(numGot==2) drawPlot(plotControl);
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
    if(hkValues.timeType == "multiRun")
	$('#endRunDiv').show();
    if(hkValues.timeType == "timeRange") {
	$('#endRunDiv').show();
	$('#timeRangeDiv').show();	  
    }

    updateHkType(hkValues.hkType);
    if(!hkValues.runAlreadySet) updateLastRun(true);
}