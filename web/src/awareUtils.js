
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
