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
#include <utime.h>      
#include <sys/stat.h>
#include <cstdio>
#include <cstdlib>
#include <unistd.h>
AwareRunDatabase::AwareRunDatabase(char *outputDir,char *instumnentName) 
   :fOutputDirName(outputDir),fInstrumentName(instumnentName)
{


}

void AwareRunDatabase::addRunDateToMap(int runNumber, int dateInt)
{
  fRunDateMap[runNumber]=dateInt;

  std::map<int, std::map<int,int> >::iterator it=fDateRunMap.find(dateInt);
  if(it!=fDateRunMap.end()) {
    //Got this date int already
    it->second.insert(std::pair<int,int>(runNumber,runNumber));
  }
  else {
    std::map<int,int> newDateMap;
    newDateMap.insert(std::pair<int,int>(runNumber,runNumber));
    fDateRunMap.insert(std::pair< int, std::map< int,int > > (dateInt,newDateMap));
  }

}


void AwareRunDatabase::writeRunAndDateList() 
{
  if(fRunDateMap.size()==0) return;
  
  //Do the runList one first

  char filename[FILENAME_MAX];
  char textVal[180];
  {
    std::ofstream RunList;
    int currentRunThousand=-1;
    Int_t firstOne=1;

    for(std::map<int,int>::iterator runIt=fRunDateMap.begin();
	runIt!=fRunDateMap.end();
	runIt++) {
      int runNumber=runIt->first;
      int dateInt=runIt->second;
      //    std::cout << "got: " << runNumber << "\t" << dateInt << "\n";
      Int_t runThousand=1000*(runNumber/1000); 
      if(runThousand!=currentRunThousand) {
	//Need to open new file
	if(RunList.is_open()) {
	  RunList << "\n]\n}\n";
	  RunList.close();
	}
	sprintf(filename,"%s/%s/runList%d.json",fOutputDirName.c_str(),fInstrumentName.c_str(),runThousand);
	std::cout << filename << "\n";
	RunList.open(filename);
	if(!RunList.is_open()) {	
	  std::cerr << "Can not open " << filename << "\n";
	  continue;
	}
      
	RunList << "{\n";
	RunList << " \"runList\" : [\n";
	firstOne=1;
      }
    
      //    std::cout << firstOne << "\t" <<runThousand << "\n";
      sprintf(textVal,"[%d,%d,%d]",runNumber,dateInt/10000,dateInt%10000);
      if(!firstOne) RunList << ",\n";    
      RunList << textVal;
      firstOne=0;
      currentRunThousand=runThousand;
    }
    if(RunList.is_open()) {
      RunList << "\n]\n}\n";
      RunList.close();
    }   
  }

  {

    for(std::map<int,std::map<int, int> >::iterator dateIt=fDateRunMap.begin();
	dateIt!=fDateRunMap.end();
	dateIt++) {
      //      std::cout << dateIt->first << "\n";
      int dateInt=dateIt->first;
      char dateRunList[FILENAME_MAX];
      sprintf(dateRunList,"%s/%s/%d/%04d/runList.json",fOutputDirName.c_str(),fInstrumentName.c_str(),dateInt/10000,dateInt%10000);
      
      std::map<Int_t, Int_t>::iterator it=dateIt->second.begin();;
      int firstOne=1;
      std::ofstream NewRunList(dateRunList);
      if(!NewRunList) {
	std::cerr << "Can not open " << dateRunList << "\n";
      }
      else {
	NewRunList << "{\n";
	NewRunList << " \"runList\" : [\n";
	for(;it!=dateIt->second.end();it++) {
	  if(!firstOne) NewRunList << ",\n";
	  NewRunList << it->second;
	  firstOne=0;
	}
	NewRunList << "\n]\n}\n";
	NewRunList.close();
      }
    }        
  }
}

void AwareRunDatabase::updateDateList(char *outputDir,char *instrumentName, int runNumber, int dateInt) {
  //This file makes a simple runList JSON file in each date dir
  //  {
  //  "runList" : [ 
  //  run1, 
  //    run2, run...., runN];
  //  }
  char dateRunList[FILENAME_MAX];
  sprintf(dateRunList,"%s/%s/%d/%04d/runList.json",outputDir,instrumentName,dateInt/10000,dateInt%10000);
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


void AwareRunDatabase::updateRunList(char *outputDir,char *instrumentName, int runNumber, int dateInt) {


  ///This code updates the runList
  std::map<Int_t, std::string> runListMap;
  char textVal[180];
  sprintf(textVal,"[%d,%d,%d]",runNumber,dateInt/10000,dateInt%10000);
  

  runListMap[runNumber]=std::string(textVal);
  
  Int_t runThousand=1000*(runNumber/1000);
  char runList[FILENAME_MAX];
  sprintf(runList,"%s/%s/runList%d.json",outputDir,instrumentName,runThousand);
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


int AwareRunDatabase::updateTouchFile(const char *touchFile, Int_t run, UInt_t unixTime)
{
   //Touch File  
   struct utimbuf ut;
   ut.actime=unixTime;  
   ut.modtime=unixTime;   
   struct stat buf;  
   int retVal2=stat(touchFile,&buf);  
   if(retVal2==0) {    
      if(buf.st_mtime<ut.modtime) {  
	 std::ofstream Touch(touchFile);    
	 Touch << run << "\n";
	 Touch.close();    	 
	 utime(touchFile,&ut);      
	 return 1;
      }  
   }  
   else {
      //Maybe file doesn't exist    
      std::ofstream Touch(touchFile);   
      Touch << run << "\n"; 
      Touch.close();    
      utime(touchFile,&ut);    
      return 1;
   }      
   return 0;
}

void AwareRunDatabase::touchFile(const char *touchFile) {
  FILE *fd = fopen(touchFile, "rwb");
  if (fd >= 0) fclose(fd);
}
