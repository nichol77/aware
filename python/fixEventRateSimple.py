#!/usr/bin/python

import sys, getopt
import gzip
import json
from pprint import pprint

def main(argv):
    
    if(len(argv)<4):
        print 'fixEventRateFull.py -i <inputfile> -o <outputfile>'
        sys.exit()   
    
    inputfilename=''  #'/Users/rjn/Sites/aware/web/output/ARA03/2014/0120/run2028/full/header_calEventRate.json.gz'
    outputfilename=''

    try:
       opts, args = getopt.getopt(argv,"ho:i:",["ofile=","ifile="])
    except getopt.GetoptError:
       print 'fixEventRateFull.py -r -i <inputfile> -o <outputfile>'
       sys.exit(2)
    for opt, arg in opts:
        if opt == '-h':
            print 'fixEventRateFull.py -i <inputfile> -o <outputfile>'
            sys.exit()
        elif opt in ("-i", "--ifile"):
            inputfilename = arg
        elif opt in ("-o", "--ofile"):
            outputfilename = arg
    print 'Input file is "', inputfilename
    print 'Output file is "', outputfilename


    # reading
    
    gCal = gzip.GzipFile(inputfilename)
    jCal = json.load(gCal)
    gCal.close()
#    [0] -- Cal
#    [1] -- Event Rate
#    [3] -- Raw Event Rate
#    [4] -- RF Event Rate
#    [25] --Soft Event Rate

  #  print len(jRaw["full"]["timeList"])
 #   print len(jCal["full"]["timeList"])
    
    for i in range(0,len(jCal["timeSum"]["varList"][25]["timeList"]),1):
        jCal["timeSum"]["varList"][25]["timeList"][i]["mean"]*=jCal["timeSum"]["varList"][3]["timeList"][i]["mean"]*60
        jCal["timeSum"]["varList"][25]["timeList"][i]["stdDev"]*=jCal["timeSum"]["varList"][3]["timeList"][i]["mean"]*60
        jCal["timeSum"]["varList"][0]["timeList"][i]["mean"]*=jCal["timeSum"]["varList"][3]["timeList"][i]["mean"]*60
        jCal["timeSum"]["varList"][0]["timeList"][i]["stdDev"]*=jCal["timeSum"]["varList"][3]["timeList"][i]["mean"]*60
        jCal["timeSum"]["varList"][4]["timeList"][i]["mean"]*=jCal["timeSum"]["varList"][3]["timeList"][i]["mean"]*60
        jCal["timeSum"]["varList"][4]["timeList"][i]["stdDev"]*=jCal["timeSum"]["varList"][3]["timeList"][i]["mean"]*60


    outJson=json.dumps(jCal)        
    outFile = gzip.open(outputfilename,'w')
    outFile.write(outJson)
    outFile.close()
        
if __name__ == "__main__":
    main(sys.argv[1:])
