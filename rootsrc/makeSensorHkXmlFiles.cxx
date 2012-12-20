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
#include "AtriSensorHkData.h"
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

  
  char xmlBuffer[XML_BUFFER_SIZE];
  

  //Now we can write the xml file for this run
  XMLDocument *doc = new XMLDocument();
  doc->InsertEndChild(doc->NewDeclaration());


  XMLElement *stationNode=doc->NewElement("station");
  XMLUtil::ToStr(20,xmlBuffer,XML_BUFFER_SIZE);
  stationNode->InsertFirstChild(doc->NewText(fGeomTool->getStationName(sensorHkPtr->getStationId())));  
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

    //This line gets the SensorHk Entry
    sensorHkTree->GetEntry(event);

    TTimeStamp timeStamp(sensorHkPtr->unixTime,0);
    //    std::cout << "Run: "<< realEvPtr->

    //  std::cout << event << "\t" << timeStamp.AsString("sl") << "\n";
     
    XMLNode* hkNode = doc->InsertEndChild( doc->NewElement( "sensorHk" ) );

    XMLElement *time=doc->NewElement("time");
    time->InsertFirstChild(doc->NewText(timeStamp.AsString("sl")));
    hkNode->InsertEndChild(time);

    //Summary file fun
    char elementName[180];
    summaryFile.addVariablePoint("atriVoltage",timeStamp,sensorHkPtr->getAtriVoltage());
    summaryFile.addVariablePoint("atriCurrent",timeStamp,sensorHkPtr->getAtriCurrent());
    for( int i=0; i<DDA_PER_ATRI; ++i ) {
      sprintf(elementName,"stack_%d.ddaVoltage",i);
      summaryFile.addVariablePoint(elementName,timeStamp,sensorHkPtr->getDdaVoltage(i));
      sprintf(elementName,"stack_%d.ddaCurrent",i);
      summaryFile.addVariablePoint(elementName,timeStamp,sensorHkPtr->getDdaCurrent(i));
      sprintf(elementName,"stack_%d.ddaTemp",i);
      summaryFile.addVariablePoint(elementName,timeStamp,sensorHkPtr->getDdaTemp(i));
      sprintf(elementName,"stack_%d.tdaVoltage",i);
      summaryFile.addVariablePoint(elementName,timeStamp,sensorHkPtr->getTdaVoltage(i));
      sprintf(elementName,"stack_%d.tdaCurrent",i);
      summaryFile.addVariablePoint(elementName,timeStamp,sensorHkPtr->getTdaCurrent(i));
      sprintf(elementName,"stack_%d.tdaTemp",i);
      summaryFile.addVariablePoint(elementName,timeStamp,sensorHkPtr->getTdaTemp(i));
    }

    XMLElement *atriVoltageNode=doc->NewElement("atriVoltage");
    XMLUtil::ToStr(sensorHkPtr->getAtriVoltage(),xmlBuffer,XML_BUFFER_SIZE);
    atriVoltageNode->InsertFirstChild(doc->NewText(xmlBuffer));  
    hkNode->InsertEndChild(atriVoltageNode);
    



    XMLElement *atriCurrentNode=doc->NewElement("atriCurrent");
    XMLUtil::ToStr(sensorHkPtr->getAtriCurrent(),xmlBuffer,XML_BUFFER_SIZE);
    atriCurrentNode->InsertFirstChild(doc->NewText(xmlBuffer));  
    hkNode->InsertEndChild(atriCurrentNode);

   

    for( int i=0; i<DDA_PER_ATRI; ++i ) {
      XMLElement *stackNode=doc->NewElement( "stack" );
      stackNode->SetAttribute( "id", i );

      XMLElement *ddaVoltage=doc->NewElement("ddaVoltage");
      XMLUtil::ToStr(sensorHkPtr->getDdaVoltage(i),xmlBuffer,XML_BUFFER_SIZE);
      ddaVoltage->InsertFirstChild(doc->NewText(xmlBuffer));
      stackNode->InsertEndChild(ddaVoltage);

      XMLElement *ddaCurrent=doc->NewElement("ddaCurrent");
      XMLUtil::ToStr(sensorHkPtr->getDdaCurrent(i),xmlBuffer,XML_BUFFER_SIZE);
      ddaCurrent->InsertFirstChild(doc->NewText(xmlBuffer));
      stackNode->InsertEndChild(ddaCurrent);

      XMLElement *ddaTemp=doc->NewElement("ddaTemp");
      XMLUtil::ToStr(sensorHkPtr->getDdaTemp(i),xmlBuffer,XML_BUFFER_SIZE);
      ddaTemp->InsertFirstChild(doc->NewText(xmlBuffer));
      stackNode->InsertEndChild(ddaTemp);

      XMLElement *tdaVoltage=doc->NewElement("tdaVoltage");
      XMLUtil::ToStr(sensorHkPtr->getTdaVoltage(i),xmlBuffer,XML_BUFFER_SIZE);
      tdaVoltage->InsertFirstChild(doc->NewText(xmlBuffer));
      stackNode->InsertEndChild(tdaVoltage);

      XMLElement *tdaCurrent=doc->NewElement("tdaCurrent");
      XMLUtil::ToStr(sensorHkPtr->getTdaCurrent(i),xmlBuffer,XML_BUFFER_SIZE);
      tdaCurrent->InsertFirstChild(doc->NewText(xmlBuffer));
      stackNode->InsertEndChild(tdaCurrent);

      XMLElement *tdaTemp=doc->NewElement("tdaTemp");
      XMLUtil::ToStr(sensorHkPtr->getTdaTemp(i),xmlBuffer,XML_BUFFER_SIZE);
      tdaTemp->InsertFirstChild(doc->NewText(xmlBuffer));
      stackNode->InsertEndChild(tdaTemp);      
	
      hkNode->InsertEndChild(stackNode);
    }
      
    
  }
  std::cerr << "\n";


  TTimeStamp timeStamp(sensorHkPtr->unixTime,0);
  UInt_t dateInt=timeStamp.GetDate();
  
  char outName[FILENAME_MAX];
  sprintf(outName,"output/%d/%d/run%d/",dateInt/10000,dateInt%10000,runNumber);
  gSystem->mkdir(outName,kTRUE);
  sprintf(outName,"output/%d/%d/run%d/sensorHk.xml",dateInt/10000,dateInt%10000,runNumber);
  
  doc->SaveFile(outName);
  delete doc;


  sprintf(outName,"output/%d/%d/run%d/sensorHkSummary.xml",dateInt/10000,dateInt%10000,runNumber);
  summaryFile.writeSummaryXMLFile(outName);

  sprintf(outName,"output/%d/%d/run%d/sensorHkTime.xml",dateInt/10000,dateInt%10000,runNumber);
  summaryFile.writeTimeXMLFile(outName);
  
  
}
