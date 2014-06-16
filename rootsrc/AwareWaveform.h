////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////// Simple Class to hold AWARE waveforms                        /////////
//////                                                             /////////
////// r.nichol@ucl.ac.uk --- October 2013                        /////////
////////////////////////////////////////////////////////////////////////////

#ifndef AWAREWAVEFORMEVENTFILEMAKER
#define AWAREWAVEFORMEVENTFILEMAKER

#include "TNamed.h"
#include "TGraph.h"
#include "TTimeStamp.h"
#include "AwareVariableSummary.h"

#include <fstream>
#include <map>



class AwareWaveform
{
 public :
  AwareWaveform(TGraph *grChannel, Int_t grId, const char *grLabel);

  //Could do this with templates but can't be bothered
  void addVariableToChannel(const char *varKey, const char *varValue);
  void addVariableToChannel(const char *varKey, double varValue);
  void addVariableToChannel(const char *varKey, int varValue);

  

 private :

  Int_t fId;
  TGraph *fGraph;
  std::string fLabel;

  //Maps to hold the various JSON thingies
  std::map<std::string, std::string> fVariableMap;
  std::map<Int_t,TGraph *> fGraphMap;
  std::map<Int_t,std::string> fGraphLabelMap;


};

#endif //AWAREWAVEFORMEVENTFILEMAKER
