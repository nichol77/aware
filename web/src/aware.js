


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
var instrumentName;
var runNumber;
var otherRun;
var otherEvent;
var otherFile
var otherNum;
var eventNumber;
var eventTime;
var triggerTime;
var numChannels;
var numSamples = new Array();
var tVals = new Array();
var vVals = new Array();
var maxT=-1e9;
var minT=1e9;
var maxV=-1e9;
var minV=1e9;

function loadXmlEventFromRunEvent(run,event) {	
	xmlfile=getXmlFileFromRunEvent(run,event);
	parseXmlEvent(xmlfile);
}

function loadXmlEvent() {
    var xmlfile="foo.xml";    
    var urlVars=getUrlVars();

    otherRun=urlVars["run"];
    otherEvent=urlVars["event"];
    if(otherRun>0 && otherEvent>0) {
	xmlfile=getXmlFileFromRunEvent(otherRun,otherEvent);
	otherFile=xmlfile;
    }	
    else {
   	 xmlfile=urlVars["xmlfile"]
    }

    
    parseXmlEvent(xmlfile);

}

var thisYear;
var thisDateCode;



/**
 * Parses the XML
 * @param {String} filename    The name of the XML file
 */
function getXmlFileFromRunEvent(run,event) {
    //Load the XML file
    var dbFile="db/runList.xml";
    var xmlDoc = "";
    xmlDoc = loadXMLDoc(dbFile);
 
  //Find run in runList

    var runList = xmlDoc.getElementsByTagName("run");
    otherNum=runList.length;
    for(var i=0; i < runList.length; i++) {
	var thisRun=runList[i].getElementsByTagName("number")[0].childNodes[0].nodeValue;
	if(run==thisRun) {
		thisYear=runList[i].getElementsByTagName("year")[0].childNodes[0].nodeValue;
		thisDateCode=runList[i].getElementsByTagName("date")[0].childNodes[0].nodeValue;
//		break;
	}
    }
    var fileName="output/"+thisYear+"/"+thisDateCode+"/run"+run+"/event"+event+".xml";
    return fileName;
}



/**
 * Parses the XML
 * @param {String} filename    The name of the XML file
 */
