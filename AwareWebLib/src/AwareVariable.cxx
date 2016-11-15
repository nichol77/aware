////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////// Simple Class to hold the summary information about each     /////////
//////  variable                                                   /////////
//////                                                             /////////
////// r.nichol@ucl.ac.uk --- December 2012                        /////////
////////////////////////////////////////////////////////////////////////////

#include <iostream>
#include "AwareVariable.h"

AwareVariable::AwareVariable(UInt_t startTime, UInt_t duration,AwareAverageType::AwareAverageType_t avgType, Bool_t hasVoidValue, Double_t voidValue) 
   :fStartTime(startTime),fDuration(duration),mean(0),meanSq(0),fAvgType(avgType),fHasVoidValue(hasVoidValue),fVoidValue(voidValue),numEnts(0)
{

}
 
Double_t AwareVariable::getMean() {
   if(numEnts<1) {
      if(fHasVoidValue) return fVoidValue;
      return 0;
   }
   Double_t tempMean=mean/numEnts;
   if(fAvgType==AwareAverageType::kAngleDegree) {
      if(tempMean<0) tempMean+=360;
      if(tempMean>360) tempMean-=360;
   }
   return tempMean;
}

void AwareVariable::addValue(Double_t variable) {
   if(fHasVoidValue && TMath::Abs(variable-fVoidValue)<1e-6) return;
   //For now try and just avoid the case of void values.... will result in difficulties down the line
   if(fAvgType==AwareAverageType::kAngleDegree) {
      //Then 0-360
      if(numEnts>0) {
	 Double_t tempMean=mean/numEnts;
	 if(TMath::Abs(variable+360 - tempMean)<TMath::Abs(variable-tempMean)) variable+=360;
	 if(TMath::Abs(variable-360 - tempMean)<TMath::Abs(variable-tempMean)) variable-=360;
      }          
      
   }
   mean+=variable;
   meanSq+=variable*variable;
   numEnts++;

   
}

Double_t AwareVariable::getStdDev()  {
   


  if((meanSq/numEnts)<TMath::Power(mean/numEnts,2))
    return 0;
  Double_t stdDev=TMath::Sqrt((meanSq/numEnts)-TMath::Power(mean/numEnts,2));
  
  //  std::cout << getMean() << "\t" << stdDev  << "\n";
  
  if(TMath::IsNaN(stdDev))
    return 0;
  return stdDev;
  
}
