////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////// Simple Class to handle the making of AWARE Event JSON Files /////////
//////                                                             /////////
////// r.nichol@ucl.ac.uk --- December 2012                        /////////
////////////////////////////////////////////////////////////////////////////

#include "AwareWaveformEventFileMaker.h"
#include "TSystem.h"
#include <iostream>
#include <fstream>


AwareWaveformEventFileMaker::AwareWaveformEventFileMaker(Int_t runNumber, Int_t eventNumber, const char *instrumentName, const char *jsonName)
 :fRun(runNumber),fEventNumber(eventNumber),fInstrumentName(instrumentName),fEventFilename(jsonName)
{


}


//Could do this with templates but can't be bothered
void AwareWaveformEventFileMaker::addVariableToEvent(const char *varKey, const char *varValue) {
  std::string fKey(varKey);
  std::string fValue(varValue);
  fVariableMap.insert(std::pair<std::string,std::string>(fKey,fValue));
}

void AwareWaveformEventFileMaker::addVariableToEvent(const char *varKey, double varValue)
{
  char value[20];
  sprintf(value,"%f",varValue);
  return addVariableToEvent(varKey,value);

}

void AwareWaveformEventFileMaker::addVariableToEvent(const char *varKey, int varValue)
{
  char value[20];
  sprintf(value,"%d",varValue);
  return addVariableToEvent(varKey,value);

}

void AwareWaveformEventFileMaker::addChannelToFile(TGraph *grChannel, Int_t grId, const char *grLabel)
{
  fGraphMap.insert(std::pair<Int_t,TGraph*>(grId,grChannel));
  std::string fLabel(grLabel);
  fGraphLabelMap.insert(std::pair<Int_t,std::string>(grId,fLabel));
}

void AwareWaveformEventFileMaker::writeFile()
{
  std::ofstream fEventFile(fEventFilename.c_str());
  if(!fEventFile.is_open()) {
    std::cerr << "Event file not open\n";
    return;
  }

  fEventFile << "{\n\"event\":{\n";
  fEventFile <<  "\"instrument\": \"" << fInstrumentName << "\",\n";
  fEventFile <<  "\"run\": " << fRun << ",\n";
  fEventFile <<  "\"eventNumber\": " << fEventNumber << ",\n";

  std::map<std::string,std::string>::iterator varIt=fVariableMap.begin();
  for(;varIt!=fVariableMap.end();varIt++) {
    fEventFile << "\"" << varIt->first.c_str() << "\" : \"" << varIt->second.c_str() << "\",\n";
  }

  Int_t numChannels=fGraphMap.size();
  if(numChannels==0) { 
    return;
  }
  
  fEventFile <<  "\"numChannels\": " << numChannels << ",\n";
  fEventFile << "\"channelList\": [\n";
  int firstChannel=1;

  std::map<Int_t,TGraph *>::iterator graphIt=fGraphMap.begin();
  std::map<Int_t,std::string>::iterator labelIt=fGraphLabelMap.end();
  for(;graphIt!=fGraphMap.end();graphIt++ , labelIt++) {
    if(!firstChannel) fEventFile << ",\n";
    fEventFile << "{\n";
    fEventFile << "\"id\": " << graphIt->first << ",\n";
    //    fEventFile << "\"label\": \"" << labelIt->second << "\",\n";
    fEventFile << "\"data\": [\n";
    Double_t *xVals = graphIt->second->GetX();
    Double_t *yVals = graphIt->second->GetY();
    Int_t numPoints=graphIt->second->GetN();
    //    std::cout << fEventNumber << "\t" << graphIt->first << "\t" << numPoints << "\n";
    for(int i=0;i<numPoints;i++) {
      if(i>0) fEventFile << ",";
      if(i%10==0) fEventFile << "\n";
      char dataPoint[20];
      sprintf(dataPoint,"[%3.1f,%3.0f]",xVals[i],yVals[i]);
      fEventFile << dataPoint;
    }
    fEventFile << "]}\n";    
    firstChannel=0;
  }
  fEventFile << "]}}\n";
   
  fEventFile.close();


  char gzipString[FILENAME_MAX];
  sprintf(gzipString,"gzip -f %s",fEventFilename.c_str());
  gSystem->Exec(gzipString);
}
