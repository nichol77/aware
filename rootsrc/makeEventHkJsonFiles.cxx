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
    summaryFile.addVariablePoint("ppsCounter",timeStamp,eventHkPtr->getPpsCounter());
    summaryFile.addVariablePoint("clockCounter",timeStamp,eventHkPtr->getClockCounter());
    for( int i=0; i<DDA_PER_ATRI; ++i ) {
      sprintf(elementName,"stack_%d.wilkinsonCounterNs",i);
      summaryFile.addVariablePoint(elementName,timeStamp,eventHkPtr->getWilkinsonCounterNs(i));
      sprintf(elementName,"stack_%d.wilkinsonDelay",i);
      summaryFile.addVariablePoint(elementName,timeStamp,eventHkPtr->getWilkinsonDelay(i));
      sprintf(elementName,"stack_%d.vdlyDac",i);
      summaryFile.addVariablePoint(elementName,timeStamp,eventHkPtr->getVdlyDac(i));
      sprintf(elementName,"stack_%d.vadjDac",i);
      summaryFile.addVariablePoint(elementName,timeStamp,eventHkPtr->getVadjDac(i));
    }

    for(int i=0;i<TDA_PER_ATRI;++i) {
      for(int chan=0;chan<ANTS_PER_TDA;chan++) {	
	sprintf(elementName,"stack_%d.singleChannelRate%d",i,chan);
	summaryFile.addVariablePoint(elementName,timeStamp,eventHkPtr->getSingleChannelRateHz(i,chan));
	sprintf(elementName,"stack_%d.singleChannelThreshold%d",i,chan);
	summaryFile.addVariablePoint(elementName,timeStamp,eventHkPtr->getSingleChannelThreshold(i,chan));
      }

      sprintf(elementName,"stack_%d.oneOfFourRate",i);
      summaryFile.addVariablePoint(elementName,timeStamp,eventHkPtr->getOneOfFourRateHz(i));
      sprintf(elementName,"stack_%d.twoOfFourRate",i);
      summaryFile.addVariablePoint(elementName,timeStamp,eventHkPtr->getTwoOfFourRateHz(i));
      sprintf(elementName,"stack_%d.threeOfFourRate",i);
      summaryFile.addVariablePoint(elementName,timeStamp,eventHkPtr->getThreeOfFourRateHz(i));
    }

    summaryFile.addVariablePoint("threeOfEightRate0",timeStamp,eventHkPtr->getThreeOfEightRateHz(0));
    summaryFile.addVariablePoint("threeOfEightRate1",timeStamp,eventHkPtr->getThreeOfEightRateHz(1));
    summaryFile.addVariablePoint("l4ScalerRate0",timeStamp,eventHkPtr->getL4RateHz(0));
    summaryFile.addVariablePoint("l4ScalerRate1",timeStamp,eventHkPtr->getL4RateHz(1));
    summaryFile.addVariablePoint("l4ScalerRate2",timeStamp,eventHkPtr->getL4RateHz(2));
    summaryFile.addVariablePoint("l4ScalerRate3",timeStamp,eventHkPtr->getL4RateHz(3));

   

    
  }
  std::cerr << "\n";


  TTimeStamp timeStamp(eventHkPtr->unixTime,0);
  UInt_t dateInt=timeStamp.GetDate();
  
  char outName[FILENAME_MAX];
  sprintf(outName,"output/%s/%d/%04d/run%d/full",stationName,dateInt/10000,(dateInt%10000),runNumber);
  //  std::cout << outName << "\n";
  gSystem->mkdir(outName,kTRUE);

  summaryFile.writeFullJSONFiles(outName,"eventHk");




  sprintf(outName,"output/%s/%d/%04d/run%d/eventHkSummary.json",stationName,dateInt/10000,dateInt%10000,runNumber);
  summaryFile.writeSummaryJSONFile(outName);

  sprintf(outName,"output/%s/%d/%04d/run%d/eventHkTime.json",stationName,dateInt/10000,dateInt%10000,runNumber);
  summaryFile.writeTimeJSONFile(outName);
  
  
}
