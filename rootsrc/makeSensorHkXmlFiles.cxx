////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////  makeSensorHkXmlFiles 
////      This is a simple program that converts sensor hk root files into XML
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

  

  char stationName[20];
  sprintf(stationName,"%s",fGeomTool->getStationName(sensorHkPtr->getStationId()));


  char xmlBuffer[XML_BUFFER_SIZE];
  
  //Start the XML File for the full data
  summaryFile.startFullXMLFile("sensorHk");

  //Add station element
  summaryFile.addNewElement("station",fGeomTool->getStationName(sensorHkPtr->getStationId()));
  
  //Add run element
  XMLUtil::ToStr(runNumber,xmlBuffer,XML_BUFFER_SIZE);
  summaryFile.addNewElement("run",xmlBuffer);
  

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

    //Start hk node
    summaryFile.addNewNode("hk");
    
    //Add time element
    summaryFile.addNewElement("time",timeStamp.AsString("sl"));
    
    //Add ATRI Voltage Element
    XMLUtil::ToStr(sensorHkPtr->getAtriVoltage(),xmlBuffer,XML_BUFFER_SIZE);
    summaryFile.addNewElement("atriVoltage",xmlBuffer);

    //Add ATRI Current Element
    XMLUtil::ToStr(sensorHkPtr->getAtriCurrent(),xmlBuffer,XML_BUFFER_SIZE);
    summaryFile.addNewElement("atriCurrent",xmlBuffer);
          
    for( int i=0; i<DDA_PER_ATRI; ++i ) {
       //Add the stack nodes
       summaryFile.addNewNode("stack","id",i);
       
       XMLUtil::ToStr(sensorHkPtr->getDdaVoltage(i),xmlBuffer,XML_BUFFER_SIZE);
       summaryFile.addNewElement("ddaVoltage",xmlBuffer);
       
       XMLUtil::ToStr(sensorHkPtr->getDdaCurrent(i),xmlBuffer,XML_BUFFER_SIZE);
       summaryFile.addNewElement("ddaCurrent",xmlBuffer);
       
       XMLUtil::ToStr(sensorHkPtr->getDdaTemp(i),xmlBuffer,XML_BUFFER_SIZE);
       summaryFile.addNewElement("ddaTemp",xmlBuffer);

       XMLUtil::ToStr(sensorHkPtr->getTdaVoltage(i),xmlBuffer,XML_BUFFER_SIZE);
       summaryFile.addNewElement("tdaVoltage",xmlBuffer);
       
       XMLUtil::ToStr(sensorHkPtr->getTdaCurrent(i),xmlBuffer,XML_BUFFER_SIZE);
       summaryFile.addNewElement("tdaCurrent",xmlBuffer);
       
       XMLUtil::ToStr(sensorHkPtr->getTdaTemp(i),xmlBuffer,XML_BUFFER_SIZE);
       summaryFile.addNewElement("tdaTemp",xmlBuffer);

       //Finish the stack node
       summaryFile.finishCurrentNode();
	
    }
    //Finish the hk node
    summaryFile.finishCurrentNode();
    
  }
  std::cerr << "\n";


  TTimeStamp timeStamp(sensorHkPtr->unixTime,0);
  UInt_t dateInt=timeStamp.GetDate();
  
  char outName[FILENAME_MAX];
  sprintf(outName,"output/%s/%04d/%04d/run%d/",stationName,dateInt/10000,dateInt%10000,runNumber);
  gSystem->mkdir(outName,kTRUE);
  sprintf(outName,"output/%s/%04d/%04d/run%d/sensorHk.xml",stationName,dateInt/10000,dateInt%10000,runNumber);
  summaryFile.writeFullXMLFile(outName);


  sprintf(outName,"output/%s/%04d/%04d/run%d/sensorHkSummary.xml",stationName,dateInt/10000,dateInt%10000,runNumber);
  summaryFile.writeSummaryXMLFile(outName);

  sprintf(outName,"output/%s/%04d/%04d/run%d/sensorHkTime.xml",stationName,dateInt/10000,dateInt%10000,runNumber);
  summaryFile.writeTimeXMLFile(outName);
  
  
}
