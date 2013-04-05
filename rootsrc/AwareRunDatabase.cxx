////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////// Simple Class to handle the making of AWARE Run Db Files     /////////
//////                                                             /////////
////// r.nichol@ucl.ac.uk --- March 2013                           /////////
////////////////////////////////////////////////////////////////////////////

#include "AwareRunDatabase.h"

#include <iostream>
#include <fstream>
#include <map>


void AwareRunDatabase::updateDateList(char *instrumentName, int runNumber, int dateInt) {
  //This file makes a simple runList JSON file in each date dir
  //  {
  //  "runList" : [ 
  //  run1, 
  //    run2, run...., runN];
  //  }
  char dateRunList[FILENAME_MAX];
  sprintf(dateRunList,"output/%s/%d/%04d/runList.json",instrumentName,dateInt/10000,dateInt%10000);
  std::map <Int_t,Int_t> runNumberList;
  runNumberList[runNumber]=runNumber;
  std::ifstream RunList(dateRunList);
  if(!RunList) {
    std::cerr << "Can not open " << dateRunList << "\n";
  }
  else {
    char temp[180];
    RunList.getline(temp,179); /// {
    RunList.getline(temp,179); /// runlist : [
    while(RunList.getline(temp,179)) {
      if(temp[0]==']') break;
      int thisRun=0;
      sscanf(temp,"%d,",&thisRun);
      runNumberList[thisRun]=thisRun;      
    }
    RunList.close();
  }


  std::map<Int_t, Int_t>::iterator it=runNumberList.begin();;
  int firstOne=1;
  std::ofstream NewRunList(dateRunList);
  if(!NewRunList) {
    std::cerr << "Can not open " << dateRunList << "\n";
  }
  else {
    NewRunList << "{\n";
    NewRunList << " \"runList\" : [\n";
    for(;it!=runNumberList.end();it++) {
      if(!firstOne) NewRunList << ",\n";
      NewRunList << it->second;
      firstOne=0;
    }
    NewRunList << "\n]\n}\n";
    NewRunList.close();
  }
}


void AwareRunDatabase::updateRunList(char *instrumentName, int runNumber, int dateInt) {


  ///This code updates the runList
  std::map<Int_t, std::string> runListMap;
  char textVal[180];
  sprintf(textVal,"[%d,%d,%d]",runNumber,dateInt/10000,dateInt%10000);
  

  runListMap[runNumber]=std::string(textVal);
  
  Int_t runThousand=1000*(runNumber/1000);
  char runList[FILENAME_MAX];
  sprintf(runList,"output/%s/runList%d.json",instrumentName,runThousand);
  std::ifstream RunList(runList);
  if(!RunList) {
    std::cerr << "Can not open " << runList << "\n";
  }
  else {
    char temp[180];
    RunList.getline(temp,179); /// {
    RunList.getline(temp,179); /// runlist : [
    while(RunList.getline(temp,179)) {

      if(temp[0]=='[') {
	//	std::cout  << temp << "\n";
	int thisRun=0,thisYear=0,thisDateCode=0;
	sscanf(temp,"[%d,%d,%d]",&thisRun,&thisYear,&thisDateCode);
	sprintf(textVal,"[%d,%d,%d]",thisRun,thisYear,thisDateCode);
	runListMap[thisRun]=std::string(textVal);
      }
      
    }
    RunList.close();
  }


  std::map<Int_t, std::string>::iterator it=runListMap.begin();;
  int firstOne=1;
  std::ofstream NewRunList(runList);
  if(!NewRunList) {
    std::cerr << "Can not open " << runList << "\n";
  }
  else {
    NewRunList << "{\n";
    NewRunList << " \"runList\" : [\n";
    for(;it!=runListMap.end();it++) {
      if(!firstOne) NewRunList << ",\n";
      NewRunList << it->second.c_str();
      firstOne=0;
    }
    NewRunList << "\n]\n}\n";
    NewRunList.close();
  }
}
