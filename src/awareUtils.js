//////////////////////////////////////////////////////////////////////////////
/////                                                                    /////
/////   awareUtils.js                                                    /////
/////                                                                    /////
/////   Gerneric useful functions for the AWARE web plotting library     /////
/////                                                                    /////
/////   March 2013, r.nichol@ucl.ac.uk                                   /////
//////////////////////////////////////////////////////////////////////////////


function pad4(number) {
   
     return (number < 1000 ? '0' : '') + number
   
}


function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
						 vars[key] = value;
					     });
    return vars;
}

function getRunListName(station, run) {
    var run1000=run - (run%1000);
    var name="output/"+station+"/runList"+run1000+".json";
    return name;
}


function getHkName(station, run, year, datecode) {
    var name="output/"+station+"/"+year+"/"+pad4(datecode)+"/run"+run+"/eventHkSummary.json"; 
    return name;
}


function getHkTimeName(station, run, year, datecode) {
    var name="output/"+station+"/"+year+"/"+pad4(datecode)+"/run"+run+"/eventHkTime.json"; 
    return name;
}

function getFullHkName(station,run,year,datecode,hkFile) {
    var name="output/"+station+"/"+year+"/"+pad4(datecode)+"/run"+run+"/full/eventHk_"+hkFile+".json"; 
    return name;
}

function getFullHkTimeName(station,run,year,datecode) {
    var name="output/"+station+"/"+year+"/"+pad4(datecode)+"/run"+run+"/full/eventHk_time.json"; 
    return name;
}