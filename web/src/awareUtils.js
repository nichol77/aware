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
    var name="output/"+station+"/runList"+run1000+".json.gz";
    return name;
}


function getHkName(station, run, year, datecode, hkType) {
    var name="output/"+station+"/"+year+"/"+pad4(datecode)+"/run"+run+"/"+hkType+"Summary.json.gz"; 
    return name;
}


function getHkTimeName(station, run, year, datecode,hkType) {
    var name="output/"+station+"/"+year+"/"+pad4(datecode)+"/run"+run+"/"+hkType+"Time.json.gz"; 
    return name;
}

function getFullHkName(station,run,year,datecode,hkFile,hkType) {
    var name="output/"+station+"/"+year+"/"+pad4(datecode)+"/run"+run+"/full/"+hkType+"_"+hkFile+".json.gz"; 
    return name;
}

function getFullHkTimeName(station,run,year,datecode,hkType) {
    var name="output/"+station+"/"+year+"/"+pad4(datecode)+"/run"+run+"/full/"+hkType+"_time.json.gz"; 
    return name;
}

function getDateRunListName(station,year,datecode) {
   var name="output/"+station+"/"+year+"/"+pad4(datecode)+"/runList.json.gz";
   return name;
}


function getEventName(station, run, year, datecode, eventNumber) {
    var name="output/"+station+"/"+year+"/"+pad4(datecode)+"/run"+run+"/event"+eventNumber+".json.gz"; 
    return name;
}
