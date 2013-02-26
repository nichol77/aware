////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////  exampleLoop.cxx 
////      Just a very simple example that loops over RawAraEvent objects 
////      calibrating them to make a UsefulAraEvent
////
////    Feb 2011,  rjn@hep.ucl.ac.uk 
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

//Include FFTtools.h if you want to ask the correlation, etc. tools

//ROOT Includes
#include "TTree.h"
#include "TFile.h"
#include "TGraph.h"
#include "TTimeStamp.h"

//TinyXML Includes
#include "tinyxml2.h"
using namespace tinyxml2;

#define XML_BUFFER_SIZE 40960

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

   
  AraGeomTool *fGeomTool = AraGeomTool::Instance();

  char xmlBuffer[XML_BUFFER_SIZE];

  //  numEntries=1;
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
      realAtriEvPtr = new UsefulAtriStationEvent(rawAtriEvPtr, AraCalType::kLatestCalib);
      realEvPtr=realAtriEvPtr;
      eventNumber=rawAtriEvPtr->eventNumber;
      unixTime=rawAtriEvPtr->unixTime;
    }
    TTimeStamp timeStamp(unixTime,0);
    //    std::cout << "Run: "<< realEvPtr->
     
    //Now you can do whatever analysis you want
    //e.g.
    //    AraStationId_t stationId=rawEvPtr->getStationId();
    //    std::cout << "Station Id: " << int(stationId) << "\n";
    //    std::cout << "Station Name: " << fGeomTool->getStationName(rawEvPtr->getStationId()) << "\n";
    Int_t numChannels=realEvPtr->getNumRFChannels();
   


    XMLDocument *doc = new XMLDocument();
    doc->InsertEndChild(doc->NewDeclaration());
    XMLNode* rootNode = doc->InsertEndChild( doc->NewElement( "root" ) );

    XMLElement *stationNode=doc->NewElement("station");
    XMLUtil::ToStr(20,xmlBuffer,XML_BUFFER_SIZE);
    stationNode->InsertFirstChild(doc->NewText(fGeomTool->getStationName(rawEvPtr->getStationId())));  
    rootNode->InsertEndChild(stationNode);


    XMLElement *run=doc->NewElement("run");
    XMLUtil::ToStr(runNumber,xmlBuffer,XML_BUFFER_SIZE);
    run->InsertFirstChild(doc->NewText(xmlBuffer));  
    rootNode->InsertEndChild(run);

    XMLElement *eventNum=doc->NewElement("eventNum");
    XMLUtil::ToStr(eventNumber,xmlBuffer,XML_BUFFER_SIZE);
    eventNum->InsertFirstChild(doc->NewText(xmlBuffer));  
    rootNode->InsertEndChild(eventNum);

    XMLElement *time=doc->NewElement("time");
    time->InsertFirstChild(doc->NewText(timeStamp.AsString("sl")));
    rootNode->InsertEndChild(time);

    XMLElement *triggerTimeNode=doc->NewElement("triggerTime");
    XMLUtil::ToStr(triggerTime,xmlBuffer,XML_BUFFER_SIZE);
    triggerTimeNode->InsertFirstChild(doc->NewText(xmlBuffer));  
    rootNode->InsertEndChild(triggerTimeNode);

    XMLElement *numChannelsNode=doc->NewElement("numChannels");
    XMLUtil::ToStr(numChannels,xmlBuffer,XML_BUFFER_SIZE);
    numChannelsNode->InsertFirstChild(doc->NewText(xmlBuffer));
    rootNode->InsertEndChild(numChannelsNode);


    XMLElement* channel[16];   
    for( int i=0; i<numChannels; ++i ) {
      channel[i]=doc->NewElement( "channel" );
      channel[i]->SetAttribute( "id", i );



      TGraph *gr=realEvPtr->getGraphFromRFChan(i);   

      if(gr) {
	XMLElement *numSamples=doc->NewElement("numSamples");
	XMLUtil::ToStr(gr->GetN(),xmlBuffer,XML_BUFFER_SIZE);
	numSamples->InsertFirstChild(doc->NewText(xmlBuffer));
	channel[i]->InsertEndChild(numSamples);

	Double_t *tVals=gr->GetX();
	Double_t *vVals=gr->GetY();

	sprintf(xmlBuffer,"%3.1f",tVals[0]);
	for(int samp=1;samp<gr->GetN();samp++) {
	  sprintf(xmlBuffer,"%s,%3.1f",xmlBuffer,tVals[samp]);
	}
	XMLElement *tValsNode=doc->NewElement("tVals");
	tValsNode->InsertFirstChild(doc->NewText(xmlBuffer));
	channel[i]->InsertEndChild(tValsNode);	

	sprintf(xmlBuffer,"%3.0f",vVals[0]);
	for(int samp=1;samp<gr->GetN();samp++) {
	  sprintf(xmlBuffer,"%s,%3.0f",xmlBuffer,vVals[samp]);
	}
	XMLElement *vValsNode=doc->NewElement("vVals");
	vValsNode->InsertFirstChild(doc->NewText(xmlBuffer));
	channel[i]->InsertEndChild(vValsNode);	

	
	rootNode->InsertEndChild(channel[i]);
	delete gr;
      }
      

    }
    char outName[FILENAME_MAX];
    sprintf(outName,"output/2012/1023/run30525/event%d.xml",eventNumber);

    doc->SaveFile(outName);
    delete doc;
   
  }
  std::cerr << "\n";

  
 

}
