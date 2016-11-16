////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////// Simple Class to handle the making of AWARE Event Db Files     /////////
//////                                                             /////////
////// r.nichol@ucl.ac.uk --- March 2013                           /////////
////////////////////////////////////////////////////////////////////////////

#include "AwareEventDatabase.h"

#include <iostream>
#include <fstream>
#include <map>
#include <utime.h>      
#include <sys/stat.h>

AwareEventDatabase::AwareEventDatabase(char *outputDir,char *instumnentName,int dateInt, int run) 
  :fOutputDirName(outputDir),fInstrumentName(instumnentName),fDateInt(dateInt),fRun(run)
{
  

}


void AwareEventDatabase::addEventToList(int eventNumber)
{
  fEventList.insert(eventNumber);

}


void AwareEventDatabase::writeEventList(char *outName)
{
  char filename[FILENAME_MAX];
  if(outName) {
     strncpy(filename,outName,FILENAME_MAX-1);
  }
  else {
     sprintf(filename,"%s/%s/%04d/%04d/run%d/eventList.json",fOutputDirName.c_str(),fInstrumentName.c_str(),fDateInt/10000,fDateInt%10000,fRun);
  }
  std::ofstream EventList(filename);
  int firstOne=1;

  std::set<int>::iterator it=fEventList.begin();
  if(!EventList) {
    std::cerr << "Can not open " << filename << "\n";
  }
  else {
    EventList << "{\n";
    EventList << " \"eventList\" : [\n";
    for(;it!=fEventList.end();it++) {
      if(!firstOne) EventList << ",";
      EventList << (*it);
      firstOne=0;
    }
    EventList << "\n]\n}\n";
    EventList.close();
  }
}
