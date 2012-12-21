////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////// Simple Class to handle the making of AWARE Summary XML Files/////////
//////                                                             /////////
////// r.nichol@ucl.ac.uk --- December 2012                        /////////
////////////////////////////////////////////////////////////////////////////

#ifndef AWARERUNSUMMARYFILEMAKER
#define AWARERUNSUMMARYFILEMAKER

#include "TNamed.h"
#include "TTimeStamp.h"
#include "AwareVariableSummary.h"
#include "tinyxml2.h"

#include <map>



class AwareRunSummaryFileMaker 
{
 public :
  AwareRunSummaryFileMaker(Int_t runNumber, char *stationName);

  void addVariablePoint(const char *elName, TTimeStamp timeStamp, Double_t variable);

  void writeSummaryXMLFile(const char *xmlName);
  void writeTimeXMLFile(const char *xmlName);
  void writeFullXMLFile(const char *xmlName);

  void startFullXMLFile(const char *rootNode);
  void addNewNode(const char *nodeName, const char *attName=0, int attVal=-1);
  void addNewElement(const char *elName, const char *buffer);
  void finishCurrentNode();

 private :
  tinyxml2::XMLDocument *fFullDoc;
  tinyxml2::XMLNode *fRootNode;
  tinyxml2::XMLNode *fCurrentNode;
  std::vector<tinyxml2::XMLNode*> fSubNodeList;
  Int_t fRun;
  std::string fStationName;
  std::map<std::string,AwareVariableSummary> summaryMap;


};

#endif //AWARERUNSUMMARYFILEMAKER
