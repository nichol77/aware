////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////// Simple Class to hold the summary information about each     /////////
//////  variable                                                   /////////
//////                                                             /////////
////// r.nichol@ucl.ac.uk --- December 2012                        /////////
////////////////////////////////////////////////////////////////////////////

#ifndef AWAREVARIABLE
#define AWAREVARIABLE

#include "TMath.h"
#include "TTimeStamp.h"

class AwareVariable
{
 public :
  AwareVariable(UInt_t startTime=0, UInt_t duration=0);

  void addValue(Double_t variable);

  const char *getStartTimeString() {
    TTimeStamp startTimeStamp(fStartTime); 
    return startTimeStamp.AsString("sl");
  }

  Int_t getNumEnts() {return numEnts;}
  Double_t getMean() {return mean/numEnts;}
  Double_t getStdDev()  {return TMath::Sqrt((meanSq/numEnts)-TMath::Power(mean/numEnts,2));}
  UInt_t getDuration() {return fDuration;}
  

 private : 
  UInt_t fStartTime;
  UInt_t fDuration;
  Double_t mean;
  Double_t meanSq;
  Int_t numEnts;

};

#endif //AWAREVARIABLE
