function DataPoint(name,mean,stdDev,numEnts)
{
this.name=name;
this.mean=mean;
this.stdDev=stdDev;
this.numEnts=numEnts;
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

var varList = new Array();
var stackVarList = new Array();
var stackNameList = new Array();



function loadXmlHk() {
    var xmlfile="output/2012/1207/run1200/sensorHkSummary.xml";    
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
//    document.write(x.nodeName);
//    document.write(" = ");	
//    document.write(x.childNodes[0].nodeValue);
 y=get_nextsibling(x);		
    for(var i=0; i< 100; i++) {
    if(y==null) break;	
       atts=y.attributes;
//       document.write(y.nodeName);
//       document.write(" num atts = " + atts.length);
       if(atts.length==0) {
//       document.write(" mean = ");	
//       document.write(y.getElementsByTagName("mean")[0].childNodes[0].nodeValue);
//       document.write(" stdDev = ");	
//       document.write(y.getElementsByTagName("stdDev")[0].childNodes[0].nodeValue);
//       document.write(" numEnts = ");	
//       document.write(y.getElementsByTagName("numEnts")[0].childNodes[0].nodeValue);
       var dp = new DataPoint(y.nodeName,y.getElementsByTagName("mean")[0].childNodes[0].nodeValue,y.getElementsByTagName("stdDev")[0].childNodes[0].nodeValue,y.getElementsByTagName("numEnts")[0].childNodes[0].nodeValue);
       varList.push(dp);
       }
       else {
       	document.write("<br>");	
	 document.write(y.nodeName+" "+atts[0].name+" "+atts[0].value);
       	document.write("<br>");	
	z=y.firstChild;	
	for(var j=0;j<100;j++) {
	     z=get_nextsibling(z);
             if(z==null) break;
	     document.write(z.nodeName);
	}
       }
	
	
       document.write("<br>");
document.write("varList.length = "+varList.length);

      y=get_nextsibling(y);
   }
}

