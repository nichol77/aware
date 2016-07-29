////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////// Simple Class to handle the making of AWARE Summary JSON Files/////////
//////                                                             /////////
////// r.nichol@ucl.ac.uk --- December 2012                        /////////
////////////////////////////////////////////////////////////////////////////

#include "AwareRunSummaryFileMaker.h"
#include "TSystem.h"
#include <iostream>
#include <iomanip>
#include <fstream>
#include <vector>
#include <boost/iostreams/device/file_descriptor.hpp>
#include <boost/iostreams/filtering_stream.hpp>
#include <boost/iostreams/copy.hpp>
#include <boost/iostreams/device/file.hpp>
#include <boost/iostreams/filter/gzip.hpp>



AwareRunSummaryFileMaker::AwareRunSummaryFileMaker(Int_t runNumber, const char * instrumentName, Int_t numSecondsPerPoint)
   :fRun(runNumber),fNumSecondsPerPoint(numSecondsPerPoint),fInstrumentName(instrumentName)
{

}

void AwareRunSummaryFileMaker::addVariablePoint(const char *elName, const char *label, TTimeStamp timeStamp, Double_t variable, AwareAverageType::AwareAverageType_t avgType, Bool_t hasVoidValue, Double_t voidValue)
{
  std::string elString(elName); //RJN maybe move these string creations to the calling function
  std::string labelString(label);
  static Int_t maxIndex=0;
  Int_t index=0;
  std::map<std::string,Int_t>::iterator elementIt=fElementIndexMap.find(elString);
  if(elementIt==fElementIndexMap.end()) {
    index=fElementIndexMap.size();
    fElementIndexMap.insert(std::pair<std::string, Int_t >(elString,index));
    //Insert label;
    fLabelVec.push_back(labelString);
    //Insert new summary
    AwareVariableSummary newSummary(fNumSecondsPerPoint,avgType,hasVoidValue,voidValue);
    newSummary.addDataPoint(timeStamp,variable);
    fSummaryVec.push_back(newSummary);
    if(index>maxIndex) maxIndex=index;    
  }
  else {
    index=elementIt->second;
    fSummaryVec[index].addDataPoint(timeStamp,variable);
  }


  //Now deal with the raw map
  std::map<Double_t, std::vector<Double_t>>::iterator rawIt=fRawMapVec.find(timeStamp.AsDouble());
  if(rawIt!=fRawMapVec.end()) {
    //Already have this time point;
    try
      {
	rawIt->second.at(index)=variable;
      }
    catch(std::out_of_range const & e)
      {
	rawIt->second.resize(maxIndex);
	rawIt->second.at(index)=variable;
      }
  }
  else {
    //First time for this time new to make vector
    std::vector<Double_t> newTimeVec(maxIndex);
    newTimeVec.at(index)=variable;
    fRawMapVec.insert(std::pair<Double_t,std::vector<Double_t>>(timeStamp.AsDouble(),newTimeVec));
  }
  //  std::map<UInt_t, std::map<std::string, Double_t> > fRawMap;  
}


