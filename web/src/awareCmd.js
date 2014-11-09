//////////////////////////////////////////////////////////////////////////////
/////                                                                    /////
/////   awareCmd.js                                                       /////
/////                                                                    /////
/////   Simple javascript for showing commands and echos                 /////
/////                                                                    /////
/////   November 2014, r.nichol@ucl.ac.uk                                   /////
//////////////////////////////////////////////////////////////////////////////




function showCmd() {
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


