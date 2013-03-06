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
  static void updateRunList(char *stationName, int runNumber, int dateInt);
  static void updateDateList(char *stationName, int runNumber, int dateInt);
  

};

#endif //AWARERUNDATABASE
