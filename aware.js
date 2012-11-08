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
var runNumber;
var eventNumber;
var eventTime;
var numChannels;
var numSamples = new Array();
var tVals = new Array();
var vVals = new Array();
var maxT=-1e9;
var minT=1e9;
var maxV=-1e9;
var minV=1e9;


/**
 * Parses the XML
 * @param {String} filename    The name of the XML file
 */
function parseXmlEvent(filename) {
    //Load the XML file
    var xmlDoc = "";
    xmlDoc = loadXMLDoc(filename);
 
    //create data for the y-axis
    runNumber = xmlDoc.getElementsByTagName("run")[0].childNodes[0].nodeValue;
    eventNumber = xmlDoc.getElementsByTagName("eventNum")[0].childNodes[0].nodeValue;
    eventTime = xmlDoc.getElementsByTagName("time")[0].childNodes[0].nodeValue;
    numChannels = xmlDoc.getElementsByTagName("numChannels")[0].childNodes[0].nodeValue;

    var channelList = xmlDoc.getElementsByTagName("channel");
    for(var i=0; i < channelList.length; i++) {
	numSamples[i]=channelList[i].getElementsByTagName("numSamples")[0].childNodes[0].nodeValue;
	var tString=channelList[i].getElementsByTagName("tVals")[0].childNodes[0].nodeValue;
	tVals[i]=tString.splitCSV();
	var thisMaxT=Math.max.apply(null,tVals[i]);
	var thisMinT=Math.min.apply(null,tVals[i]);
	if(thisMaxT>maxT) maxT=thisMaxT;
	if(thisMinT<minT) minT=thisMinT;
	
	var vString=channelList[i].getElementsByTagName("vVals")[0].childNodes[0].nodeValue;
	vVals[i]=vString.splitCSV();
	var thisMaxV=Math.max.apply(null,vVals[i]);
	var thisMinV=Math.min.apply(null,vVals[i]);
	if(thisMaxV>maxV) maxV=thisMaxV;
	if(thisMinV<minV) minV=thisMinV;
    }

}


/**
 * draws the graph
 */
function drawOneChannel() {
    //find the canvas element
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    ctx.canvas.width  = 90*window.innerWidth/100;
    ctx.canvas.height = 90*window.innerHeight/100;
    //check width and height
    var width = canvas.width;
    var height = canvas.height;
    ctx.fillText(runNumber,20,20);
    ctx.fillText(eventNumber,20,30);
    ctx.fillText(eventTime,20,40);
    ctx.fillText(numChannels,20,50);
    ctx.fillText(minT,20,60);
    ctx.fillText(maxT,60,60);
    ctx.fillText(minV,20,70);
    ctx.fillText(maxV,60,70);
//    ctx.fillText(vVals[0].length,20,70);
    var chan=0;    
    var urlVars=getUrlVars();
    if(urlVars["chan"]>0) 
	chan=urlVars["chan"]

    ctx.fillText(chan,60,80);


    var myGraph = new Graph({
        canvas: canvas,
        minX: minT-10,
        minY: minV-10,
        maxX: maxT+10,
        maxY: maxV+10
    });

    myGraph.drawArrays(tVals[chan],vVals[chan],"green",2);

}