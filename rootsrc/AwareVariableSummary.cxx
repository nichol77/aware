////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////// Simple Class to hold the summary information about each     /////////
//////  variable                                                   /////////
//////                                                             /////////
////// r.nichol@ucl.ac.uk --- December 2012                        /////////
////////////////////////////////////////////////////////////////////////////

#include "AwareVariableSummary.h"

AwareVariableSummary::AwareVariableSummary()
  :firstTimeStamp(0,0),lastTimeStamp(0,0)
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
  
  //Now we do our five minutes average
  UInt_t minuteIndex=timeStamp.GetSec()/300;
  std::map <UInt_t,AwareVariable>::iterator it=timeMap.find(minuteIndex);
  if(it!=timeMap.end()) {
    //Got this one already
    it->second.addValue(variable);
  }
  else {
    //New entry for the map
    AwareVariable newPoint(minuteIndex*300,300);
    newPoint.addValue(variable);
    timeMap[minuteIndex]=newPoint;
  }
  
}
