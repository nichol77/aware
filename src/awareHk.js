function DataPoint(name2,mean2,stdDev2,numEnts2)
{
    this.name=name2;
    this.mean=mean2;
    this.stdDev=stdDev2;
    this.numEnts=numEnts2;
}

//check if the next sibling node is an element node
function get_nextsibling(n)
{
    if(n==null) return n;
    x=n.nextSibling;
    if(x==null) return x;
    while (x.nodeType!=1)
	{
	    x=x.nextSibling;
	    if(x==null) return x;	
	}
    return x;
}



/* 
   Splits a comma separated string into an array. Taken from: 
   http://www.greywyvern.com/?post=258
*/
String.prototype.splitCSV = function(sep) {
    for (var foo = this.split(sep = sep || ","), x = foo.length - 1, tl; x >= 0; x--) {
	if (foo[x].replace(/"\s+$/, '"').charAt(foo[x].length - 1) == '"') {
      if ((tl = foo[x].replace(/^\s+"/, '"')).length > 1 && tl.charAt(0) == '"') {
        foo[x] = foo[x].replace(/^\s*"|"\s*$/g, '').replace(/""/g, '"');
    } else if (x) {
        foo.splice(x - 1, 2, [foo[x - 1], foo[x]].join(sep));
    } else foo = foo.shift().split(sep).concat(foo);
} else foo[x].replace(/""/g, '"');
} return foo;
};

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
						 vars[key] = value;
					     });
    return vars;
}



/**
 * Loads the XML file
 * @param {String} filename    The name of the XML file
 */
function loadXMLDoc(filename)
{
    if (window.XMLHttpRequest)
	{
	    xhttp=new XMLHttpRequest();
	}
    else
	{
	    xhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
    xhttp.open("GET",filename,false);
    xhttp.send();
    return xhttp.responseXML;
}


/* Globals */
var thisFile;
var stationName;
var runNumber;
var startTime;
var duration;

var dpList = new Array();
var stackVarList = new Array();
var stackNameList = new Array();



function loadXmlSummaryHk() {
    var xmlfile="output/STATION1B/2013/0123/run2000/eventHkSummary.xml";    
    var urlVars=getUrlVars();

    
    parseXmlSummaryHk(xmlfile);

}


/**
 * Parses the XML
 * @param {String} filename    The name of the XML file
 */
function parseXmlSummaryHk(filename) {
    //Load the XML file
    thisFile=filename;
    var xmlDoc = "";
    xmlDoc = loadXMLDoc(filename);
 
    //create data for the y-axis
    stationName = xmlDoc.getElementsByTagName("station")[0].childNodes[0].nodeValue;
    runNumber = xmlDoc.getElementsByTagName("run")[0].childNodes[0].nodeValue;
    startTime = xmlDoc.getElementsByTagName("startTime")[0].childNodes[0].nodeValue;
    duration = xmlDoc.getElementsByTagName("duration")[0].childNodes[0].nodeValue;

    x=xmlDoc.getElementsByTagName("duration")[0];
    //document.write(x.nodeName);
    //document.write(" = ");	
    // document.write(x.childNodes[0].nodeValue);
    y=get_nextsibling(x);		
    for(var i=0; i< 100; i++) {
	if(y==null) break;	
	atts=y.attributes;
	//	document.write(y.nodeName);
	//	document.write(" num atts = " + atts.length);
	if(atts.length==0) {
	    //       document.write(" mean = ");	
	    //       document.write(y.getElementsByTagName("mean")[0].childNodes[0].nodeValue);
	    //       document.write(" stdDev = ");	
	    //       document.write(y.getElementsByTagName("stdDev")[0].childNodes[0].nodeValue);
	    //       document.write(" numEnts = ");	
	    //       document.write(y.getElementsByTagName("numEnts")[0].childNodes[0].nodeValue);
	    var dp = new DataPoint(y.nodeName,y.getElementsByTagName("mean")[0].childNodes[0].nodeValue,y.getElementsByTagName("stdDev")[0].childNodes[0].nodeValue,y.getElementsByTagName("numEnts")[0].childNodes[0].nodeValue);
	    dpList.push(dp);
	}
	else {
	    //	    document.write("<br>");	
	    z=y.firstChild;	
	    for(var j=0;j<100;j++) {
		z=get_nextsibling(z);
		if(z==null) break;
		var subNodeName=y.nodeName+atts[0].value+"_"+z.nodeName;
		//		document.write(subNodeName);
		//		document.write("<br>");	
		
		var dp = new DataPoint(subNodeName,z.getElementsByTagName("mean")[0].childNodes[0].nodeValue,z.getElementsByTagName("stdDev")[0].childNodes[0].nodeValue,z.getElementsByTagName("numEnts")[0].childNodes[0].nodeValue);
		dpList.push(dp);
 
		
	    }
	}
	
	
	//	document.write("<br>");
	//	document.write("dpList.length = "+dpList.length);
	//	document.write("<br>");	

	y=get_nextsibling(y);
    }
}




function drawRunSummaryHk(canName) {
    
    var l1Array = [];
    var l1ArrayErrors = [];
    var countL1=0;
    for(var index=0;index<dpList.length;index++) {
	var dp2=dpList[index];
	var dpName=new String(dp2.name);
	var n=dpName.indexOf("singleChannelRate");
	if(n>=0) {
	    l1Array.push([countL1,dp2.mean]);
	    l1ArrayErrors.push(dp2.stdDev);
	    countL1++;
	}
    }
    

    //    $.plot($("#"+canName), [ {data : l1Array, bars: { show: true }} ]);
    

    var data3_points = {
	//do not show points	
	radius: 0,
	errorbars: "y", 
	yerr: {show:true, upperCap: "-", lowerCap: "-", radius: 5}
    };
    

	
    for (var i = 0; i < l1Array.length; i++) {
	l1ArrayErrors[i] = l1Array[i].concat(l1ArrayErrors[i])
	    }
    
    var data = [
    // bars with errors
    {color: "orange", bars: {show: true, align: "center", barWidth: 1}, data: l1Array},
    {color: "orange", lines: {show: false }, points: data3_points, data: l1ArrayErrors}
    ];

    $.plot($("#"+canName), data );

	
}

    