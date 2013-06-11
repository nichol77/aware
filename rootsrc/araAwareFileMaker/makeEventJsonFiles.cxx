////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////  makeEventJsonFiles 
////      This is a simple program that converts event root files into JSON
////      files that can be read by the AWARE web plotter code
////
////    April 2013,  r.nichol@ucl.ac.uk 
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
#include "AraEventCalibrator.h"
#include "FFTtools.h"

//AWARE includes
#include "AwareWaveformEventFileMaker.h"
#include "AwareRunSummaryFileMaker.h"
#include "AwareRunDatabase.h"
#include "AwareEventDatabase.h"

//Include FFTtools.h if you want to ask the correlation, etc. tools

//ROOT Includes
#include "TTree.h"
#include "TFile.h"
#include "TGraph.h"
#include "TTimeStamp.h"
#include "TSystem.h"

#include <map>

RawIcrrStationEvent *rawIcrrEvPtr=0;
RawAtriStationEvent *rawAtriEvPtr=0;
RawAraStationEvent *rawEvPtr=0;
UsefulIcrrStationEvent *realIcrrEvPtr=0;
UsefulAtriStationEvent *realAtriEvPtr=0;
UsefulAraStationEvent *realEvPtr=0;

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
  int stationId=2;

  AraGeomTool *fGeomTool = AraGeomTool::Instance();

  TTimeStamp timeStamp;
  if(isIcrrEvent) {
    sprintf(stationName,"%s",fGeomTool->getStationName(rawIcrrEvPtr->getStationId()));
    timeStamp=TTimeStamp(rawIcrrEvPtr->head.unixTime);
  }
  else {
    timeStamp=TTimeStamp(rawAtriEvPtr->unixTime);
    sprintf(stationName,"%s",fGeomTool->getStationName(rawAtriEvPtr->getStationId()));
    stationId=rawAtriEvPtr->getStationId();
  }   
  UInt_t dateInt=timeStamp.GetDate();
  UInt_t firstTime=timeStamp.GetSec();



  char outputDir[FILENAME_MAX];
  char *outputDirEnv=getenv("AWARE_OUTPUT_DIR");
  if(outputDirEnv==NULL) {
    sprintf(outputDir,"/unix/ara/data/aware/output");
  }
  else {
    strncpy(outputDir,outputDirEnv,FILENAME_MAX);
  }
    


  char dirName[FILENAME_MAX];
  sprintf(dirName,"%s/%s/%d/%04d/run%d/",outputDir,stationName,dateInt/10000,dateInt%10000,runNumber);
  gSystem->mkdir(dirName,kTRUE);

  std::cout << "Making: " << dirName << "\n";

  //Pedestal fun
  if(argc>2) {
    std::ifstream PedList(argv[2]);    
    int pedRun,lastPedRun=-1;
    char pedFileName[FILENAME_MAX];
    char lastPedFileName[FILENAME_MAX];
    while(PedList >> pedRun >> pedFileName) {
      if(pedRun>runNumber) {
	//Take the last guy
	if(lastPedRun==-1) {
	  lastPedRun=pedRun;
	  strncpy(lastPedFileName,pedFileName,FILENAME_MAX);
	}	  
	break;
      }
      lastPedRun=pedRun;
      strncpy(lastPedFileName,pedFileName,FILENAME_MAX);
    }
    //Got the pedestal run

    AraEventCalibrator::Instance()->setAtriPedFile(lastPedFileName, stationId);

    
  }
  AwareEventDatabase eventDb(outputDir,stationName,dateInt,runNumber);
  
  AwareRunSummaryFileMaker summaryFile(runNumber,stationName);
   
  std::map <Int_t, Double_t> fEventCountMap;
  std::map <Int_t, Double_t> fEventNumberMap;
  std::map <Int_t, Double_t> fRFEventCountMap;
  std::map <Int_t, Double_t> fSoftEventCountMap;
  std::map <Int_t, Double_t> fCalEventCountMap;
  std::map <Int_t, Double_t> fRMSMap[20];

  //  numEntries=200;
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
      if(realIcrrEvPtr) delete realIcrrEvPtr;
      realIcrrEvPtr = new UsefulIcrrStationEvent(rawIcrrEvPtr, AraCalType::kLatestCalib);
      realEvPtr=realIcrrEvPtr;
      eventNumber=rawIcrrEvPtr->head.eventNumber;
      unixTime=rawIcrrEvPtr->head.unixTime;
      triggerTime=rawIcrrEvPtr->getRubidiumTriggerTimeInSec();
    }
    else if(isAtriEvent){
      if(realAtriEvPtr) delete realAtriEvPtr;
      realAtriEvPtr = new UsefulAtriStationEvent(rawAtriEvPtr, AraCalType::kLatestCalib);
      realEvPtr=realAtriEvPtr;
      eventNumber=rawAtriEvPtr->eventNumber;
      unixTime=rawAtriEvPtr->unixTime;
      triggerTime=rawAtriEvPtr->timeStamp;
    }
    TTimeStamp timeStamp(unixTime,0);

    int isSoftTrig=0;
    if(rawAtriEvPtr->numReadoutBlocks<80) isSoftTrig=1;
    int isCalPulser=0;
    if(rawAtriEvPtr->isCalpulserEvent()) isCalPulser=1;

    char outName[FILENAME_MAX];
    sprintf(outName,"%s/%s/%d/%04d/run%d/events%d",outputDir,stationName,dateInt/10000,dateInt%10000,runNumber,eventNumber-(eventNumber%1000));
    gSystem->mkdir(outName,kTRUE);

    sprintf(outName,"%s/%s/%d/%04d/run%d/events%d/event%d.json.gz",outputDir,stationName,dateInt/10000,dateInt%10000,runNumber,eventNumber-(eventNumber%1000),eventNumber);
    //    std::cout << outName << "\n";



    Int_t numChannels=realEvPtr->getNumRFChannels();

    AwareWaveformEventFileMaker fileMaker(runNumber,eventNumber,stationName,outName);    
    fileMaker.addVariableToEvent("time",timeStamp.AsString("sl"));
    fileMaker.addVariableToEvent("triggerTime",triggerTime);

    TGraph *gr[100]={0};

    Double_t rmsValues[20];
    

    for( int i=0; i<numChannels; ++i ) {
      TGraph *grTemp = realEvPtr->getGraphFromRFChan(i);   
      rmsValues[i]=grTemp->GetRMS(2);
      Double_t deltaT=grTemp->GetX()[grTemp->GetN()-1]-grTemp->GetX()[0];
      deltaT/=(grTemp->GetN()-1);
      gr[i]=FFTtools::getInterpolatedGraph(grTemp,deltaT);
      delete grTemp;
      char label[10];
      //      AraAntennaInfo *antInfo = statInfo->getAntennaInfo(i);
      sprintf(label,"RF %d",i);
      if(gr[i]) {
	//	std::cout << "make: " << eventNumber << "\t" << i << "\t" << deltaT << "\n";
	fileMaker.addChannelToFile(gr[i],i,label);
      }      
    }

    fileMaker.writeFile();
    eventDb.addEventToList(eventNumber);

    for( int i=0; i<numChannels; ++i ) {
      delete gr[i];
    }


    std::map <Int_t, Double_t>::iterator mainIt=fEventCountMap.find(unixTime/60);
    if(mainIt==fEventCountMap.end()) {
      //Not got this time yet
      fEventCountMap[unixTime/60]=1;
      fEventNumberMap[unixTime/60]=eventNumber;
      if(isSoftTrig) {
	fRFEventCountMap[unixTime/60]=0;
	fSoftEventCountMap[unixTime/60]=1;
	fCalEventCountMap[unixTime/60]=0;
      }
      else  {
	fSoftEventCountMap[unixTime/60]=0;
	fRFEventCountMap[unixTime/60]=1;
	if(isCalPulser) {
	  fCalEventCountMap[unixTime/60]=1;
	}
	fCalEventCountMap[unixTime/60]=0;
      }
      for(int i=0;i<20;i++) {
	fRMSMap[i][unixTime/60]=rmsValues[i];
      }
    }
    else {
      //Already got this one
      fEventCountMap[unixTime/60]++;
      fEventNumberMap[unixTime/60]+=eventNumber;
      if(isSoftTrig) {
	fSoftEventCountMap[unixTime/60]+=1;
      }
      else {
	fRFEventCountMap[unixTime/60]+=1;
	if(isCalPulser) {
	  fCalEventCountMap[unixTime/60]+=1;
	}
      }
      
      for(int i=0;i<20;i++) {
	fRMSMap[i][unixTime/60]+=rmsValues[i];
      }
    }
      

    //Plots to make:
    //Raw event rate   /// done this one
    //RF event rate /// done this one
    //Software trigger event rate  ///done this one
    //CalPulser event rate //done this one
    //Channel RMS?
    //Power spectrum fun?    
  }
  std::cerr << "\n";

  //The event list
  eventDb.writeEventList();

  //Now loop over thingies add them to the thingy and do the thingy
  
  std::map <Int_t, Double_t>::iterator mainIt=fEventCountMap.begin();
  double lastEventNumber=-1;
  for(;mainIt!=fEventCountMap.end();mainIt++) {
    int sec=mainIt->first;
    double numEvents=mainIt->second;
    double rawEventAvg=fEventNumberMap[sec]/numEvents;
    double estEventRate=numEvents/60;
    if(lastEventNumber>=0) {
      estEventRate=(rawEventAvg-lastEventNumber)/60;
    }
    lastEventNumber=rawEventAvg;


    double rfEventAvg=fRFEventCountMap[sec]/numEvents;
    double softEventAvg=fSoftEventCountMap[sec]/numEvents;
    double calEventAvg=fCalEventCountMap[sec]/numEvents;   
    double avgRms[20]={0};   
    for(int i=0;i<20;i++) {
      avgRms[i]=fRMSMap[i][sec]/numEvents;
    }    
    //Summary file fun
    char elementName[180];
    char elementLabel[180];
    summaryFile.addVariablePoint("rawEventRate","Raw Event Rate",sec*60,numEvents/60);
    summaryFile.addVariablePoint("eventRate","Event Rate",sec*60,estEventRate);
    summaryFile.addVariablePoint("softEventRate","Soft Event Rate",sec*60,softEventAvg/60);
    summaryFile.addVariablePoint("rfEventRate","RF Event Rate",sec*60,rfEventAvg/60);
    summaryFile.addVariablePoint("calEventRate","Cal. Event Rate",sec*60,calEventAvg/60);

    for( int i=0; i<20; ++i ) {
      sprintf(elementName,"rms_%d",i);
      sprintf(elementLabel,"RF %d",i+1);
      summaryFile.addVariablePoint(elementName,elementLabel,sec*60,avgRms[i]);
    }
  }
  
  
  char outName[FILENAME_MAX];
  sprintf(outName,"%s/%s/%04d/%04d/run%d/full",outputDir,stationName,dateInt/10000,dateInt%10000,runNumber);
  gSystem->mkdir(outName,kTRUE);

  summaryFile.writeFullJSONFiles(outName,"header");
  sprintf(outName,"%s/%s/%04d/%04d/run%d/headerSummary.json.gz",outputDir,stationName,dateInt/10000,dateInt%10000,runNumber);
  summaryFile.writeSummaryJSONFile(outName);

  sprintf(outName,"%s/%s/%04d/%04d/run%d/headerTime.json.gz",outputDir,stationName,dateInt/10000,dateInt%10000,runNumber);
  summaryFile.writeTimeJSONFile(outName);
  
 
//   sprintf(outName,"%s/%s/lastEvent",outputDir,stationName);
//   AwareRunDatabase::updateTouchFile(outName,runNumber,firstTime);
//   sprintf(outName,"%s/%s/lastRun",outputDir,stationName);
//   AwareRunDatabase::updateTouchFile(outName,runNumber,firstTime);

}
