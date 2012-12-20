////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////// Simple Class to handle the making of AWARE Summary XML Files/////////
//////                                                             /////////
////// r.nichol@ucl.ac.uk --- December 2012                        /////////
////////////////////////////////////////////////////////////////////////////

#ifndef AWARERUNSUMMARYFILEMAKER
#define AWARERUNSUMMARYFILEMAKER

#include "TNamed.h"
#include "TTimeStamp.h"
#include "AwareVariableSummary.h"

#include <map>



class AwareRunSummaryFileMaker 
{
 public :
  AwareRunSummaryFileMaker(Int_t runNumber, char *stationName);

  void addVariablePoint(const char *elName, TTimeStamp timeStamp, Double_t variable);

  void writeSummaryXMLFile(const char *xmlName);
  void writeTimeXMLFile(const char *xmlName);

 private :
  Int_t fRun;
  std::string fStationName;
  std::map<std::string,AwareVariableSummary> summaryMap;

};

#endif //AWARERUNSUMMARYFILEMAKER
