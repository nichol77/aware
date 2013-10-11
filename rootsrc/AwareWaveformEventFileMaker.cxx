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
#include <boost/iostreams/device/file_descriptor.hpp>
#include <boost/iostreams/filtering_stream.hpp>
#include <boost/iostreams/copy.hpp>
#include <boost/iostreams/device/file.hpp>
#include <boost/iostreams/filter/gzip.hpp>



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

void AwareWaveformEventFileMaker::addChannelToFile(AwareWaveformChannel theChannel)
{
   fChannelMap.insert(std::pair<Int_t,AwareWaveformChannel>(theChannel.getId(),theChannel));
}

void AwareWaveformEventFileMaker::writeFile()
{
   //  std::ofstream fEventFile(fEventFilename.c_str());
  //  if(!fEventFile.is_open()) {
     ///    std::cerr << "Event file not open\n";
    //    return;
    //  }
   boost::iostreams::filtering_ostream fEventFile;
   fEventFile.push(boost::iostreams::gzip_compressor());
   fEventFile.push(boost::iostreams::file_sink(fEventFilename.c_str()));
   
   
   fEventFile << "{\n\"event\":{\n";
   fEventFile <<  "\"instrument\": \"" << fInstrumentName << "\",\n";
   fEventFile <<  "\"run\": " << fRun << ",\n";
   fEventFile <<  "\"eventNumber\": " << fEventNumber << ",\n";
   
   std::map<std::string,std::string>::iterator varIt=fVariableMap.begin();
   for(;varIt!=fVariableMap.end();varIt++) {
      fEventFile << "\"" << varIt->first.c_str() << "\" : \"" << varIt->second.c_str() << "\",\n";
   }

   Int_t numChannels=fChannelMap.size();
   if(numChannels==0) { 
      return;
   }
   
   fEventFile <<  "\"numChannels\": " << numChannels << ",\n";
   fEventFile << "\"channelList\": [\n";
   int firstChannel=1;

  std::map<Int_t,AwareWaveformChannel>::iterator channelIt=fChannelMap.begin();
  for(;channelIt!=fChannelMap.end();channelIt++) {
    if(!firstChannel) fEventFile << ",\n";
    fEventFile << "{\n";
    fEventFile << "\"id\": " << channelIt->first << ",\n";
    Double_t *xVals = channelIt->second.getGraph()->GetX();
    Int_t numPoints=channelIt->second.getGraph()->GetN();
    Double_t deltaT=xVals[numPoints-1]-xVals[0];
    deltaT/=(numPoints-1);
    fEventFile << "\"label\": \"" << channelIt->second.getLabel() << "\",\n";
    fEventFile << "\"deltaT\": " << deltaT << ",\n";
    fEventFile << "\"t0\": " << xVals[0] << ",\n";
    fEventFile << channelIt->second.getVariableString() << "\n";
    fEventFile << "\"data\": [\n";
    Double_t *yVals = channelIt->second.getGraph()->GetY();

    //    std::cout << fEventNumber << "\t" << channelIt->first << "\t" << numPoints << "\n";
    for(int i=0;i<numPoints;i++) {
      if(i>0) fEventFile << ",";
      if(i%10==0) fEventFile << "\n";
      char dataPoint[20];
      sprintf(dataPoint,"[%4.0f]",yVals[i]);
      fEventFile << dataPoint;
    }
    fEventFile << "]}\n";    
    firstChannel=0;
  }
  fEventFile << "]}}\n";
   
  fEventFile.flush();


  //  char gzipString[FILENAME_MAX];
  //  sprintf(gzipString,"gzip -f %s",fEventFilename.c_str());
  //  gSystem->Exec(gzipString);
}
