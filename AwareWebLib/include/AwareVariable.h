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


namespace AwareAverageType {
   typedef enum EAwareAverageType {
      kDefault,
      kAngleDegree,
      kSampleNotAverage
   } AwareAverageType_t;
}

class AwareVariable
{
 public :
   AwareVariable(UInt_t startTime=0, UInt_t duration=0, AwareAverageType::AwareAverageType_t avgType=AwareAverageType::kDefault, Bool_t hasVoidValue=kFALSE, Double_t voidValue=-700);
   
   void addValue(Double_t variable);
   
   const char *getStartTimeString() {
      TTimeStamp startTimeStamp(fStartTime); 
      return startTimeStamp.AsString("sl");
   }
   
   Double_t getStdDev();
   UInt_t getStartTime() {return fStartTime;}
   Int_t getNumEnts() {return numEnts;}
   Double_t getMean() ;
   UInt_t getDuration() {return fDuration;}
   
   

   
 private : 
   UInt_t fStartTime;
   UInt_t fDuration;
   Double_t mean;
   Double_t meanSq;
   AwareAverageType::AwareAverageType_t fAvgType;
   Bool_t fHasVoidValue;
   Double_t fVoidValue;
   Int_t numEnts;

};

#endif //AWAREVARIABLE