function parseXmlEvent(filename) {
    //Load the XML file
    thisFile=filename;
    var xmlDoc = "";
    xmlDoc = loadXMLDoc(filename);
 
    //create data for the y-axis
    instrumentName = xmlDoc.getElementsByTagName("instrument")[0].childNodes[0].nodeValue;
    runNumber = xmlDoc.getElementsByTagName("run")[0].childNodes[0].nodeValue;
    eventNumber = xmlDoc.getElementsByTagName("eventNum")[0].childNodes[0].nodeValue;
    eventTime = xmlDoc.getElementsByTagName("time")[0].childNodes[0].nodeValue;
    triggerTime = xmlDoc.getElementsByTagName("triggerTime")[0].childNodes[0].nodeValue;
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
function drawOneChannel(canName,allowZoom) {
    var canTitle= document.getElementById("canTitle");
    var ctx = canTitle.getContext("2d");
    ctx.canvas.width=window.innerWidth;
    ctx.canvas.height=10*window.innerHeight/100;
    var titleOffset=ctx.canvas.height/4;;
    var fontSize=ctx.canvas.height/5;;
    ctx.font=fontSize+"px Arial";
    ctx.fillText(instrumentName,titleOffset,titleOffset);
    ctx.fillText("Run: "+runNumber,titleOffset,2*titleOffset);
    ctx.fillText("Event: "+eventNumber,titleOffset,3*titleOffset);
    ctx.fillText("Time: "+eventTime,7*titleOffset,titleOffset); 
    ctx.fillText("Trigger: "+triggerTime+"s",7*titleOffset,2*titleOffset); 


    var chan=0;    
    var urlVars=getUrlVars();
    if(urlVars["chan"]>0) 
	chan=urlVars["chan"]

    ctx.fillText("Channel: "+chan,7*titleOffset,3*titleOffset); 



    drawThisChannel(chan,canName,allowZoom,90,90);
}


function drawAllChannels(allowZoom,xScale,yScale) {
    var canTitle= document.getElementById("canTitle");
    var ctx = canTitle.getContext("2d");
    ctx.canvas.width=window.innerWidth;
    ctx.canvas.height=10*window.innerHeight/100;
    var titleOffset=ctx.canvas.height/4;;
    var fontSize=ctx.canvas.height/5;;
    ctx.font=fontSize+"px Arial";
    ctx.fillText(instrumentName,titleOffset,titleOffset);
    ctx.fillText("Run: "+runNumber,titleOffset,2*titleOffset);
    ctx.fillText("Event: "+eventNumber,titleOffset,3*titleOffset);
    ctx.fillText("Time: "+eventTime,6*titleOffset,titleOffset); 
    ctx.fillText("Trigger: "+triggerTime+"s",6*titleOffset,2*titleOffset); 
//    ctx.fillText("Other file: "+otherFile,16*titleOffset,2*titleOffset);
//    ctx.fillText("This file: "+thisFile,16*titleOffset,titleOffset);

    for(var chan=0;chan<16;chan++) {
	var canName="can"+chan;
	drawThisChannel(chan,canName,allowZoom,xScale,yScale);
    }   
}


function drawThisChannel(chan,canName,allowZoom,xScale,yScale) {

    //find the canvas element
    canvas = document.getElementById(canName);
    ctx = canvas.getContext("2d");
    trackTransforms(ctx);


    //find the canvas element
    canvas = document.getElementById(canName);
    ctx = canvas.getContext("2d");
    ctx.canvas.width  = xScale*window.innerWidth/100;
    ctx.canvas.height = yScale*window.innerHeight/100;

    //Some drawing globals
    var canvas;
    var ctx;
    var lastX,lastY;
    var currentX,currentY;
    var amountScaled;
    var legendText=Math.round(ctx.canvas.height/30);


    redraw(chan);

    if(allowZoom) {
    lastX=canvas.width/2, lastY=canvas.height/2;
    var dragStart,dragged;
    canvas.addEventListener('mousedown',function(evt){
	document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
	lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
	lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
	dragStart = ctx.transformedPoint(lastX,lastY);
	dragged = false;
    },false);

    canvas.addEventListener('mousemove',function(evt){
	if(!evt.shiftKey) {
	    lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
	    lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
	    dragged = true;
	    if (dragStart){
		var pt = ctx.transformedPoint(lastX,lastY);
		ctx.translate(pt.x-dragStart.x,pt.y-dragStart.y);
		redraw(chan);
	    }
	}
    },false);

    canvas.addEventListener('mouseup',function(evt){
	if(evt.shiftKey && dragStart) {
	    currentX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
	    currentY = evt.offsetY || (evt.pageY - canvas.offsetTop);
	    var topY=currentY;
	    var botY=lastY;
	    var topX=currentX;
	    var botX=lastX;
	    if(lastY<topY) {
		topY=lastY;
		botY=currentY;
	    }
	    if(lastX<topX) {
		topX=lastX;
		botX=currentX;
	    }
	    var midY=0.5*(topY+botY);
	    var midX=0.5*(topX+botX);
	    var pt = ctx.transformedPoint(midX,midY);
	    ctx.translate(pt.x,pt.y);
	    var factorX=canvas.width/(topX-botX);
	    var factorY=canvas.height/(topY-botY);
	    ctx.scale(factorX,factorY);
	    ctx.translate(-pt.x,-pt.y);
	    redraw(chan);
	    

	}
	dragStart = null;
	if (!dragged) zoom(evt.shiftKey ? -1 : 1 );
	redraw(chan);
    },false);
    
    var scaleFactor = 1.1;
    var zoom = function(clicks){
	var pt = ctx.transformedPoint(lastX,lastY);
	ctx.translate(pt.x,pt.y);
	var factor = Math.pow(scaleFactor,clicks);
	ctx.scale(factor,factor);
	amountScaled=factor;
	ctx.translate(-pt.x,-pt.y);
	redraw(chan);
    }
    
    var handleScroll = function(evt){
	var delta = evt.wheelDelta ? evt.wheelDelta/40 : evt.detail ? -evt.detail : 0;
	if (delta) zoom(delta);
	return evt.preventDefault() && false;
		};
    canvas.addEventListener('DOMMouseScroll',handleScroll,false);
    canvas.addEventListener('mousewheel',handleScroll,false);
    }


function redraw(chan) {


    // Clear the entire canvas
    var p1 = ctx.transformedPoint(0,0);
    var p2 = ctx.transformedPoint(canvas.width,canvas.height);
    ctx.clearRect(p1.x,p1.y,p2.x-p1.x,p2.y-p1.y);

    //check width and height
    var width = canvas.width;
    var height = canvas.height;


    if(maxV>-1*minV) {
	minV=-1*maxV;
    }
    else {
	maxV=-1*minV;
    }

    var myGraph = new Graph({
        canvas: canvas,
        minX: minT-10,
        minY: minV-10,
        maxX: maxT+10,
        maxY: maxV+10
    });

    myGraph.drawArrays(tVals[chan],vVals[chan],"green",1);
}

function trackTransforms(ctx){
    var svg = document.createElementNS("http://www.w3.org/2000/svg",'svg');
    var xform = svg.createSVGMatrix();
    ctx.getTransform = function(){ return xform; };
    
    var savedTransforms = [];
    var save = ctx.save;
    ctx.save = function(){
	savedTransforms.push(xform.translate(0,0));
	return save.call(ctx);
    };
    var restore = ctx.restore;
    ctx.restore = function(){
	xform = savedTransforms.pop();
	return restore.call(ctx);
    };
    
    var scale = ctx.scale;
    ctx.scale = function(sx,sy){
	xform = xform.scaleNonUniform(sx,sy);
	return scale.call(ctx,sx,sy);
    };
    var rotate = ctx.rotate;
    ctx.rotate = function(radians){
	xform = xform.rotate(radians*180/Math.PI);
	return rotate.call(ctx,radians);
    };
    var translate = ctx.translate;
    ctx.translate = function(dx,dy){
	xform = xform.translate(dx,dy);
	return translate.call(ctx,dx,dy);
    };
    var transform = ctx.transform;
    ctx.transform = function(a,b,c,d,e,f){
	var m2 = svg.createSVGMatrix();
	m2.a=a; m2.b=b; m2.c=c; m2.d=d; m2.e=e; m2.f=f;
	xform = xform.multiply(m2);
	return transform.call(ctx,a,b,c,d,e,f);
    };
    var setTransform = ctx.setTransform;
    ctx.setTransform = function(a,b,c,d,e,f){
	xform.a = a;
	xform.b = b;
	xform.c = c;
	xform.d = d;
	xform.e = e;
	xform.f = f;
	return setTransform.call(ctx,a,b,c,d,e,f);
    };
    var pt  = svg.createSVGPoint();
    ctx.transformedPoint = function(x,y){
	pt.x=x; pt.y=y;
	return pt.matrixTransform(xform.inverse());
    }
}

}

