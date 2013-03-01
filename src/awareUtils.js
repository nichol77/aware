//////////////////////////////////////////////////////////////////////////////
/////                                                                    /////
/////   awareUtils.js                                                    /////
/////                                                                    /////
/////   Gerneric useful functions for the AWARE web plotting library     /////
/////                                                                    /////
/////   March 2013, r.nichol@ucl.ac.uk                                   /////
//////////////////////////////////////////////////////////////////////////////




function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
						 vars[key] = value;
					     });
    return vars;
}

function getHkName(station, run) {
    var name="output/"+station+"/2013/0123/run"+run+"/eventHkSummary.json"; 
    return name;
}


function getHkTimeName(station, run) {
    var name="output/"+station+"/2013/0123/run"+run+"/eventHkTime.json"; 
    return name;
}
