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

function getRunListName(instrument, run) {
    var run1000=run - (run%1000);
    var name="output/"+instrument+"/runList"+run1000+".json";
    return name;
}


function getHkName(instrument, run, year, datecode, hkType) {
    var name="output/"+instrument+"/"+year+"/"+pad4(datecode)+"/run"+run+"/"+hkType+"Summary.json.gz"; 
    return name;
}


function getHkTimeName(instrument, run, year, datecode,hkType) {
    var name="output/"+instrument+"/"+year+"/"+pad4(datecode)+"/run"+run+"/"+hkType+"Time.json.gz"; 
    return name;
}

function getFullHkName(instrument,run,year,datecode,hkFile,hkType) {
    var name="output/"+instrument+"/"+year+"/"+pad4(datecode)+"/run"+run+"/full/"+hkType+"_"+hkFile+".json.gz"; 
    return name;
}

function getFullHkTimeName(instrument,run,year,datecode,hkType) {
    var name="output/"+instrument+"/"+year+"/"+pad4(datecode)+"/run"+run+"/full/"+hkType+"_time.json.gz"; 
    return name;
}

function getDateRunListName(instrument,year,datecode) {
   var name="output/"+instrument+"/"+year+"/"+pad4(datecode)+"/runList.json";
   return name;
}


function getEventName(instrument, run, year, datecode, eventNumber) {
    var name="output/"+instrument+"/"+year+"/"+pad4(datecode)+"/run"+run+"/event"+eventNumber+".json.gz"; 
    return name;
}
