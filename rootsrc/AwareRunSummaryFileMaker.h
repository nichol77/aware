//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
////// Simple Class to handle the making of AWARE Summary JSON Files//////////
//////                                                              //////////
////// r.nichol@ucl.ac.uk --- December 2012                         //////////
//////////////////////////////////////////////////////////////////////////////

#ifndef AWARERUNSUMMARYFILEMAKER
#define AWARERUNSUMMARYFILEMAKER

#include "TNamed.h"
#include "TTimeStamp.h"
#include "AwareVariableSummary.h"
#include "AwareVariable.h"

#include <map>



class AwareRunSummaryFileMaker 
{
 public :
   AwareRunSummaryFileMaker(Int_t runNumber, const char *instrumentName, Int_t numSecondsPerPoint=300);

  void addVariablePoint(const char *elName, const char *label, TTimeStamp timeStamp, Double_t variable,  
			AwareAverageType::AwareAverageType_t avgType=AwareAverageType::kDefault, 
			Bool_t hasVoidValue=kFALSE, Double_t voidValue=-600 );


  void writeFullJSONFiles(const char *jsonDir, const char *filePrefix);
    void writeSingleFullJSONFile(const char *jsonDir, const char *filePrefix);

    void writeSummaryJSONFile(const char *jsonName);
  void writeTimeJSONFile(const char *jsonName);



 private :

  //Data storge
  Int_t fRun;
  Int_t fNumSecondsPerPoint;
  std::string fInstrumentName;
  std::map<std::string,AwareVariableSummary> summaryMap;
  std::map<std::string,std::string> fLabelMap;
  
  std::map<Double_t, std::map<std::string, Double_t> > fRawMap;


};

#endif //AWARERUNSUMMARYFILEMAKER
