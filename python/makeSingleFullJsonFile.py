#!/usr/bin/python

import os
import sys, getopt
import gzip
import json

def main(argv):
    awareDir=os.getenv('AWARE_OUTPUT_DIR', "/unix/ara/data/aware/output/");
    print awareDir


    sys.exit(0);

    rawfilename='' #'/Users/rjn/Sites/aware/web/output/ARA03/2014/0120/run2028/full/header_rawEventRate.json.gz'
    inputfilename=''  #'/Users/rjn/Sites/aware/web/output/ARA03/2014/0120/run2028/full/header_calEventRate.json.gz'
    outputfilename=''

    try:
       opts, args = getopt.getopt(argv,"hr:o:i:",["rfile=","ofile=","ifile="])
    except getopt.GetoptError:
       print 'fixEventRateFull.py -r <rawfile> -i <inputfile> -o <outputfile>'
       sys.exit(2)
    for opt, arg in opts:
        if opt == '-h':
            print 'fixEventRateFull.py -r <rawfile> -i <inputfile> -o <outputfile>'
            sys.exit()
        elif opt in ("-i", "--ifile"):
            inputfilename = arg
        elif opt in ("-o", "--ofile"):
            outputfilename = arg
        elif opt in ("-r", "--rfile"):
            rawfilename = arg
    print 'Raw file is "', rawfilename
    print 'Input file is "', inputfilename
    print 'Output file is "', outputfilename


    # reading
    gRaw = gzip.GzipFile(rawfilename)
    jRaw = json.load(gRaw)
    gRaw.close()
    
    
    gCal = gzip.GzipFile(inputfilename)
    jCal = json.load(gCal)
    gCal.close()
    
    print len(jRaw["full"]["timeList"])
    print len(jCal["full"]["timeList"])
    
    for i in range(0,len(jCal["full"]["timeList"]),1):
        jCal["full"]["timeList"][i]*=jRaw["full"]["timeList"][i]*60

    outJson=json.dumps(jCal)        
    outFile = gzip.open(outputfilename,'w')
    outFile.write(outJson)
    outFile.close()
        
if __name__ == "__main__":
    main(sys.argv[1:])
