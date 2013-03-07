////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////// Simple Class to handle the making of AWARE Event JSON Files /////////
//////                                                             /////////
////// r.nichol@ucl.ac.uk --- December 2012                        /////////
////////////////////////////////////////////////////////////////////////////

#ifndef AWAREWAVEFORMEVENTFILEMAKER
#define AWAREWAVEFORMEVENTFILEMAKER

#include "TNamed.h"
#include "TGraph.h"
#include "TTimeStamp.h"
#include "AwareVariableSummary.h"

#include <fstream>
#include <map>



class AwareWaveformEventFileMaker 
{
 public :
  AwareWaveformEventFileMaker(Int_t runNumber, Int_t eventNumber, const char *stationName, const char *jsonName);

  //Could do this with templates but can't be bothered
  void addVariableToEvent(const char *varKey, const char *varValue);
  void addVariableToEvent(const char *varKey, double varValue);
  void addVariableToEvent(const char *varKey, int varValue);
  void addChannelToFile(TGraph *grChannel, Int_t grId, const char *grLabel);

  void writeFile();

 private :

  //Data storge
  Int_t fRun;
  Int_t fEventNumber;
  std::string fStationName;
  std::string fEventFilename;

  //Maps to hold the various JSON thingies
  std::map<std::string, std::string> fVariableMap;
  std::map<Int_t,TGraph *> fGraphMap;
  std::map<Int_t,std::string> fGraphLabelMap;


};

#endif //AWAREWAVEFORMEVENTFILEMAKER
