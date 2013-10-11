////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////// Simple Class to handle the making of AWARE waveforms        /////////
//////                                                             /////////
////// r.nichol@ucl.ac.uk --- December 2012                        /////////
////////////////////////////////////////////////////////////////////////////

#include "AwareWaveformChannel.h"
#include "TSystem.h"
#include <iostream>
#include <fstream>
#include <boost/iostreams/device/file_descriptor.hpp>
#include <boost/iostreams/filtering_stream.hpp>
#include <boost/iostreams/copy.hpp>
#include <boost/iostreams/device/file.hpp>
#include <boost/iostreams/filter/gzip.hpp>




AwareWaveformChannel::AwareWaveformChannel(TGraph *grChannel, Int_t grId, const char *grLabel)
   :fId(grId),fGraph(grChannel),fLabel(grLabel)
{



}



//Could do this with templates but can't be bothered
void AwareWaveformChannel::addVariableToChannel(const char *varKey, const char *varValue) {
  std::string fKey(varKey);
  std::string fValue(varValue);
  fVariableMap.insert(std::pair<std::string,std::string>(fKey,fValue));
}

void AwareWaveformChannel::addVariableToChannel(const char *varKey, double varValue)
{
  char value[20];
  sprintf(value,"%f",varValue);
  return addVariableToChannel(varKey,value);

}

void AwareWaveformChannel::addVariableToChannel(const char *varKey, int varValue)
{
  char value[20];
  sprintf(value,"%d",varValue);
  return addVariableToChannel(varKey,value);

}



const char * AwareWaveformChannel::getVariableString() {
   static TString varString(1024);
   varString.Clear();
   
    
   std::map<std::string,std::string>::iterator varIt=fVariableMap.begin();
   for(;varIt!=fVariableMap.end();varIt++) {
      varString.Append("\"");
      varString.Append(varIt->first.c_str());
      varString.Append("\" : \"");
      varString.Append(varIt->second.c_str());
      varString.Append("\",\n");
   }
   
   return varString.Data();

}
