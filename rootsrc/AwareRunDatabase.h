////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////// Simple Class to handle the making of AWARE Run Database files////////
//////                                                             /////////
////// r.nichol@ucl.ac.uk --- December 2012                        /////////
////////////////////////////////////////////////////////////////////////////

#ifndef AWARERUNDATABASE
#define AWARERUNDATABASE

#include "TNamed.h"
#include "TTimeStamp.h"
#include "AwareVariableSummary.h"

#include <map>



class AwareRunDatabase 
{
 public :
   AwareRunDatabase(char *outputDir,char *instrumentName);
   void addRunDateToMap(int runNumber, int dateInt);
   void writeRunAndDateList();
   
   
   static void updateRunList(char *outputDir,char *instrumentName, int runNumber, int dateInt);
   static void updateDateList(char *outputDir,char *instrumentName, int runNumber, int dateInt);
   static int  updateTouchFile(const char *touchFile, Int_t run, UInt_t unixTime);
   static void touchFile(const char *touchFile);
   
 private:
   std::string fOutputDirName;
   std::string fInstrumentName;
   std::map<int, int> fRunDateMap;
   std::map<int, std::map<int,int> > fDateRunMap;
   
};

#endif //AWARERUNDATABASE
