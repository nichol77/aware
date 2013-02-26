////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////  makeEventHkXmlFiles 
////      This is a simple program that converts sensor hk root files into XML
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

//TinyXML Includes
#include "tinyxml2.h"
using namespace tinyxml2;

//AWARE Includes
#include "AwareRunSummaryFileMaker.h"

#define XML_BUFFER_SIZE 40960

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

  
  char xmlBuffer[XML_BUFFER_SIZE];
  

  //Now we can write the xml file for this run
  XMLDocument *doc = new XMLDocument();
  doc->InsertEndChild(doc->NewDeclaration());


  char stationName[20];
  sprintf(stationName,"%s",fGeomTool->getStationName(eventHkPtr->getStationId()));

  XMLElement *stationNode=doc->NewElement("station");
  XMLUtil::ToStr(20,xmlBuffer,XML_BUFFER_SIZE);
  stationNode->InsertFirstChild(doc->NewText(fGeomTool->getStationName(eventHkPtr->getStationId())));  
  doc->InsertEndChild(stationNode);
  
  XMLElement *run=doc->NewElement("run");
  XMLUtil::ToStr(runNumber,xmlBuffer,XML_BUFFER_SIZE);
  run->InsertFirstChild(doc->NewText(xmlBuffer));  
  doc->InsertEndChild(run);

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
     
    XMLNode* hkNode = doc->InsertEndChild( doc->NewElement( "eventHk" ) );

    XMLElement *time=doc->NewElement("time");
    time->InsertFirstChild(doc->NewText(timeStamp.AsString("sl")));
    hkNode->InsertEndChild(time);

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

    XMLElement *ppsCounterNode=doc->NewElement("ppsCounter");
    XMLUtil::ToStr(eventHkPtr->getPpsCounter(),xmlBuffer,XML_BUFFER_SIZE);
    ppsCounterNode->InsertFirstChild(doc->NewText(xmlBuffer));  
    hkNode->InsertEndChild(ppsCounterNode);
    
    XMLElement *clockCounterNode=doc->NewElement("clockCounter");
    XMLUtil::ToStr(eventHkPtr->getClockCounter(),xmlBuffer,XML_BUFFER_SIZE);
    clockCounterNode->InsertFirstChild(doc->NewText(xmlBuffer));  
    hkNode->InsertEndChild(clockCounterNode);

   

    for( int i=0; i<DDA_PER_ATRI; ++i ) {
      XMLElement *stackNode=doc->NewElement( "stack" );
      stackNode->SetAttribute( "id", i );

      XMLElement *wilkinsonCounterNs=doc->NewElement("wilkinsonCounterNs");
      XMLUtil::ToStr(eventHkPtr->getWilkinsonCounterNs(i),xmlBuffer,XML_BUFFER_SIZE);
      wilkinsonCounterNs->InsertFirstChild(doc->NewText(xmlBuffer));
      stackNode->InsertEndChild(wilkinsonCounterNs);

      XMLElement *wilkinsonDelay=doc->NewElement("wilkinsonDelay");
      XMLUtil::ToStr(eventHkPtr->getWilkinsonDelay(i),xmlBuffer,XML_BUFFER_SIZE);
      wilkinsonDelay->InsertFirstChild(doc->NewText(xmlBuffer));
      stackNode->InsertEndChild(wilkinsonDelay);

      XMLElement *vdlyDac=doc->NewElement("vdlyDac");
      XMLUtil::ToStr(eventHkPtr->getVdlyDac(i),xmlBuffer,XML_BUFFER_SIZE);
      vdlyDac->InsertFirstChild(doc->NewText(xmlBuffer));
      stackNode->InsertEndChild(vdlyDac);

      XMLElement *vadjDac=doc->NewElement("vadjDac");
      XMLUtil::ToStr(eventHkPtr->getVadjDac(i),xmlBuffer,XML_BUFFER_SIZE);
      vadjDac->InsertFirstChild(doc->NewText(xmlBuffer));
      stackNode->InsertEndChild(vadjDac);

      for(int chan=0;chan<TDA_PER_ATRI;chan++) {
	sprintf(elementName,"singleChannelRate%d",chan);
	XMLElement *singleChannelRate=doc->NewElement(elementName);
	XMLUtil::ToStr(eventHkPtr->getSingleChannelRateHz(i,chan),xmlBuffer,XML_BUFFER_SIZE);
	singleChannelRate->InsertFirstChild(doc->NewText(xmlBuffer));
	stackNode->InsertEndChild(singleChannelRate);

	sprintf(elementName,"singleChannelThreshold%d",chan);
	XMLElement *singleChannelThreshold=doc->NewElement(elementName);
	XMLUtil::ToStr(eventHkPtr->getSingleChannelThreshold(i,chan),xmlBuffer,XML_BUFFER_SIZE);
	singleChannelThreshold->InsertFirstChild(doc->NewText(xmlBuffer));
	stackNode->InsertEndChild(singleChannelThreshold);
      }

      XMLElement *oneOfFourRate=doc->NewElement("oneOfFourRate");
      XMLUtil::ToStr(eventHkPtr->getOneOfFourRateHz(i),xmlBuffer,XML_BUFFER_SIZE);
      oneOfFourRate->InsertFirstChild(doc->NewText(xmlBuffer));
      stackNode->InsertEndChild(oneOfFourRate);

      XMLElement *twoOfFourRate=doc->NewElement("twoOfFourRate");
      XMLUtil::ToStr(eventHkPtr->getTwoOfFourRateHz(i),xmlBuffer,XML_BUFFER_SIZE);
      twoOfFourRate->InsertFirstChild(doc->NewText(xmlBuffer));
      stackNode->InsertEndChild(twoOfFourRate);      

      XMLElement *threeOfFourRate=doc->NewElement("threeOfFourRate");
      XMLUtil::ToStr(eventHkPtr->getThreeOfFourRateHz(i),xmlBuffer,XML_BUFFER_SIZE);
      threeOfFourRate->InsertFirstChild(doc->NewText(xmlBuffer));
      stackNode->InsertEndChild(threeOfFourRate);      
	
      hkNode->InsertEndChild(stackNode);
    }
     

    XMLElement *threeOfEight0Node=doc->NewElement("threeOfEight0");
    XMLUtil::ToStr(eventHkPtr->getThreeOfEightRateHz(0),xmlBuffer,XML_BUFFER_SIZE);
    threeOfEight0Node->InsertFirstChild(doc->NewText(xmlBuffer));  
    hkNode->InsertEndChild(threeOfEight0Node);

    XMLElement *threeOfEight1Node=doc->NewElement("threeOfEight1");
    XMLUtil::ToStr(eventHkPtr->getThreeOfEightRateHz(1),xmlBuffer,XML_BUFFER_SIZE);
    threeOfEight1Node->InsertFirstChild(doc->NewText(xmlBuffer));  
    hkNode->InsertEndChild(threeOfEight1Node);
 

    for(int i=0;i<NUM_L4_SCALERS;i++) {
      sprintf(elementName,"l4Scaler%d",i);
      XMLElement *l4ScalerNode=doc->NewElement(elementName);
      XMLUtil::ToStr(eventHkPtr->getL4RateHz(i),xmlBuffer,XML_BUFFER_SIZE);
      l4ScalerNode->InsertFirstChild(doc->NewText(xmlBuffer));  
      hkNode->InsertEndChild(l4ScalerNode);
    }
      
    
  }
  std::cerr << "\n";


  TTimeStamp timeStamp(eventHkPtr->unixTime,0);
  UInt_t dateInt=timeStamp.GetDate();
  
  char outName[FILENAME_MAX];
  sprintf(outName,"output/%s/%d/%04d/run%d/",stationName,dateInt/10000,(dateInt%10000),runNumber);
  //  std::cout << outName << "\n";
  gSystem->mkdir(outName,kTRUE);
  sprintf(outName,"output/%s/%d/%04d/run%d/eventHk.xml",stationName,dateInt/10000,dateInt%10000,runNumber);
  
  doc->SaveFile(outName);
  delete doc;


  sprintf(outName,"output/%s/%d/%04d/run%d/eventHkSummary.xml",stationName,dateInt/10000,dateInt%10000,runNumber);
  summaryFile.writeSummaryXMLFile(outName);

  sprintf(outName,"output/%s/%d/%04d/run%d/eventHkTime.xml",stationName,dateInt/10000,dateInt%10000,runNumber);
  summaryFile.writeTimeXMLFile(outName);
  
  
}
