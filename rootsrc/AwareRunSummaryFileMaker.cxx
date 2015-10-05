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
  std::string elString(elName);
  std::string labelString(label);

  //Insert label
  std::map<std::string,std::string>::iterator labIt=fLabelMap.find(elString);
  if(labIt==fLabelMap.end()) {
     fLabelMap.insert(std::pair<std::string, std::string >(elString,labelString));
  }


  std::map<std::string,AwareVariableSummary>::iterator it=summaryMap.find(elString);
  if(it!=summaryMap.end()) {
    it->second.addDataPoint(timeStamp,variable);
  }
  else {
     AwareVariableSummary newSummary(fNumSecondsPerPoint,avgType,hasVoidValue,voidValue);
     newSummary.addDataPoint(timeStamp,variable);
     summaryMap[elString]=newSummary;
  }

  //Now deal with the raw map

  //  std::map<UInt_t, std::map<std::string, Double_t> > fRawMap;

  std::map<Double_t, std::map<std::string, Double_t> >::iterator rawIt=fRawMap.find(timeStamp.AsDouble());
  if(rawIt!=fRawMap.end()) {
    //Already have this time point;
    rawIt->second.insert( std::pair <std::string, Double_t > (elString, variable));
  }
  else {
    //    First time for this one need to make map
    std::map<std::string, Double_t> newTimePoint;
    newTimePoint.insert(std::pair <std::string, Double_t > (elString, variable) );
    fRawMap.insert( std::pair < Double_t, std::map<std::string, Double_t> > (timeStamp.AsDouble(), newTimePoint));
  }
  
}


void AwareRunSummaryFileMaker::writeFullJSONFiles(const char *jsonDir, const char *filePrefix)
{
  std::cout << fRawMap.size() << "\n";

  if(fRawMap.size()==0) return;
  
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
  std::map<std::string,AwareVariableSummary>::iterator sumIt=summaryMap.begin();  
  //We have some data    
  TimeFile << "{\n";
  //Start of runSum
  TimeFile << "\t\"full\":{\n";
  TimeFile << "\t\"run\" : " << fRun <<  ",\n";
  TimeFile << "\t\"instrument\" : \"" << fInstrumentName.c_str() <<  "\",\n";
  TimeFile << "\t\"startTime\" : \"" << sumIt->second.getFirstTimeString() <<  "\",\n";
  TimeFile << "\t\"numPoints\" : " << fRawMap.size() <<  ",\n";
  TimeFile << "\t\"timeList\" : [\n";


  
  std::map<std::string, std::ofstream*> fJsonFileMap;
  
  //For now get the first time point in the raw map
  std::map<Double_t, std::map<std::string, Double_t> >::iterator fRawMapIt=fRawMap.begin();  
  std::map<Double_t, std::map<std::string, Double_t> >::iterator fRawMapIt2=fRawMap.begin();  
  //Then get an iterator for all the variables at the first timePoint
  std::map<std::string, Double_t>::iterator subMapIt=fRawMapIt->second.begin();
  std::map<std::string, Double_t>::iterator subMapIt2=fRawMapIt->second.begin();

  std::map<std::string, std::string>::iterator labelIt;


  ///Now fill the time file
  int firstInArray=1;
  //Now loop over the fRawMap
  for(fRawMapIt=fRawMap.begin();fRawMapIt!=fRawMap.end();fRawMapIt++) {
    //First do the time file
    if(!firstInArray) TimeFile << ",\n";
    TimeFile <<  std::setw( 20 ) << std::setprecision( 10 ) << fRawMapIt->first;
    firstInArray=0;
  }  
  TimeFile << " ]\n}\n}\n";
  TimeFile.flush();

  fRawMapIt=fRawMap.begin();
  subMapIt=fRawMapIt->second.begin();

  //Now loop over the variables the output files
  for(;subMapIt!=fRawMapIt->second.end();subMapIt++) {
     //     std::cerr << subMapIt->first << "\n";
     labelIt=fLabelMap.find(subMapIt->first);
     sumIt=summaryMap.find(subMapIt->first); //Point the summary iterator to the correct summary
     sprintf(jsonName,"%s/%s_%s.json.gz",jsonDir,filePrefix,subMapIt->first.c_str());
     //     std::cerr << jsonName << "\n";

     boost::iostreams::filtering_ostream FullFile;
     FullFile.push(boost::iostreams::gzip_compressor());
     FullFile.push(boost::iostreams::file_sink(jsonName));

      
     FullFile << "{\n";
     //Start of runSum
     FullFile << "\t\"full\":{\n";
     FullFile << "\t\"run\" : " << fRun <<  ",\n";
     FullFile << "\t\"instrument\" : \"" << fInstrumentName.c_str() <<  "\",\n";
     FullFile << "\t\"name\" : \"" << subMapIt->first.c_str() <<  "\",\n";
     FullFile << "\t\"label\" : \"" << labelIt->second.c_str() <<  "\",\n";
     FullFile << "\t\"startTime\" : \"" << sumIt->second.getFirstTimeString() <<  "\",\n";
     FullFile << "\t\"numPoints\" : " << fRawMap.size() <<  ",\n";
     //    std::cerr << subMapIt->first.c_str() << "\t" << fRawMap.size() << "\t" << sumIt->second.getVoidFlag() << "\t" << sumIt->second.getVoidValue() << "\t"<< sumIt->second.getNumSecondsPerPoint() << "\n";
     
     if(sumIt->second.getVoidFlag()) {
	FullFile << "\t\"voidValue\" : " << sumIt->second.getVoidValue() << ",\n";
     }
     if(sumIt->second.getAverageType()!=AwareAverageType::kAngleDegree) {
	FullFile << "\t\"avgType\" : \"angleDegree\",\n";
     } 
     FullFile << "\t\"timeList\" : [\n";
     //    fJsonFileMap.insert( std::pair <std::string, std::ofstream*> (subMapIt->first, VarFile) );
     
     
     int firstInArray=1;
     //Now loop over the time file again
     for(fRawMapIt2=fRawMap.begin();fRawMapIt2!=fRawMap.end();fRawMapIt2++) {
	subMapIt2=fRawMapIt2->second.find(subMapIt->first);
	if(subMapIt2!=fRawMapIt2->second.end()) {	   
	   if(!firstInArray) FullFile << ",\n";
	   FullFile <<  subMapIt2->second;
	   firstInArray=0;
	}
     }
     FullFile << " ]\n}\n}\n";
     FullFile.flush();
  }
  //  std::cerr << "Here\n";
  

}


