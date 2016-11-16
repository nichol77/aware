////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////// Simple Class to hold the summary information about each     /////////
//////  variable                                                   /////////
//////                                                             /////////
////// r.nichol@ucl.ac.uk --- December 2012                        /////////
////////////////////////////////////////////////////////////////////////////

#include "AwareVariableSummary.h"

AwareVariableSummary::AwareVariableSummary(Int_t numSecondsPerPoint,AwareAverageType::AwareAverageType_t avgType, Bool_t hasVoidValue, Double_t voidValue)
   :fNumSecondsPerPoint(numSecondsPerPoint),firstTimeStamp(0,0),lastTimeStamp(0,0),fAvgType(avgType),fHasVoidValue(hasVoidValue),fVoidValue(voidValue)
{


}


void AwareVariableSummary::addDataPoint(TTimeStamp timeStamp,Double_t variable) 
{
  if(runValue.getNumEnts()==0) {
    firstTimeStamp=timeStamp;
  }

  //First check whether this is the first or last time
  if(timeStamp<firstTimeStamp) {
    firstTimeStamp=timeStamp;
  }
  if(timeStamp>lastTimeStamp) {
    lastTimeStamp=timeStamp;
  }

  //Now add the value to the run averaged quantity
  runValue.addValue(variable);
  
  //Now we do our N seconds average
  UInt_t minuteIndex=timeStamp.GetSec()/fNumSecondsPerPoint;
  std::map <UInt_t,AwareVariable>::iterator it=timeMap.find(minuteIndex);
  if(it!=timeMap.end()) {
    //Got this one already
    it->second.addValue(variable);
  }
  else {
     //New entry for the map
     AwareVariable newPoint(minuteIndex*fNumSecondsPerPoint,fNumSecondsPerPoint,fAvgType,fHasVoidValue,fVoidValue);
     newPoint.addValue(variable);
     timeMap[minuteIndex]=newPoint;
  }
  
}
