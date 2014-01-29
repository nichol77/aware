
/**
 * Return the std deviation of the array
 *
 */
function getStdDev(ary,mean) {
    var length=ary.length;
    var sumSquares=0;
    var sumVals=0;
    for(var i=0;i<length;i++) {
	sumSquares+=(ary[i][1]-mean)*(ary[i][1]-mean);
	sumVals+=(ary[i][1]-mean);

    }
    //    $("#debugContainer").append("<p>Sums "+sumVals*sumVals+" "+sumSquares+"<\p>");
    return Math.sqrt((sumSquares-(sumVals*sumVals)) / ary.length);
}


/**
 * Return the correlation of two vectors
 *
 */
function makeCorrelation(aArray,bArray,minDelta,maxDelta) {
//assume for now that the two input arrays have the same sample spacing
    var numPointsA=aArray.length;
    var numPointsB=bArray.length;
    var numPoints=numPointsA;
    if(numPointsB<numPointsA) numPoints=numPointsB;
    var maxOverlapIndex=numPoints-1;

    //Now zero mean
    var waveMeanA=0;
    var waveMeanB=0;
    for(var i=0;i<numPoints;i++) {
	waveMeanA+=aArray[i][1];
	waveMeanB+=bArray[i][1];
    }
    waveMeanA/=numPoints;
    waveMeanB/=numPoints;

    var stdDevA=getStdDev(aArray,waveMeanA);
    var stdDevB=getStdDev(bArray,waveMeanB);

    var denom=stdDevA*stdDevB*Math.sqrt(numPoints);
    //    $("#debugContainer").append("<p>"+denom+"<\p");
    var deltaCable=aArray[0][0]-bArray[0][0];
    var deltaT=aArray[1][0]-aArray[0][0];
    var maxCorPoints=Math.floor((2*numPoints)-1);
    var minDtIndex=maxOverlapIndex+Math.floor((minDelta-deltaCable)/deltaT);
    if(minDtIndex<0) minDtIndex=0;
    var maxDtIndex=maxOverlapIndex+Math.ceil((maxDelta-deltaCable)/deltaT);
    if(maxDtIndex<0) maxDtIndex=0;
    if(maxDtIndex>=maxCorPoints) maxDtIndex=Math.ceil(maxCorPoints-1);
    




    var numCorPoints=Math.round(1+maxDtIndex-minDtIndex)    
    var returnArray = new Array();
    var retIndex=0;
    for(var i=minDtIndex;i<=maxDtIndex;i++) {
	var correlationVal=0;
	var firstIndex=i;
	var secondIndex=numPoints-1;
	if(firstIndex>numPoints-1) {
	    var offset=firstIndex-(numPoints-1);
	    firstIndex=numPoints-1;
	    secondIndex-=offset;
	}
	
	var numSamples=0;
	for(;firstIndex>=0 && secondIndex>=0;firstIndex--) {
	    correlationVal+=(aArray[firstIndex][1]-waveMeanA)*(bArray[secondIndex][1]-waveMeanB);
	//   if(retIndex==423) {
// 	      $("#debugContainer").append("<p>"+((deltaT*(i-maxOverlapIndex))+deltaCable)+" - "+firstIndex+" - "+secondIndex+" - "+(aArray[firstIndex][1]-waveMeanA)+" - "+(bArray[secondIndex][1]-waveMeanB)+" -- "+(aArray[firstIndex][0]-bArray[secondIndex][0])+"</p>");
// 	  }
        numSamples++;
        secondIndex--;
      }
      correlationVal/=(denom*Math.sqrt(numSamples));
      returnArray.push([(deltaT*(i-maxOverlapIndex))+deltaCable,correlationVal]);
      retIndex++;
    }
    return returnArray;
}


/**
 * Calculates the corrleation of two waveforms and then adds them together coherently.
 *
 */
function addCoherently(csumArray,otherArray,debugFlag) {
    var numPoints=csumArray.length;

    var corrArray=makeCorrelation(csumArray,
				  otherArray,
				  -1000,1000);


    //    $("#debugContainer").append("<p>awareCorrelate.js corrArray.length "+corrArray.length+"</p>");

    var maxCor=-1*Number.MAX_VALUE;
    var maxCorTime=0;
    var maxCorIndex=0;
    var zeroTime=Number.MAX_VALUE;
    var zeroIndex=0;
    var cableDiff=csumArray[0][0]-otherArray[0][0];
    //    $("#debugContainer").append("<p>cableDiff: "+cableDiff+" -- "+csumArray[0][0]+" -- "+otherArray[0][0]+"</p>");
    for(var i=0;i<corrArray.length;i++) {
	//	$("#debugContainer").append("<p>"+csumArray[i][0]+" -- "+csumArray[i][1]+"</p>");
	if(Math.abs(corrArray[i][0]-cableDiff)<zeroTime) {
	    zeroTime=Math.abs(corrArray[i][0]-cableDiff);
	    zeroIndex=i;
	}
	if(corrArray[i][1]>maxCor) {
	    maxCor=corrArray[i][1];
	    maxCorIndex=i;
	    maxCorTime=corrArray[i][0];
	}
    }
    var offset=maxCorIndex-zeroIndex;

    //    $("#debugContainer").append("<p>"+zeroIndex+" "+maxCorIndex+" "+offset+" "+maxCorTime+" "+maxCor+"</p>");
    var info = new Object();
    info.deltaT=-1*maxCorTime;
    info.csumXCor=maxCor;
    info.offset=offset;
    for(var i=0;i<numPoints;i++) {
	if(i-offset>=0 && i-offset<numPoints) {
	    csumArray[i][1]+=otherArray[i-offset][1];
	}
    }
    return info;    
}


/**
 * Calculates the corrleation of two waveforms and then adds them together coherently.
 *
 */
function subtractWithOffset(csumArray,otherArray,offset) {
    var numPoints=csumArray.length
    for(var i=0;i<numPoints;i++) {
	if(i-offset>=0 && i-offset<numPoints) {
	    csumArray[i][1]-=otherArray[i-offset][1];
	}
    }
}

function crossProduct(n1, n2) {
    var cross=[(n1[1]*n2[2]-n1[2]*n2[1]),(n1[2]*n2[0]-n1[0]*n2[2]),(n1[0]*n2[1]-n1[1]*n2[0])];
    return cross;
}

function dotProduct(n1, n2) {
    var dot=n1[0]*n2[0]+n1[1]*n2[1]+n1[2]*n2[2];
    return dot;
}