void AwareRunSummaryFileMaker::writeFullJSONFiles(const char *jsonDir, const char *filePrefix)
{
  std::cout << fRawMapVec.size() << "\n";

  if(fRawMapVec.size()==0) return;
  
  std::vector<std::string> fFileList;

  char jsonName[FILENAME_MAX];
  sprintf(jsonName,"%s/%s_time.json.gz",jsonDir,filePrefix);

  boost::iostreams::filtering_ostream TimeFile;
  TimeFile.push(boost::iostreams::gzip_compressor());
  TimeFile.push(boost::iostreams::file_sink(jsonName));
  //Need to add a check the file is open

//   std::ofstream TimeFile(jsonName);
//   if(!TimeFile) {
//     std::cerr << "Couldn't open " << jsonName << "\n";
//     return;
//   }


  //For now we will justr take the time from the first variable in the map;
  //We have some data    
  TimeFile << "{\n";
  //Start of runSum
  TimeFile << "\t\"full\":{\n";
  TimeFile << "\t\"run\" : " << fRun <<  ",\n";
  TimeFile << "\t\"instrument\" : \"" << fInstrumentName.c_str() <<  "\",\n";
  TimeFile << "\t\"startTime\" : \"" << fSummaryVec[0].getFirstTimeString() <<  "\",\n";
  TimeFile << "\t\"numPoints\" : " << fRawMapVec.size() <<  ",\n";
  TimeFile << "\t\"timeList\" : [\n";


  
  
  //For now get the first time point in the raw map
  std::map<Double_t, std::vector<Double_t> >::iterator fRawMapIt=fRawMapVec.begin();  
  std::map<std::string, Int_t>::iterator elementIt;


  ///Now fill the time file
  int firstInArray=1;
  //Now loop over the fRawMap
  for(fRawMapIt=fRawMapVec.begin();fRawMapIt!=fRawMapVec.end();fRawMapIt++) {
    //First do the time file
    if(!firstInArray) TimeFile << ",\n";
    TimeFile <<  std::setw( 20 ) << std::setprecision( 10 ) << fRawMapIt->first;
    firstInArray=0;
  }  
  TimeFile << " ]\n}\n}\n";
  TimeFile.flush();

  fRawMapIt=fRawMapVec.begin();
 
  //Now loop over the variables the output files
  for(elementIt=fElementIndexMap.begin();elementIt!=fElementIndexMap.end();elementIt++) {
    int index=elementIt->second;
    //Element = elementIt->first
    //Label = fLabelVec[index]
    //Summary = fSummaryVec[index]
    sprintf(jsonName,"%s/%s_%s.json.gz",jsonDir,filePrefix,elementIt->first.c_str());


     boost::iostreams::filtering_ostream FullFile;
     FullFile.push(boost::iostreams::gzip_compressor());
     FullFile.push(boost::iostreams::file_sink(jsonName));
      
     FullFile << "{\n";
     //Start of runSum
     FullFile << "\t\"full\":{\n";
     FullFile << "\t\"run\" : " << fRun <<  ",\n";
     FullFile << "\t\"instrument\" : \"" << fInstrumentName.c_str() <<  "\",\n";
     FullFile << "\t\"name\" : \"" << elementIt->first.c_str() <<  "\",\n";
     FullFile << "\t\"label\" : \"" << fLabelVec[index].c_str() <<  "\",\n";
     FullFile << "\t\"startTime\" : \"" << fSummaryVec[index].getFirstTimeString() <<  "\",\n";
     FullFile << "\t\"numPoints\" : " << fRawMapVec.size() <<  ",\n";
     
     if(fSummaryVec[index].getVoidFlag()) {
	FullFile << "\t\"voidValue\" : " << fSummaryVec[index].getVoidValue() << ",\n";
     }
     if(fSummaryVec[index].getAverageType()!=AwareAverageType::kAngleDegree) {
	FullFile << "\t\"avgType\" : \"angleDegree\",\n";
     } 
     FullFile << "\t\"timeList\" : [\n";
     
     
     int firstInArray=1;
     //Now loop over the time file again
     for(fRawMapIt=fRawMapVec.begin();fRawMapIt!=fRawMapVec.end();fRawMapIt++) {	   
       if(!firstInArray) FullFile << ",\n";
       FullFile << fRawMapIt->second.at(index);  //Should add a try catch
       firstInArray=0;
     }
     FullFile << " ]\n}\n}\n";
     FullFile.flush();
  }
 
}


