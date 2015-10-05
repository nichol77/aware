#!/usr/bin/python

import os
import sys, getopt
import gzip
import json

def main(argv):
    awareDir=os.getenv('AWARE_OUTPUT_DIR', "/unix/ara/data/aware/output/")

    instrument='ARA03'
    run='6000'

    try:
       opts, args = getopt.getopt(argv,"hr:i:",["run=","instrument="])
    except getopt.GetoptError:
       print 'fixEventRateFull.py -r <run> -i <instrument>'
       sys.exit(2)
    for opt, arg in opts:
        if opt == '-h':
            print 'fixEventRateFull.py -r <run> -i <instrument>'
            sys.exit()
        elif opt in ("-i", "--instrument"):
            instrument = arg
        elif opt in ("-r", "--run"):
            run = arg
    print 'Run is ', run
    print 'Instrument ', instrument
    roundRun=(int(run)//100)*100
    baseRun=(int(run)//10000)*10000

    runDir=awareDir+"/"+instrument+"/runs"+baseRun+"/runs"+roundRun+"/run"+run 
    print runDir



    sys.exit(0);

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
