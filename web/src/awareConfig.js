//////////////////////////////////////////////////////////////////////////////
/////                                                                    /////
/////   awareConfig.js                                                   /////
/////                                                                    /////
/////   Simple javascript for showing config file in JSON format         /////
/////                                                                    /////
/////   November 2014, r.nichol@ucl.ac.uk                                   /////
//////////////////////////////////////////////////////////////////////////////




function showConfig() {
    var configUrl=getHkName(getInstrumentNameFromForm(),getStartRunFromForm(),getConfigFromForm());
    function handleConfigJsonFile(jsonObject) {
	$("#debugContainer").append("<p>"+jsonObject+"</p>")
    }


    ajaxLoadingLog(configUrl);
    $.ajax({
	url: configUrl,
	type: "GET",
	dataType: "json",
	success: handleConfigJsonFile,
	error: handleAjaxError
    }); 

}


/**
 * This function simply updates the plot title and the URL
 */
function updatePlotTitle() {
    //Also update the page URL
    var currentUrl = [location.protocol, '//', location.host, location.pathname].join('');
    currentUrl=currentUrl+"?run="+getStartRunFromForm()+"&instrument="+getInstrumentNameFromForm()+"&hkType="+getHkTypeFromForm();
    var stateObj = { foo: "bar" };
    history.replaceState(stateObj, "page 2", currentUrl);

    var canContainer = $("#titleContainer"); 
    canContainer.empty();
    canContainer.append("<h1>"+getInstrumentNameFromForm()+" -- Run "+getStartRunFromForm()+"</h1>");
}