void AwareRunSummaryFileMaker::writeSingleFullJSONFile(const char *jsonDir, const char *filePrefix)
{
    std::cout << fRawMapVec.size() << "\n";
    
    if(fRawMapVec.size()==0) return;
    
//    std::vector<std::string> fFileList;
    
    char jsonName[FILENAME_MAX];
    sprintf(jsonName,"%s/%s_full.json.gz",jsonDir,filePrefix);
    
    boost::iostreams::filtering_ostream FullFile;
    FullFile.push(boost::iostreams::gzip_compressor());
    FullFile.push(boost::iostreams::file_sink(jsonName));
    //Need to add a check the file is open
    
    //For now we will justr take the time from the first variable in the map;
    //    std::map<std::string,AwareVariableSummary>::iterator sumIt=summaryMap.begin();
    //We have some data
    FullFile << "{\n";
    //Start of runSum
    FullFile << "\t\"time\":{\n";
    FullFile << "\t\"run\" : " << fRun <<  ",\n";
    FullFile << "\t\"instrument\" : \"" << fInstrumentName.c_str() <<  "\",\n";
    FullFile << "\t\"startTime\" : \"" << fSummaryVec[0].getFirstTimeString() <<  "\",\n";
    FullFile << "\t\"numPoints\" : " << fRawMapVec.size() <<  ",\n";
    FullFile << "\t\"timeList\" : [\n";
    
    
    
    //For now get the first time point in the raw map


    //For now get the first time point in the raw map
    std::map<Double_t, std::vector<Double_t> >::iterator fRawMapVecIt=fRawMapVec.begin();  
    std::map<std::string, Int_t>::iterator elementIt;
    
    
    ///Now fill the time file
    int firstInArray=1;
    //Now loop over the fRawMapVec
    for(fRawMapVecIt=fRawMapVec.begin();fRawMapVecIt!=fRawMapVec.end();fRawMapVecIt++) {
        //First do the time file
        if(!firstInArray) FullFile << ",\n";
        FullFile <<  std::setw( 20 ) << std::setprecision( 10 ) << fRawMapVecIt->first;
        firstInArray=0;
    }
    FullFile << " ]\n}\n";

    std::cerr << "Done time\n";
    

    
    fRawMapVecIt=fRawMapVec.begin();
    
    //Now loop over the variables the output files
    
  for(elementIt=fElementIndexMap.begin();elementIt!=fElementIndexMap.end();elementIt++) {
    int index=elementIt->second;
    //Element = elementIt->first
    //Label = fLabelVec[index]
    //Summary = fSummaryVec[index]
    FullFile << ",\n";
    //Start of runSum
    FullFile << "\t\"" << elementIt->first.c_str() << "\":{\n";
    FullFile << "\t\"run\" : " << fRun <<  ",\n";
    FullFile << "\t\"instrument\" : \"" << fInstrumentName.c_str() <<  "\",\n";
    FullFile << "\t\"name\" : \"" << elementIt->first.c_str() <<  "\",\n";
    FullFile << "\t\"label\" : \"" << fLabelVec[index].c_str() <<  "\",\n";
    FullFile << "\t\"startTime\" : \"" << fSummaryVec[index].getFirstTimeString() <<  "\",\n";
    FullFile << "\t\"numPoints\" : " << fRawMapVec.size() <<  ",\n";
      
    if(fSummaryVec[index].getVoidFlag()) {
      FullFile << "\t\"voidValue\" : " << fSummaryVec[index].getVoidValue() << ",\n";
    }
    if(fSummaryVec[index].getAverageType()!=AwareAverageType::kAngleDegree) {
      FullFile << "\t\"avgType\" : \"angleDegree\",\n";
    }
    FullFile << "\t\"timeList\" : [\n";
      
      
    int firstInArray=1;
    //Now loop over the time file again
    for(fRawMapVecIt=fRawMapVec.begin();fRawMapVecIt!=fRawMapVec.end();fRawMapVecIt++) {	   
       if(!firstInArray) FullFile << ",\n";
       FullFile << fRawMapVecIt->second.at(index);  //Should add a try catch
       firstInArray=0;
    }
     
    FullFile << "]\n}";
  }
  FullFile << "\n}\n";
  FullFile.flush();
  //  std::cerr << "Here\n";        
}



void AwareRunSummaryFileMaker::writeTimeJSONFile(const char *jsonName)
{


  boost::iostreams::filtering_ostream TimeFile;
  TimeFile.push(boost::iostreams::gzip_compressor());
  TimeFile.push(boost::iostreams::file_sink(jsonName));

  //For now we will justr take the time from the first variable in the map;
  //  std::map<std::string,AwareVariableSummary>::iterator it=summaryMap.begin();  
  
  if(fSummaryVec[0].timeMapSize()>0) {
    //We have some data    
    TimeFile << "{\n";
    //Start of runSum
    TimeFile << "\t\"timeSum\":{\n";
    TimeFile << "\t\"run\" : " << fRun <<  ",\n";
    TimeFile << "\t\"instrument\" : \"" << fInstrumentName.c_str() <<  "\",\n";
    TimeFile << "\t\"startTime\" : \"" << fSummaryVec[0].getFirstTimeString() <<  "\",\n";
  }
  else {
    //No data time to quit
    TimeFile.flush();
    unlink(jsonName);
    return;
  }
  
  TimeFile << "\t\"timeList\" : [\n";
  int firstInArray=1;

  //Get the iterator for the variable list
  std::map<UInt_t,AwareVariable>::iterator timeIt = fSummaryVec[0].timeMapBegin();
  for(;timeIt!=fSummaryVec[0].timeMapEnd();timeIt++) {
    if(!firstInArray) TimeFile << "\t,\n";
    TimeFile << "\t{\n";
    TimeFile << "\t\t\"startTime\" :" <<  timeIt->second.getStartTime() << " ,\n";
    TimeFile << "\t\t\"duration\" :" <<  timeIt->second.getDuration() << " ,\n";
    TimeFile << "\t\t\"numEnts\" :" <<  timeIt->second.getNumEnts() << " \n";
    TimeFile << "\t}\n";
    firstInArray=0;
  }
  TimeFile << "\t]\n\t,\n";
  //  TimeFile.close();a/
  
  TimeFile << "\"varList\" : [\n";
  
  int firstElement=1;
  //Now we loop over the elements
  std::map<std::string, Int_t>::iterator elementIt;
  for(elementIt=fElementIndexMap.begin();elementIt!=fElementIndexMap.end();elementIt++) {
    int index=elementIt->second;
    char elementName[180];

    int posDot=elementIt->first.find(".");
    if(posDot<0) {
      sprintf(elementName,"%s",elementIt->first.c_str());
    }
    else {
      int posScore=elementIt->first.find("_");
      if(posScore>0) {
	int thisId=atoi(elementIt->first.substr(posScore+1,posDot-posScore-1).c_str());
	sprintf(elementName,"stack_%d.%s",thisId,elementIt->first.substr(posDot+1).c_str());
      }
    }
    
    if(fSummaryVec[index].timeMapSize()==0) {
      //No data time to quit
      continue;
    }

    //We have some data    
    if(!firstElement) TimeFile << "\t,\n";
    firstElement=0;
    TimeFile << "{\n";
    //Start of runSum
    TimeFile << "\t\"name\" : \"" << elementName << "\",\n";
    TimeFile << "\t\"label\" : \"" << fLabelVec[index] << "\",\n";

    if(fSummaryVec[index].getVoidFlag()) {
       TimeFile << "\t\"voidValue\" : " << fSummaryVec[index].getVoidValue() << ",\n";
    }
    if(fSummaryVec[index].getAverageType()!=AwareAverageType::kAngleDegree) {
      TimeFile << "\t\"avgType\" : \"angleDegree\",\n";
    }     
    TimeFile << "\t\"timeList\" : [\n";
    int firstInArray=1;
    
    //Get the iterator for the variable list
    timeIt = fSummaryVec[index].timeMapBegin();
    for(;timeIt!=fSummaryVec[index].timeMapEnd();timeIt++) {
      if(!firstInArray) TimeFile << "\t,\n";
      TimeFile << "\t{\n";
      TimeFile << "\t\t\"mean\" :" <<  timeIt->second.getMean() << " ,\n";
      TimeFile << "\t\t\"stdDev\" :" <<  timeIt->second.getStdDev() << "\n";
      TimeFile << "\t}\n";
      firstInArray=0;
    }
    TimeFile << "\t]\n\t}";
  }
  TimeFile << "\t]\n\t}\n}\n";
  TimeFile.flush();

}



