//////////////////////////////////////////////////////////////////////////////
/////                                                                    /////
/////   awareConfig.js                                                   /////
/////                                                                    /////
/////   Simple javascript for showing config file in JSON format         /////
/////                                                                    /////
/////   November 2014, r.nichol@ucl.ac.uk                                   /////
//////////////////////////////////////////////////////////////////////////////


function getList(item, $list) {
    
    if($.isArray(item)){
        $.each(item, function (key, value) {
		   getList(value, $list);
	       });
        return;
    }
    
    if (item) {
        var $li = $('<li />');
	if(item.type=="ConfigItem") {
	    $li.append(item.name + '#'+item.varType+ ' = ' + item.value);
	}
        else if (item.name) {
            $li.append($('<a href="#">' + item.name + '</a>'));
        }
        if (item.itemList && item.itemList.length) {
            var $sublist = $("<ul/>");
            getList(item.itemList, $sublist)
		$li.append($sublist);
        }
        $list.append($li)
	    }
}


function showConfig() {
    var configUrl=getConfigName(getInstrumentNameFromForm(),getStartRunFromForm(),getConfigFromForm());
    $("#plot-content-1").empty();
    $("#plot-header-1").empty();


    ajaxLoadingLog(configUrl);
    xhr = $.ajax({
	url: configUrl,
	type: "GET",
	dataType: "json",
		success: function (jsonObject) {
		var $head=$('<h3>'+getConfigFromForm()+'.config</h3><h4>From: '+xhr.getResponseHeader("Last-Modified")+'</h4>');
		$("#plot-header-1").append($head);	       	
		var $ul = $('<ul></ul>');
		getList(jsonObject.sectionList,$ul);
		$("#plot-content-1").append($ul);
		//	$("#debugContainer").append("<p>"+jsonObject+"</p>")
	    },
	error: handleAjaxError
    }); 

}


function showFile() {
    
    $("#plot-content-1").empty();
    $("#plot-header-1").empty();
    function handleFile(file) {
	$("#plot-content-1").append("<pre>"+file+"</pre>");
    }

    fileUrl=$("#fileForm").val();

    ajaxLoadingLog(fileUrl);
    $.ajax({
	url: fileUrl,
	type: "GET",
	dataType: "text",
	success: handleFile,
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
