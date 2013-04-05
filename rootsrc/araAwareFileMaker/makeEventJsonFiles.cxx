////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////  makeEventJsonFiles 
////      This is a simple program that converts event root files into JSON
////      files that can be read by the AWARE web plotter code
////
////    Feb 2013,  r.nichol@ucl.ac.uk 
////  exampleLoop.cxx 
////////////////////////////////////////////////////////////////////////////////

//Includes
#include <iostream>

//AraRoot Includes
#include "RawIcrrStationEvent.h"
#include "RawAtriStationEvent.h"
#include "UsefulAraStationEvent.h"
#include "UsefulIcrrStationEvent.h"
#include "UsefulAtriStationEvent.h"
#include "AraGeomTool.h"

//AWARE includes
#include "AwareWaveformEventFileMaker.h"

//Include FFTtools.h if you want to ask the correlation, etc. tools

//ROOT Includes
#include "TTree.h"
#include "TFile.h"
#include "TGraph.h"
#include "TTimeStamp.h"
#include "TSystem.h"

RawIcrrStationEvent *rawIcrrEvPtr;
RawAtriStationEvent *rawAtriEvPtr;
RawAraStationEvent *rawEvPtr;
UsefulIcrrStationEvent *realIcrrEvPtr;
UsefulAtriStationEvent *realAtriEvPtr;
UsefulAraStationEvent *realEvPtr;

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
  TTree *eventTree = (TTree*) fp->Get("eventTree");
  if(!eventTree) {
    std::cerr << "Can't find eventTree\n";
    return -1;
  }
   
  //Now check the electronics type of the station


  int isIcrrEvent=0;
  int isAtriEvent=0;

  Int_t runNumber;
  //Check an event in the run Tree and see if it is station1 or TestBed (stationId<2)
  eventTree->SetBranchAddress("event",&rawEvPtr);
  eventTree->SetBranchAddress("run",&runNumber);
  eventTree->GetEntry(0);

  if((rawEvPtr->stationId)<2){
    isIcrrEvent=1;
    isAtriEvent=0;
  }
  else{
    isIcrrEvent=0;
    isAtriEvent=1; 
  }
  eventTree->ResetBranchAddresses();

  //Now set the appropriate branch addresses
  //The Icrr case
  if(isIcrrEvent){

    eventTree->SetBranchAddress("event", &rawIcrrEvPtr);
    rawEvPtr=rawIcrrEvPtr;
    std::cerr << "Set Branch address to Icrr\n";

  }
  //The Atri case
  else{

    eventTree->SetBranchAddress("event", &rawAtriEvPtr);
    rawEvPtr=rawAtriEvPtr;
    std::cerr << "Set Branch address to Atri\n";

  }

  //Now we set up out run list
  Long64_t numEntries=eventTree->GetEntries();
  Long64_t starEvery=numEntries/80;
  if(starEvery==0) starEvery++;

  //jpd print to screen some info
  std::cerr << "isAtri " << isAtriEvent << " isIcrr " << isIcrrEvent << " number of entries is " <<  numEntries << std::endl;

  eventTree->GetEntry(0);

  char stationName[20];


  AraGeomTool *fGeomTool = AraGeomTool::Instance();

  TTimeStamp timeStamp;
  if(isIcrrEvent) {
    sprintf(stationName,"%s",fGeomTool->getStationName(rawIcrrEvPtr->getStationId()));
    timeStamp=TTimeStamp(rawIcrrEvPtr->head.unixTime);
  }
  else {
    timeStamp=TTimeStamp(rawAtriEvPtr->unixTime);
    sprintf(stationName,"%s",fGeomTool->getStationName(rawAtriEvPtr->getStationId()));
  }   
  UInt_t dateInt=timeStamp.GetDate();

  char dirName[FILENAME_MAX];
  sprintf(dirName,"output/%s/%d/%04d/run%d/",stationName,dateInt/10000,dateInt%10000,runNumber);
  gSystem->mkdir(dirName,kTRUE);

   

  //    numEntries=4;
  for(Long64_t event=0;event<numEntries;event++) {
    if(event%starEvery==0) {
      std::cerr << "*";       
    }

    //This line gets the RawIcrr or RawAtri Event
    eventTree->GetEntry(event);

    //Here we create a useful event Either an Icrr or Atri event
    Int_t eventNumber=event;
    Int_t unixTime=1;

    Double_t triggerTime=0;

    if(isIcrrEvent){
      realIcrrEvPtr = new UsefulIcrrStationEvent(rawIcrrEvPtr, AraCalType::kLatestCalib);
      realEvPtr=realIcrrEvPtr;
      eventNumber=rawIcrrEvPtr->head.eventNumber;
      unixTime=rawIcrrEvPtr->head.unixTime;
      triggerTime=rawIcrrEvPtr->getRubidiumTriggerTimeInSec();
    }
    else if(isAtriEvent){
      realAtriEvPtr = new UsefulAtriStationEvent(rawAtriEvPtr, AraCalType::kFirstCalib);
      realEvPtr=realAtriEvPtr;
      eventNumber=rawAtriEvPtr->eventNumber;
      unixTime=rawAtriEvPtr->unixTime;
      triggerTime=rawAtriEvPtr->timeStamp;
    }
    TTimeStamp timeStamp(unixTime,0);
    //    std::cout << "Run: "<< realEvPtr->
     
    //Now you can do whatever analysis you want
    //e.g.
    //    AraStationId_t stationId=rawEvPtr->getStationId();
    //    std::cout << "Station Id: " << int(stationId) << "\n";
    //    std::cout << "Station Name: " << fGeomTool->getStationName(rawEvPtr->getStationId()) << "\n";

    AraStationInfo *statInfo=fGeomTool->getStationInfo(rawEvPtr->getStationId());
    

    char outName[FILENAME_MAX];
    sprintf(outName,"output/%s/%d/%04d/run%d/event%d.json",stationName,dateInt/10000,dateInt%10000,runNumber,eventNumber);

    AwareWaveformEventFileMaker fileMaker(runNumber,eventNumber,stationName,outName);


    Int_t numChannels=realEvPtr->getNumRFChannels();
    
    fileMaker.addVariableToEvent("time",timeStamp.AsString("sl"));
    fileMaker.addVariableToEvent("triggerTime",triggerTime);

    TGraph *gr[100]={0};

    

    for( int i=0; i<numChannels; ++i ) {
      gr[i]=realEvPtr->getGraphFromRFChan(i);   
      char label[10];
      //      AraAntennaInfo *antInfo = statInfo->getAntennaInfo(i);
      sprintf(label,"RF %d",i);
      if(gr[i]) {
	//	std::cout << "make: " << eventNumber << "\t" << i << "\t" << gr[i]->GetN() << "\n";
	fileMaker.addChannelToFile(gr[i],i,label);
      }      
    }

    fileMaker.writeFile();
    char gzipString[FILENAME_MAX];
    sprintf(gzipString,"gzip %s",outName);
    gSystem->Exec(gzipString);


    for( int i=0; i<numChannels; ++i ) {
      delete gr[i];
    }
  }
  std::cerr << "\n";

  
 

}
