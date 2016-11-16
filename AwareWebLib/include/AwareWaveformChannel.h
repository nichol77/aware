////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////// Simple Class to hold AWARE waveforms                        /////////
//////                                                             /////////
////// r.nichol@ucl.ac.uk --- October 2013                        /////////
////////////////////////////////////////////////////////////////////////////

#ifndef AWAREWAVEFORMCHANNEL
#define AWAREWAVEFORMCHANNEL

#include "TNamed.h"
#include "TGraph.h"
#include "TTimeStamp.h"
#include "AwareVariableSummary.h"

#include <fstream>
#include <map>



class AwareWaveformChannel
{
 public :
  AwareWaveformChannel(TGraph *grChannel, Int_t grId, const char *grLabel);

  //Could do this with templates but can't be bothered
  void addVariableToChannel(const char *varKey, const char *varValue);
  void addVariableToChannel(const char *varKey, double varValue);
  void addVariableToChannel(const char *varKey, int varValue);


  //This is lazy also but will do for now.
  //Should probably write a JSON serialiser
  TGraph * getGraph() { return fGraph;}
  Int_t getId() { return fId;}
  const char * getLabel() { return fLabel.c_str();}
  const char * getVariableString();


 private :

  Int_t fId;
  TGraph *fGraph;
  std::string fLabel;

  //Maps to hold the various JSON thingies
  std::map<std::string, std::string> fVariableMap;


};

#endif //AWAREWAVEFORMCHANNEL
