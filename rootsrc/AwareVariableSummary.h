////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////// Simple Class to hold the summary information about each     /////////
//////  variable                                                   /////////
//////                                                             /////////
////// r.nichol@ucl.ac.uk --- December 2012                        /////////
////////////////////////////////////////////////////////////////////////////

#ifndef AWAREVARIABLESUMMARY
#define AWAREVARIABLESUMMARY

#include "AwareVariable.h"
#include "TTimeStamp.h"
#include <map>

//typedef std::pair<std::string,AwareVariableSummary> variablePair;


class AwareVariableSummary
{
 public :
  AwareVariableSummary();
  void addDataPoint(TTimeStamp timeStamp, Double_t variable);

  const char *getFirstTimeString() { return firstTimeStamp.AsString("sl"); }
  Int_t getDuration() {return (lastTimeStamp.GetSec()-firstTimeStamp.GetSec());}
  Double_t getRunMean() { return runValue.getMean();}
  Double_t getRunStdDev() { return runValue.getStdDev();}
  Int_t getRunNumEnts() { return runValue.getNumEnts();}

  std::map<UInt_t,AwareVariable>::iterator timeMapBegin() {return timeMap.begin();}
  std::map<UInt_t,AwareVariable>::iterator timeMapEnd() {return timeMap.end();}
  std::map<UInt_t,AwareVariable>::iterator timeMapFind(UInt_t value) {return timeMap.find(value);}

 private :  
  TTimeStamp firstTimeStamp;
  TTimeStamp lastTimeStamp;
  AwareVariable runValue;
  std::map<UInt_t,AwareVariable> timeMap; //Point every 5 minutes

};

#endif //AWAREVARIABLESUMMARY
