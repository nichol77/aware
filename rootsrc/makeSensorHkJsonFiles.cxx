////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////  makeSensorHkJsonFiles 
////      This is a simple program that converts sensor hk root files into JSON
////      files that can be read by the AWARE web plotter code
////
////    Feb 2013,  r.nichol@ucl.ac.uk 
////////////////////////////////////////////////////////////////////////////////

//Includes
#include <iostream>

//AraRoot Includes
#include "AtriSensorHkData.h"
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


AtriSensorHkData *sensorHkPtr;

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
  TTree *sensorHkTree = (TTree*) fp->Get("sensorHkTree");
  if(!sensorHkTree) {
    std::cerr << "Can't find sensorHkTree\n";
    return -1;
  }

  if(sensorHkTree->GetEntries()<1) {
    std::cerr << "No entries in sensorHkTree\n";
    return -1;
  }
   
  Int_t runNumber;
  //Check an event in the run Tree and see if it is station1 or TestBed (stationId<2)
  sensorHkTree->SetBranchAddress("sensorHk",&sensorHkPtr);
  sensorHkTree->SetBranchAddress("run",&runNumber);
  
  sensorHkTree->GetEntry(0);

  //Now we set up out run list
  Long64_t numEntries=sensorHkTree->GetEntries();
  Long64_t starEvery=numEntries/80;
  if(starEvery==0) starEvery++;

  AraGeomTool *fGeomTool=AraGeomTool::Instance();
  AwareRunSummaryFileMaker summaryFile(runNumber,fGeomTool->getStationName(sensorHkPtr->getStationId()));

  

  char stationName[20];
  sprintf(stationName,"%s",fGeomTool->getStationName(sensorHkPtr->getStationId()));


  //  numEntries=1;
  for(Long64_t event=0;event<numEntries;event++) {
    if(event%starEvery==0) {
      std::cerr << "*";       
    }

    //This line gets the SensorHk Entry
    sensorHkTree->GetEntry(event);

    TTimeStamp timeStamp(sensorHkPtr->unixTime,0);
    //    std::cout << "Run: "<< realEvPtr->

    //  std::cout << event << "\t" << timeStamp.AsString("sl") << "\n";
    //Summary file fun
    char elementName[180];
    char elementLabel[180];
    summaryFile.addVariablePoint("atriVoltage","ATRI V",timeStamp,sensorHkPtr->getAtriVoltage());
    summaryFile.addVariablePoint("atriCurrent","ATRI I",timeStamp,sensorHkPtr->getAtriCurrent());
    for( int i=0; i<DDA_PER_ATRI; ++i ) {
      sprintf(elementName,"stack_%d.ddaVoltage",i);
      sprintf(elementLabel,"DDA%d V",i+1);
      summaryFile.addVariablePoint(elementName,elementLabel,timeStamp,sensorHkPtr->getDdaVoltage(i));
      sprintf(elementLabel,"DDA%d I",i+1);
      sprintf(elementName,"stack_%d.ddaCurrent",i);
      summaryFile.addVariablePoint(elementName,elementLabel,timeStamp,sensorHkPtr->getDdaCurrent(i));
      sprintf(elementLabel,"DDA%d T",i+1);
      sprintf(elementName,"stack_%d.ddaTemp",i);
      summaryFile.addVariablePoint(elementName,elementLabel,timeStamp,sensorHkPtr->getDdaTemp(i));
      sprintf(elementLabel,"TDA%d V",i+1);
      sprintf(elementName,"stack_%d.tdaVoltage",i);
      summaryFile.addVariablePoint(elementName,elementLabel,timeStamp,sensorHkPtr->getTdaVoltage(i));
      sprintf(elementLabel,"TDA%d I",i+1);
      sprintf(elementName,"stack_%d.tdaCurrent",i);
      summaryFile.addVariablePoint(elementName,elementLabel,timeStamp,sensorHkPtr->getTdaCurrent(i));
      sprintf(elementLabel,"TDA%d T",i+1);
      sprintf(elementName,"stack_%d.tdaTemp",i);
      summaryFile.addVariablePoint(elementName,elementLabel,timeStamp,sensorHkPtr->getTdaTemp(i));
    }

  
    
  }
  std::cerr << "\n";


  TTimeStamp timeStamp(sensorHkPtr->unixTime,0);
  UInt_t dateInt=timeStamp.GetDate();
  
  char outName[FILENAME_MAX];
  sprintf(outName,"output/%s/%04d/%04d/run%d/full",stationName,dateInt/10000,dateInt%10000,runNumber);
  gSystem->mkdir(outName,kTRUE);

  summaryFile.writeFullJSONFiles(outName,"sensorHk");

  sprintf(outName,"output/%s/%04d/%04d/run%d/sensorHkSummary.json",stationName,dateInt/10000,dateInt%10000,runNumber);
  summaryFile.writeSummaryJSONFile(outName);

  sprintf(outName,"output/%s/%04d/%04d/run%d/sensorHkTime.json",stationName,dateInt/10000,dateInt%10000,runNumber);
  summaryFile.writeTimeJSONFile(outName);
  
  
}