void AwareRunSummaryFileMaker::writeSummaryJSONFile(const char *jsonName)
{
  //Start new JSON file

  boost::iostreams::filtering_ostream jsonFile;
  jsonFile.push(boost::iostreams::gzip_compressor());
  jsonFile.push(boost::iostreams::file_sink(jsonName));

//   std::ofstream jsonFile(jsonName);
//   if(!jsonName) {
//     std::cerr << "Error opening " << jsonName << "\n";
//     return ;
//   }


  
  //Opening brace
  jsonFile << "{\n";
  //Start of runSum
  jsonFile << "\"runsum\":{\n";
  jsonFile << "\"run\" : " << fRun <<  ",\n";
  jsonFile << "\"instrument\" : \"" << fInstrumentName.c_str() <<  "\",\n";
  jsonFile << "\"startTime\" : \"" << fSummaryVec[0].getFirstTimeString() <<  "\",\n";
  jsonFile << "\"duration\" : " << fSummaryVec[0].getDuration() <<  ",\n";


  Int_t firstInArray=1;
  
  jsonFile << "\"varList\":[\n";
  std::map<std::string, Int_t>::iterator elementIt;
  for(elementIt=fElementIndexMap.begin();elementIt!=fElementIndexMap.end();elementIt++) {
    int index=elementIt->second;
    char elementName[180];

    int posDot=elementIt->first.find(".");
    if(posDot<0) {
      sprintf(elementName,"%s",elementIt->first.c_str());
    }
    else {
      int posScore=elementIt->first.find("_");
      if(posScore>0) {
	int thisId=atoi(elementIt->first.substr(posScore+1,posDot-posScore-1).c_str());
	sprintf(elementName,"stack_%d.%s",thisId,elementIt->first.substr(posDot+1).c_str());
	//	std::cout << currentId << "\t" << elementIt->first.substr(0,posScore)<< "\t" << posScore << "\t" << posDot << "\t" << elementName << "\n";  
      }
    }
    
    if(!firstInArray) 
      jsonFile << ",\n";
    jsonFile << "{\n";
    jsonFile << " \"name\":  \"" << elementName << "\",\n";
    jsonFile << "\t\"label\" : \"" << fLabelVec[index] << "\",\n";
    jsonFile << " \"mean\":  " << fSummaryVec[index].getRunMean() << ",\n";
    jsonFile << " \"stdDev\":  " << fSummaryVec[index].getRunStdDev() << ",\n";
    jsonFile << " \"numEnts\":  " << fSummaryVec[index].getRunNumEnts() << "\n";
    jsonFile << "}\n";
    firstInArray=0;

  }
  jsonFile << "]\n";
  //End of runSum
  jsonFile << "}\n";
  //Closing brace
  jsonFile << "}\n";
  jsonFile.flush();

//   char gzipString[FILENAME_MAX];
//   sprintf(gzipString,"gzip -f %s",jsonName);
//   gSystem->Exec(gzipString);
}







