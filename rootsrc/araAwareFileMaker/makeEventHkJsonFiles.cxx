////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////  makeEventHkJsonFiles 
////      This is a simple program that converts sensor hk root files into JSON
////      files that can be read by the AWARE web plotter code
////
////    Feb 2013,  r.nichol@ucl.ac.uk 
////////////////////////////////////////////////////////////////////////////////

//Includes
#include <iostream>

//AraRoot Includes
#include "AtriEventHkData.h"
#include "AraGeomTool.h"
//Include FFTtools.h if you want to ask the correlation, etc. tools

//ROOT Includes
#include "TTree.h"
#include "TFile.h"
#include "TGraph.h"
#include "TTimeStamp.h"
#include "TSystem.h"

//AWARE Includes
#include "AwareRunSummaryFileMaker.h"
#include "AwareRunDatabase.h"


AtriEventHkData *eventHkPtr;

void usage(char **argv) 
{  
  std::cout << "Usage\n" << argv[0] << " <input file>\n";
  std::cout << "e.g.\n" << argv[0] << " http://www.hep.ucl.ac.uk/uhen/ara/monitor/root/run1841/event1841.root\n";  
}


int main(int argc, char **argv) {
  if(argc<2) {
    usage(argv);
    return -1;
  }


  TFile *fp = TFile::Open(argv[1]);
  if(!fp) {
    std::cerr << "Can't open file\n";
    return -1;
  }
  TTree *eventHkTree = (TTree*) fp->Get("eventHkTree");
  if(!eventHkTree) {
    std::cerr << "Can't find eventHkTree\n";
    return -1;
  }

  if(eventHkTree->GetEntries()<1) {
    std::cerr << "No entries in eventHkTree\n";
    return -1;
  }
   
  Int_t runNumber;
  //Check an event in the run Tree and see if it is station1 or TestBed (tationId<2)
  eventHkTree->SetBranchAddress("eventHk",&eventHkPtr);
  eventHkTree->SetBranchAddress("run",&runNumber);
  
  eventHkTree->GetEntry(0);


  TTimeStamp timeStamp(eventHkPtr->unixTime,0);
  UInt_t dateInt=timeStamp.GetDate();
  UInt_t firstTime=timeStamp.GetSec();

  //Now we set up out run list
  Long64_t numEntries=eventHkTree->GetEntries();
  Long64_t starEvery=numEntries/80;
  if(starEvery==0) starEvery++;

  AraGeomTool *fGeomTool=AraGeomTool::Instance();
  AwareRunSummaryFileMaker summaryFile(runNumber,fGeomTool->getStationName(eventHkPtr->getStationId()));

  


  char stationName[20];
  sprintf(stationName,"%s",fGeomTool->getStationName(eventHkPtr->getStationId()));


  //  numEntries=1;
  for(Long64_t event=0;event<numEntries;event++) {
    if(event%starEvery==0) {
      std::cerr << "*";       
    }

    //This line gets the EventHk Entry
    eventHkTree->GetEntry(event);

    TTimeStamp timeStamp((time_t)eventHkPtr->unixTime,0);
    //    std::cout << "Run: "<< realEvPtr->

    //  std::cout << event << "\t" << timeStamp.AsString("sl") << "\n";
     

    //Summary file fun
    char elementName[180];
    char elementLabel[180];
    summaryFile.addVariablePoint("ppsCounter","PPS#",timeStamp,eventHkPtr->getPpsCounter());
    summaryFile.addVariablePoint("clockCounter","Clock#",timeStamp,eventHkPtr->getClockCounter());
    for( int i=0; i<DDA_PER_ATRI; ++i ) {
       sprintf(elementName,"stack_%d.wilkinsonCounterNs",i);
       sprintf(elementLabel,"Wilk# %d",i+1);
       summaryFile.addVariablePoint(elementName,elementLabel,timeStamp,eventHkPtr->getWilkinsonCounterNs(i));
       sprintf(elementLabel,"Wilk Delay %d",i+1);
       sprintf(elementName,"stack_%d.wilkinsonDelay",i);
       summaryFile.addVariablePoint(elementName,elementLabel,timeStamp,eventHkPtr->getWilkinsonDelay(i));
       sprintf(elementName,"stack_%d.vdlyDac",i);
       sprintf(elementLabel,"Vdly %d",i+1);
       summaryFile.addVariablePoint(elementName,elementLabel,timeStamp,eventHkPtr->getVdlyDac(i));
       sprintf(elementLabel,"Vadj %d",i+1);
       sprintf(elementName,"stack_%d.vadjDac",i);
       summaryFile.addVariablePoint(elementName,elementLabel,timeStamp,eventHkPtr->getVadjDac(i));
    }

    for(int i=0;i<TDA_PER_ATRI;++i) {
      for(int chan=0;chan<ANTS_PER_TDA;chan++) {       
	 sprintf(elementLabel,"L1_%d_%d",i+1,chan+1);	
	 sprintf(elementName,"stack_%d.singleChannelRate%d",i,chan);
	 summaryFile.addVariablePoint(elementName,elementLabel,timeStamp,eventHkPtr->getSingleChannelRateHz(i,chan));    
	 sprintf(elementLabel,"Thresh_%d_%d",i+1,chan+1);
	 sprintf(elementName,"stack_%d.singleChannelThreshold%d",i,chan);
	 summaryFile.addVariablePoint(elementName,elementLabel,timeStamp,eventHkPtr->getSingleChannelThreshold(i,chan));
      }
    
      sprintf(elementLabel,"1 of 4 (%d)",i+1);
      sprintf(elementName,"stack_%d.oneOfFourRate",i);
      summaryFile.addVariablePoint(elementName,elementLabel,timeStamp,eventHkPtr->getOneOfFourRateHz(i));
      sprintf(elementLabel,"2 of 4 (%d)",i+1);
      sprintf(elementName,"stack_%d.twoOfFourRate",i);
      summaryFile.addVariablePoint(elementName,elementLabel,timeStamp,eventHkPtr->getTwoOfFourRateHz(i));
      sprintf(elementLabel,"3 of 4 (%d)",i+1);
      sprintf(elementName,"stack_%d.threeOfFourRate",i);
      summaryFile.addVariablePoint(elementName,elementLabel,timeStamp,eventHkPtr->getThreeOfFourRateHz(i));
    }

    summaryFile.addVariablePoint("threeOfEightRate0","3 of 8 (1)",timeStamp,eventHkPtr->getThreeOfEightRateHz(0));
    summaryFile.addVariablePoint("threeOfEightRate1","3 of 8 (2)",timeStamp,eventHkPtr->getThreeOfEightRateHz(1));
    summaryFile.addVariablePoint("l4ScalerRate0","L4[0]",timeStamp,eventHkPtr->getL4RateHz(0));
    summaryFile.addVariablePoint("l4ScalerRate1","L4[1]",timeStamp,eventHkPtr->getL4RateHz(1));
    summaryFile.addVariablePoint("l4ScalerRate2","L4[2]",timeStamp,eventHkPtr->getL4RateHz(2));
    summaryFile.addVariablePoint("l4ScalerRate3","L4[3]",timeStamp,eventHkPtr->getL4RateHz(3));

   

    
  }
  std::cerr << "\n";

  char outputDir[FILENAME_MAX];
  char *outputDirEnv=getenv("AWARE_OUTPUT_DIR");
  if(outputDirEnv==NULL) {
    sprintf(outputDir,"/unix/ara/data/aware/output");
  }
  else {
    strncpy(outputDir,outputDirEnv,FILENAME_MAX);
  }
    
  
  char outName[FILENAME_MAX];
  sprintf(outName,"%s/%s/%04d/%04d/run%d/full",outputDir,stationName,dateInt/10000,dateInt%10000,runNumber);
  gSystem->mkdir(outName,kTRUE);

  std::cout << "Making: " << outName << "\n";

  summaryFile.writeFullJSONFiles(outName,"eventHk");


  sprintf(outName,"%s/%s/%04d/%04d/run%d/eventHkSummary.json.gz",outputDir,stationName,dateInt/10000,dateInt%10000,runNumber);
  summaryFile.writeSummaryJSONFile(outName);
  std::cout << "Writing: " << outName << "\n";



  sprintf(outName,"%s/%s/%04d/%04d/run%d/eventHkTime.json.gz",outputDir,stationName,dateInt/10000,dateInt%10000,runNumber);
  summaryFile.writeTimeJSONFile(outName);

  sprintf(outName,"%s/%s/lastEventHk",outputDir,stationName);
  AwareRunDatabase::updateTouchFile(outName,runNumber,firstTime);
  sprintf(outName,"%s/%s/lastRun",outputDir,stationName);
  AwareRunDatabase::updateTouchFile(outName,runNumber,firstTime);


  //  AwareRunDatabase::updateRunList(stationName,runNumber,dateInt);
  //  AwareRunDatabase::updateDateList(stationName,runNumber,dateInt);
}

