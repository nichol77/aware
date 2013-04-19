
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////  updateRunList
////      This is a simple program that updates the runList
////    Feb 2013,  r.nichol@ucl.ac.uk 
////////////////////////////////////////////////////////////////////////////////

//Includes
#include <iostream>


//ROOT Includes
#include "TTree.h"
#include "TFile.h"
#include "TGraph.h"
#include "TTimeStamp.h"
#include "TSystem.h"
#include "TSystemDirectory.h"

//AWARE Includes
#include "AwareRunSummaryFileMaker.h"
#include "AwareRunDatabase.h"



void usage(char **argv) 
{  
  std::cout << "Usage\n" << argv[0] << "  <instrument name>\n";
  std::cout << "e.g.\n" << argv[0] << " /tmp/here STATION1B\n";  
}


int main(int argc, char**argv) {   
  if(argc<2) {
    usage(argv);
    return -1;
  }


  char outputDir[FILENAME_MAX];
  char *outputDirEnv=getenv("AWARE_OUTPUT_DIR");
  if(outputDirEnv==NULL) {
    sprintf(outputDir,"/unix/ara/data/aware/output");
  }
  else {
    strncpy(outputDir,outputDirEnv,FILENAME_MAX);
  }
    


  AwareRunDatabase runDb(outputDir,argv[1]);

  

  char instDir[FILENAME_MAX];
  sprintf(instDir,"%s/%s",outputDir,argv[1]);
  
  char thisDir[FILENAME_MAX];
  

  TSystemDirectory yearDir(instDir, instDir);
  TList *yearFiles = yearDir.GetListOfFiles();
  if (yearFiles) {
     TSystemFile *year;
     TString yearString;
     TIter next(yearFiles);
     while ((year=(TSystemFile*)next())) {
	yearString = year->GetName();
	if (year->IsDirectory() && yearString.IsDigit()) {
	  
	  sprintf(thisDir,"%s/%s",instDir,yearString.Data());
	  std::cout << yearString.Data() << "\t" << thisDir << std::endl;
	  
	  TSystemDirectory dayDir(yearString.Data(),thisDir);
	   TList *dayFiles = dayDir.GetListOfFiles();
	   if (dayFiles) {
	      TSystemFile *day;
	      TString dayString;
	      TIter next(dayFiles);
	      while ((day=(TSystemFile*)next())) {
		 dayString = day->GetName();
		 if (day->IsDirectory() && dayString.IsDigit()) {		  

		   sprintf(thisDir,"%s/%s/%s",instDir,yearString.Data(),dayString.Data());
		   //		   std::cout << yearString.Data() <<  "\t" << dayString.Data() << "\t" << thisDir << std::endl;
		   
		    TSystemDirectory runDir(dayString.Data(), thisDir);
		    TList *runFiles = runDir.GetListOfFiles();
		    if (runFiles) {
		      TSystemFile *run;
		      TString runString;
		      TIter next(runFiles);
		      while ((run=(TSystemFile*)next())) {
			runString = run->GetName();
			int runNumber=0;
			sscanf(runString.Data(),"run%d",&runNumber);
			if (run->IsDirectory() && runString.Length()>4) {
			  //			  std::cout << yearString.Data() << "\t" << dayString.Data() << "\t" << runString.Data() << "\n";
			  TString dateString=yearString+dayString;
			  //std::cout << dateString << "\n";
			  Int_t dateInt=dateString.Atoi();
			  std::cout << runNumber << "\t" << dateInt << "\n";
			  runDb.addRunDateToMap(runNumber,dateInt);
			}
		      }
		    }		 

		 }
	      }
	   }
	}
     }
  }
  runDb.writeRunAndDateList();
}
