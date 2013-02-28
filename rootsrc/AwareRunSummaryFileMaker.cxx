////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////// Simple Class to handle the making of AWARE Summary XML Files/////////
//////                                                             /////////
////// r.nichol@ucl.ac.uk --- December 2012                        /////////
////////////////////////////////////////////////////////////////////////////

#include "AwareRunSummaryFileMaker.h"

#include <iostream>

//TinyXML Includes
#include "tinyxml2.h"
using namespace tinyxml2;


#define XML_BUFFER_SIZE 40960
char xmlBuffer[XML_BUFFER_SIZE];



AwareRunSummaryFileMaker::AwareRunSummaryFileMaker(Int_t runNumber, const char * stationName)
  :fFullDoc(0),fRootNode(0),fCurrentNode(0),fRun(runNumber),fStationName(stationName)
{

}

void AwareRunSummaryFileMaker::addVariablePoint(const char *elName, TTimeStamp timeStamp, Double_t variable)
{
  std::string elString(elName);
  std::map<std::string,AwareVariableSummary>::iterator it=summaryMap.find(elString);
  if(it!=summaryMap.end()) {
    it->second.addDataPoint(timeStamp,variable);
  }
  else {
    AwareVariableSummary newSummary;
    newSummary.addDataPoint(timeStamp,variable);
    summaryMap[elString]=newSummary;
  }

}



void AwareRunSummaryFileMaker::writeSummaryXMLFile(const char *xmlName)
{
  
  //Now we can write the xml summary file for this run
  XMLDocument *doc = new XMLDocument();
  doc->InsertEndChild(doc->NewDeclaration());

  XMLNode* rootNode = doc->InsertEndChild( doc->NewElement( "runSum" ) );

  XMLElement *stationNode=doc->NewElement("station");
  XMLUtil::ToStr(20,xmlBuffer,XML_BUFFER_SIZE);
  stationNode->InsertFirstChild(doc->NewText(fStationName.c_str()));  
  rootNode->InsertEndChild(stationNode);
  
  XMLElement *run=doc->NewElement("run");
  XMLUtil::ToStr(fRun,xmlBuffer,XML_BUFFER_SIZE);
  run->InsertFirstChild(doc->NewText(xmlBuffer));  
  rootNode->InsertEndChild(run);

  std::map<std::string,AwareVariableSummary>::iterator it=summaryMap.begin();
  //Lets assume for now that all variables have the same time
  XMLElement *startTime = doc->NewElement("startTime");
  startTime->InsertFirstChild(doc->NewText(it->second.getFirstTimeString()));
  rootNode->InsertEndChild(startTime);

  //Lets assume for now that all variables have the duration
  XMLElement *duration = doc->NewElement("duration");
  XMLUtil::ToStr(it->second.getDuration(),xmlBuffer,XML_BUFFER_SIZE);
  duration->InsertFirstChild(doc->NewText(xmlBuffer));
  rootNode->InsertEndChild(duration);
  
  XMLElement *currentStack=0;
  Int_t currentId=-1;
  for(;it!=summaryMap.end();it++) {
    char elementName[180];

    int posDot=it->first.find(".");
    if(posDot<0) {
      if(currentStack) {
	rootNode->InsertEndChild(currentStack);
	currentStack=0;
      }
      sprintf(elementName,"%s",it->first.c_str());
    }
    else {
      int posScore=it->first.find("_");
      if(posScore>0) {
	int thisId=atoi(it->first.substr(posScore+1,posDot-posScore-1).c_str());
	sprintf(elementName,"%s",it->first.substr(posDot+1).c_str());
	//	std::cout << currentId << "\t" << it->first.substr(0,posScore)<< "\t" << posScore << "\t" << posDot << "\t" << elementName << "\n";       
	
	if(thisId!=currentId) {
	  if(currentStack) {
	    rootNode->InsertEndChild(currentStack);
	    currentStack=0;
	  }
	  currentId=thisId;
	  currentStack = doc->NewElement(it->first.substr(0,posScore).c_str());
	  currentStack->SetAttribute("id",currentId);
	}	
      }
    }


    XMLElement *element = doc->NewElement(elementName);

    XMLElement *mean = doc->NewElement("mean");
    XMLUtil::ToStr(it->second.getRunMean(),xmlBuffer,XML_BUFFER_SIZE);
    mean->InsertFirstChild(doc->NewText(xmlBuffer));
    element->InsertEndChild(mean);

    XMLElement *stdDev = doc->NewElement("stdDev");
    XMLUtil::ToStr(it->second.getRunStdDev(),xmlBuffer,XML_BUFFER_SIZE);
    stdDev->InsertFirstChild(doc->NewText(xmlBuffer));
    element->InsertEndChild(stdDev);

    XMLElement *numEnts = doc->NewElement("numEnts");
    XMLUtil::ToStr(it->second.getRunNumEnts(),xmlBuffer,XML_BUFFER_SIZE);
    numEnts->InsertFirstChild(doc->NewText(xmlBuffer));
    element->InsertEndChild(numEnts);
    
    if(currentStack) {
      currentStack->InsertEndChild(element);
    }
    else {
      rootNode->InsertEndChild(element);
    }
  }
  if(currentStack)
    rootNode->InsertEndChild(currentStack);

  doc->SaveFile(xmlName);
  delete doc;
  
}



