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
  AwareRunSummaryFileMaker(Int_t runNumber, const char *instrumentName);

  void addVariablePoint(const char *elName, const char *label, TTimeStamp timeStamp, Double_t variable);


  void writeFullJSONFiles(const char *jsonDir, const char *filePrefix);
  void writeSummaryJSONFile(const char *jsonName);
  void writeTimeJSONFile(const char *jsonName);



 private :

  //Data storge
  Int_t fRun;
  std::string fInstrumentName;
  std::map<std::string,AwareVariableSummary> summaryMap;
  std::map<std::string,std::string> fLabelMap;
  
  std::map<UInt_t, std::map<std::string, Double_t> > fRawMap;


};

#endif //AWARERUNSUMMARYFILEMAKER
