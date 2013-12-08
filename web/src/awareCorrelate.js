
/**
 * Return the std deviation of the array
 *
 */
function getStdDev(ary) {
    var length=ary.length;
    var sumSquares=0;
    var sumVals=0;
    for(var i=0;i<length;i++) {
	sumSquares+=ary[i][1]*ary[i][1];
	sumVals+=ary[i][1];

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
    var denom=getStdDev(aArray)*getStdDev(bArray)*Math.sqrt(numPoints);
    //    $("#debugContainer").append("<p>"+getStdDev(aArray)+"<\p");
    var deltaCable=aArray[0][0]-bArray[0][0];
    var deltaT=aArray[1][0]-aArray[0][0];
    var maxCorPoints=Math.floor((2*numPoints)-1);
    var minDtIndex=maxOverlapIndex+Math.floor((minDelta-deltaCable)/deltaT);
    if(minDtIndex<0) minDtIndex=0;
    var maxDtIndex=maxOverlapIndex+Math.ceil((maxDelta-deltaCable)/deltaT);
    if(maxDtIndex<0) maxDtIndex=0;
    if(maxDtIndex>=maxCorPoints) maxDtIndex=Math.ceil(maxCorPoints-1);
    

    //Now zero mean
    var waveMeanA=0;
    var waveMeanB=0;
    for(var i=0;i<numPoints;i++) {
	waveMeanA+=aArray[i][1];
	waveMeanB+=bArray[i][1];
    }
    waveMeanA/=numPoints;
    waveMeanB/=numPoints;



    var numCorPoints=Math.round(1+maxDtIndex-minDtIndex)
    var correlationArray = new Array(numCorPoints);
    var returnArray = new Array();
    
    for(var i=minDtIndex;i<=maxDtIndex;i++) {
      correlationArray[i]=0;
      var firstIndex=i;
      var secondIndex=numPoints-1;
      if(firstIndex>numPoints-1) {
        var offset=firstIndex-(numPoints-1);
        firstIndex=numPoints-1;
        secondIndex-=offset;
      }

      var numSamples=0;
      for(;firstIndex>=0 && secondIndex>=0;firstIndex--) {
	  correlationArray[i]+=(aArray[firstIndex][1]-waveMeanA)*(bArray[secondIndex][1]-waveMeanB);
        numSamples++;
        secondIndex--;
      }
      correlationArray[i]/=(denom*Math.sqrt(numSamples));
      returnArray.push([(deltaT*(i-maxOverlapIndex))+deltaCable,correlationArray[i]]);
    }
    return returnArray;
}