void AwareRunSummaryFileMaker::writeSingleFullJSONFile(const char *jsonDir, const char *filePrefix)
{
    std::cout << fRawMap.size() << "\n";
    
    if(fRawMap.size()==0) return;
    
//    std::vector<std::string> fFileList;
    
    char jsonName[FILENAME_MAX];
    sprintf(jsonName,"%s/%s_full.json.gz",jsonDir,filePrefix);
    
    boost::iostreams::filtering_ostream FullFile;
    FullFile.push(boost::iostreams::gzip_compressor());
    FullFile.push(boost::iostreams::file_sink(jsonName));
    //Need to add a check the file is open
    
    //For now we will justr take the time from the first variable in the map;
    std::map<std::string,AwareVariableSummary>::iterator sumIt=summaryMap.begin();
    //We have some data
    FullFile << "{\n";
    //Start of runSum
    FullFile << "\t\"time\":{\n";
    FullFile << "\t\"run\" : " << fRun <<  ",\n";
    FullFile << "\t\"instrument\" : \"" << fInstrumentName.c_str() <<  "\",\n";
    FullFile << "\t\"startTime\" : \"" << sumIt->second.getFirstTimeString() <<  "\",\n";
    FullFile << "\t\"numPoints\" : " << fRawMap.size() <<  ",\n";
    FullFile << "\t\"timeList\" : [\n";
    
    
    
    std::map<std::string, std::ofstream*> fJsonFileMap;
    
    //For now get the first time point in the raw map
    std::map<Double_t, std::map<std::string, Double_t> >::iterator fRawMapIt=fRawMap.begin();
    std::map<Double_t, std::map<std::string, Double_t> >::iterator fRawMapIt2=fRawMap.begin();
    //Then get an iterator for all the variables at the first timePoint
    std::map<std::string, Double_t>::iterator subMapIt=fRawMapIt->second.begin();
    std::map<std::string, Double_t>::iterator subMapIt2=fRawMapIt->second.begin();
    
    std::map<std::string, std::string>::iterator labelIt;
    
    
    ///Now fill the time file
    int firstInArray=1;
    //Now loop over the fRawMap
    for(fRawMapIt=fRawMap.begin();fRawMapIt!=fRawMap.end();fRawMapIt++) {
        //First do the time file
        if(!firstInArray) FullFile << ",\n";
        FullFile <<  std::setw( 20 ) << std::setprecision( 10 ) << fRawMapIt->first;
        firstInArray=0;
    }
    FullFile << " ]\n}\n";
    
    fRawMapIt=fRawMap.begin();
    subMapIt=fRawMapIt->second.begin();
    
    //Now loop over the variables the output files
    for(;subMapIt!=fRawMapIt->second.end();subMapIt++) {
        //     std::cerr << subMapIt->first << "\n";
        labelIt=fLabelMap.find(subMapIt->first);
        sumIt=summaryMap.find(subMapIt->first); //Point the summary iterator to the correct summary
        FullFile << ",\n";
        FullFile << "{\n";
        //Start of runSum
        FullFile << "\t\"" << subMapIt->first.c_str() << "\":{\n";
        FullFile << "\t\"run\" : " << fRun <<  ",\n";
        FullFile << "\t\"instrument\" : \"" << fInstrumentName.c_str() <<  "\",\n";
        FullFile << "\t\"name\" : \"" << subMapIt->first.c_str() <<  "\",\n";
        FullFile << "\t\"label\" : \"" << labelIt->second.c_str() <<  "\",\n";
        FullFile << "\t\"startTime\" : \"" << sumIt->second.getFirstTimeString() <<  "\",\n";
        FullFile << "\t\"numPoints\" : " << fRawMap.size() <<  ",\n";
        //    std::cerr << subMapIt->first.c_str() << "\t" << fRawMap.size() << "\t" << sumIt->second.getVoidFlag() << "\t" << sumIt->second.getVoidValue() << "\t"<< sumIt->second.getNumSecondsPerPoint() << "\n";
        
        if(sumIt->second.getVoidFlag()) {
            FullFile << "\t\"voidValue\" : " << sumIt->second.getVoidValue() << ",\n";
        }
        if(sumIt->second.getAverageType()!=AwareAverageType::kAngleDegree) {
            FullFile << "\t\"avgType\" : \"angleDegree\",\n";
        }
        FullFile << "\t\"timeList\" : [\n";
        //    fJsonFileMap.insert( std::pair <std::string, std::ofstream*> (subMapIt->first, VarFile) );
        
        
        int firstInArray=1;
        //Now loop over the time file again
        for(fRawMapIt2=fRawMap.begin();fRawMapIt2!=fRawMap.end();fRawMapIt2++) {
            subMapIt2=fRawMapIt2->second.find(subMapIt->first);
            if(subMapIt2!=fRawMapIt2->second.end()) {	   
                if(!firstInArray) FullFile << ",\n";
                FullFile <<  subMapIt2->second;
                firstInArray=0;
            }
        }
        FullFile << " ]\n}\n";
    }
    FullFile << "}\n";
    FullFile.flush();
    //  std::cerr << "Here\n";
    
    
}



