//////////////////////////////////////////////////////////////////////////////
/////                                                                    /////
/////   awareUtils.js                                                    /////
/////                                                                    /////
/////   Gerneric useful functions for the AWARE web plotting library     /////
/////                                                                    /////
/////   March 2013, r.nichol@ucl.ac.uk                                   /////
//////////////////////////////////////////////////////////////////////////////


function capitaliseFirstLetter(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}


function pad4(number) {
   
     return (number < 1000 ? '0' : '') + number
   
}


function pad2(number) {
   
     return (number < 10 ? '0' : '') + number
   
}


function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
						 vars[key] = value;
					     });
    return vars;
}

function getRunListName(instrument, run) {
    var run1000=run - (run%1000);
    var name="output/"+instrument+"/runList"+run1000+".json";
    return name;
}


function getHkName(instrument, run, year, datecode, hkType) {
    var name="output/"+instrument+"/"+year+"/"+pad4(parseInt(datecode))+"/run"+run+"/"+hkType+"Summary.json.gz"; 
    return name;
}


function getHkTimeName(instrument, run, year, datecode,hkType) {
    var name="output/"+instrument+"/"+year+"/"+pad4(parseInt(datecode))+"/run"+run+"/"+hkType+"Time.json.gz"; 
    return name;
}

function getFullHkName(instrument,run,year,datecode,hkFile,hkType) {
    var name="output/"+instrument+"/"+year+"/"+pad4(parseInt(datecode))+"/run"+run+"/full/"+hkType+"_"+hkFile+".json.gz"; 
    return name;
}

function getFullHkTimeName(instrument,run,year,datecode,hkType) {
    var name="output/"+instrument+"/"+year+"/"+pad4(parseInt(datecode))+"/run"+run+"/full/"+hkType+"_time.json.gz"; 
    return name;
}

function getDateRunListName(instrument,year,datecode) {
   var name="output/"+instrument+"/"+year+"/"+pad4(parseInt(datecode))+"/runList.json";
   return name;
}


function getEventName(instrument, run, year, datecode, eventNumber) {
   var name="output/"+instrument+"/"+year+"/"+pad4(parseInt(datecode))+"/run"+run+"/events"+(eventNumber-(eventNumber%1000))+"/event"+eventNumber+".json.gz"; 
    return name;
}


function getEventListName(instrument, run, year, datecode) {
    var name="output/"+instrument+"/"+year+"/"+pad4(parseInt(datecode))+"/run"+run+"/eventList.json"; 
    return name;
}

function ajaxLoadingLog(urlName) {
    if($('#debugContainer').is(":visible"))
	$('#debugContainer').append("<p>Loading... "+urlName+"</p>");
}

function ajaxLoadedLog(urlName) {    
    if($('#debugContainer').is(":visible"))
	$('#debugContainer').append("<p>Loaded... "+urlName+"</p>");
}


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