void AwareRunSummaryFileMaker::writeTimeXMLFile(const char *xmlName)
{
  
  //Now we can write the xml summary file for this run
  XMLDocument *doc = new XMLDocument();
  doc->InsertEndChild(doc->NewDeclaration());

  XMLNode* rootNode = doc->InsertEndChild( doc->NewElement( "timeSum" ) );

  XMLElement *stationNode=doc->NewElement("station");
  XMLUtil::ToStr(20,xmlBuffer,XML_BUFFER_SIZE);
  stationNode->InsertFirstChild(doc->NewText(fStationName.c_str()));  
  rootNode->InsertEndChild(stationNode);
  
  XMLElement *run=doc->NewElement("run");
  XMLUtil::ToStr(fRun,xmlBuffer,XML_BUFFER_SIZE);
  run->InsertFirstChild(doc->NewText(xmlBuffer));  
  rootNode->InsertEndChild(run);


  std::map<std::string,AwareVariableSummary>::iterator it=summaryMap.begin();  
  XMLElement *currentStack=0;
  Int_t currentId=-1;
  for(;it!=summaryMap.end();it++) {
    char elementName[180];

    int posDot=it->first.find(".");
    if(posDot<0) {
      if(currentStack) {
	rootNode->InsertEndChild(currentStack);
	currentStack=0;
      }
      sprintf(elementName,"%s",it->first.c_str());
    }
    else {
      int posScore=it->first.find("_");
      if(posScore>0) {
	int thisId=atoi(it->first.substr(posScore+1,posDot-posScore-1).c_str());
	sprintf(elementName,"%s",it->first.substr(posDot+1).c_str());
	//	std::cout << currentId << "\t" << it->first.substr(0,posScore)<< "\t" << posScore << "\t" << posDot << "\t" << elementName << "\n";       
	
	if(thisId!=currentId) {
	  if(currentStack) {
	    rootNode->InsertEndChild(currentStack);
	    currentStack=0;
	  }
	  currentId=thisId;
	  currentStack = doc->NewElement(it->first.substr(0,posScore).c_str());
	  currentStack->SetAttribute("id",currentId);
	}	
      }
    }


    XMLElement *element = doc->NewElement(elementName);
    //Now add loop over time

    std::map<UInt_t,AwareVariable>::iterator timeIt = it->second.timeMapBegin();
    for(;timeIt!=it->second.timeMapEnd();timeIt++) {
      XMLElement *timePoint = doc->NewElement("point");
      
      XMLElement *startTime = doc->NewElement("startTime");
      startTime->InsertFirstChild(doc->NewText(timeIt->second.getStartTimeString()));
      timePoint->InsertEndChild(startTime);

      
      XMLElement *duration = doc->NewElement("duration");
      XMLUtil::ToStr(timeIt->second.getDuration(),xmlBuffer,XML_BUFFER_SIZE);
      duration->InsertFirstChild(doc->NewText(xmlBuffer));
      timePoint->InsertEndChild(duration);


      XMLElement *mean = doc->NewElement("mean");
      XMLUtil::ToStr(timeIt->second.getMean(),xmlBuffer,XML_BUFFER_SIZE);
      mean->InsertFirstChild(doc->NewText(xmlBuffer));
      timePoint->InsertEndChild(mean);      
      
      XMLElement *stdDev = doc->NewElement("stdDev");
      XMLUtil::ToStr(timeIt->second.getStdDev(),xmlBuffer,XML_BUFFER_SIZE);
      stdDev->InsertFirstChild(doc->NewText(xmlBuffer));
      timePoint->InsertEndChild(stdDev);
      
      XMLElement *numEnts = doc->NewElement("numEnts");
      XMLUtil::ToStr(timeIt->second.getNumEnts(),xmlBuffer,XML_BUFFER_SIZE);
      numEnts->InsertFirstChild(doc->NewText(xmlBuffer));
      timePoint->InsertEndChild(numEnts);
      element->InsertEndChild(timePoint);
    }    

    if(currentStack) {
      currentStack->InsertEndChild(element);
    }
    else {
      rootNode->InsertEndChild(element);
    }
  }
  if(currentStack)
    rootNode->InsertEndChild(currentStack);

  doc->SaveFile(xmlName);
  delete doc;

}

void AwareRunSummaryFileMaker::startFullXMLFile(const char *rootNode)
{
  fFullDoc  = new XMLDocument();
  fFullDoc->InsertEndChild(fFullDoc->NewDeclaration());
  

  fRootNode = fFullDoc->InsertEndChild( fFullDoc->NewElement( rootNode ) );
  fCurrentNode = fRootNode;
  
  
}


void AwareRunSummaryFileMaker::addNewNode(const char *nodeName, const char *attName, int attVal)
{
  XMLNode *node = fCurrentNode->InsertEndChild(fFullDoc->NewElement(nodeName));
  if(attName) {
    XMLElement *elly = (XMLElement*)node;
    elly->SetAttribute(attName,attVal);
  }
  fSubNodeList.push_back(node);
  fCurrentNode=node;
}

void AwareRunSummaryFileMaker::addNewElement(const char *elName, const char *elBuffer)
{
  
  XMLElement *element=fFullDoc->NewElement(elName);
  element->InsertFirstChild(fFullDoc->NewText(elBuffer)); 
  fCurrentNode->InsertEndChild(element);

}

void AwareRunSummaryFileMaker::finishCurrentNode()
{
  int numNodes = fSubNodeList.size();
  if(numNodes>0) {
    //Remove last node
    fSubNodeList.erase(fSubNodeList.begin()+(numNodes-1));
  }
  if(numNodes>1) {
    fCurrentNode=fSubNodeList.back();
  }
  else {
    fCurrentNode=fRootNode;
  }
}

void AwareRunSummaryFileMaker::writeFullXMLFile(const char *xmlName)
{
  if(fFullDoc) {   
    fFullDoc->SaveFile(xmlName);
    delete fFullDoc;
    fFullDoc=0;
    fCurrentNode=0;
    fRootNode=0;
    fSubNodeList.clear();
  }
}