void AwareRunSummaryFileMaker::writeTimeJSONFile(const char *jsonName)
{


  boost::iostreams::filtering_ostream TimeFile;
  TimeFile.push(boost::iostreams::gzip_compressor());
  TimeFile.push(boost::iostreams::file_sink(jsonName));

  //  std::ofstream TimeFile(jsonName);
  //  if(!TimeFile) {
  //    std::cerr << "Couldn't open " << jsonName << "\n";
  //    return;
  //  }

  std::map<std::string,std::string>::iterator labelIt;

  //For now we will justr take the time from the first variable in the map;
  std::map<std::string,AwareVariableSummary>::iterator it=summaryMap.begin();  
  
  if(it->second.timeMapSize()>0) {
    //We have some data    
    TimeFile << "{\n";
    //Start of runSum
    TimeFile << "\t\"timeSum\":{\n";
    TimeFile << "\t\"run\" : " << fRun <<  ",\n";
    TimeFile << "\t\"instrument\" : \"" << fInstrumentName.c_str() <<  "\",\n";
    TimeFile << "\t\"startTime\" : \"" << it->second.getFirstTimeString() <<  "\",\n";
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
  std::map<UInt_t,AwareVariable>::iterator timeIt = it->second.timeMapBegin();
  for(;timeIt!=it->second.timeMapEnd();timeIt++) {
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
  for(;it!=summaryMap.end();it++) {
     labelIt=fLabelMap.find(it->first);
    char elementName[180];

    int posDot=it->first.find(".");
    if(posDot<0) {
      sprintf(elementName,"%s",it->first.c_str());
    }
    else {
      int posScore=it->first.find("_");
      if(posScore>0) {
	int thisId=atoi(it->first.substr(posScore+1,posDot-posScore-1).c_str());
	sprintf(elementName,"stack_%d.%s",thisId,it->first.substr(posDot+1).c_str());
	//	std::cout << currentId << "\t" << it->first.substr(0,posScore)<< "\t" << posScore << "\t" << posDot << "\t" << elementName << "\n";  
      }
    }

    
    if(it->second.timeMapSize()==0) {
      //No data time to quit
      continue;
    }

    //We have some data    
    if(!firstElement) TimeFile << "\t,\n";
    firstElement=0;
    TimeFile << "{\n";
    //Start of runSum
    TimeFile << "\t\"name\" : \"" << elementName << "\",\n";
    TimeFile << "\t\"label\" : \"" << labelIt->second << "\",\n";

    if(it->second.getVoidFlag()) {
       TimeFile << "\t\"voidValue\" : " << it->second.getVoidValue() << ",\n";
    }
    if(it->second.getAverageType()!=AwareAverageType::kAngleDegree) {
      TimeFile << "\t\"avgType\" : \"angleDegree\",\n";
    }     
    TimeFile << "\t\"timeList\" : [\n";
    int firstInArray=1;
    
    //Get the iterator for the variable list
    timeIt = it->second.timeMapBegin();
    for(;timeIt!=it->second.timeMapEnd();timeIt++) {
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

//   char gzipString[FILENAME_MAX];
//   sprintf(gzipString,"gzip -f %s",jsonName);
//   gSystem->Exec(gzipString);

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


  std::map<std::string,std::string>::iterator labelIt;
  
  std::map<std::string,AwareVariableSummary>::iterator it=summaryMap.begin();
  //Opening brace
  jsonFile << "{\n";
  //Start of runSum
  jsonFile << "\"runsum\":{\n";
  jsonFile << "\"run\" : " << fRun <<  ",\n";
  jsonFile << "\"instrument\" : \"" << fInstrumentName.c_str() <<  "\",\n";
  jsonFile << "\"startTime\" : \"" << it->second.getFirstTimeString() <<  "\",\n";
  jsonFile << "\"duration\" : " << it->second.getDuration() <<  ",\n";


  Int_t firstInArray=1;
  
  jsonFile << "\"varList\":[\n";

  for(;it!=summaryMap.end();it++) {
     labelIt=fLabelMap.find(it->first);
    char elementName[180];

    int posDot=it->first.find(".");
    if(posDot<0) {
      sprintf(elementName,"%s",it->first.c_str());
    }
    else {
      int posScore=it->first.find("_");
      if(posScore>0) {
	int thisId=atoi(it->first.substr(posScore+1,posDot-posScore-1).c_str());
	sprintf(elementName,"stack_%d.%s",thisId,it->first.substr(posDot+1).c_str());
	//	std::cout << currentId << "\t" << it->first.substr(0,posScore)<< "\t" << posScore << "\t" << posDot << "\t" << elementName << "\n";  
      }
    }
    
    if(!firstInArray) 
      jsonFile << ",\n";
    jsonFile << "{\n";
    jsonFile << " \"name\":  \"" << elementName << "\",\n";
    jsonFile << "\t\"label\" : \"" << labelIt->second << "\",\n";
    jsonFile << " \"mean\":  " << it->second.getRunMean() << ",\n";
    jsonFile << " \"stdDev\":  " << it->second.getRunStdDev() << ",\n";
    jsonFile << " \"numEnts\":  " << it->second.getRunNumEnts() << "\n";
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







