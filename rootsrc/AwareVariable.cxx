////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////// Simple Class to hold the summary information about each     /////////
//////  variable                                                   /////////
//////                                                             /////////
////// r.nichol@ucl.ac.uk --- December 2012                        /////////
////////////////////////////////////////////////////////////////////////////

#include <iostream>
#include "AwareVariable.h"

AwareVariable::AwareVariable(UInt_t startTime, UInt_t duration) 
  :fStartTime(startTime),fDuration(duration),mean(0),meanSq(0),numEnts(0)
{

}
 
void AwareVariable::addValue(Double_t variable) {
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
