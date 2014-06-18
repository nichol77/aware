////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////// Simple Class to handle the making of AWARE Event Database files////////
//////                                                             /////////
////// r.nichol@ucl.ac.uk --- December 2012                        /////////
////////////////////////////////////////////////////////////////////////////

#ifndef AWAREEVENTDATABASE
#define AWAREEVENTDATABASE

#include "TNamed.h"
#include "TTimeStamp.h"
#include "AwareVariableSummary.h"

#include <set>



class AwareEventDatabase 
{
 public :
  AwareEventDatabase(char *outputDir,char *instrumentName,int dateInt,int run);
  void addEventToList(int eventNumber);
  void writeEventList(char *fileName=0);
   
 private:
   std::string fOutputDirName;
   std::string fInstrumentName;
   int fDateInt;
   int fRun;
   std::set<int> fEventList;
   
};

#endif //AWAREEVENTDATABASE
