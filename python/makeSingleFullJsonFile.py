#!/usr/bin/python

import glob
import os
import sys, getopt
import gzip
import json

def main(argv):
    awareDir=os.getenv('AWARE_OUTPUT_DIR', "/unix/ara/data/aware/output/")

    instrument='ARA03'
    run='6000'
    fileType='eventHk'

    try:
       opts, args = getopt.getopt(argv,"hr:i:f:",["run=","instrument=","filetype="])
    except getopt.GetoptError:
       print 'fixEventRateFull.py -r <run> -i <instrument> -f <file type>'
       sys.exit(2)
    for opt, arg in opts:
        if opt == '-h':
            print 'fixEventRateFull.py -r <run> -i <instrument>'
            sys.exit()
        elif opt in ("-i", "--instrument"):
            instrument = arg
        elif opt in ("-f", "--fileType"):
            fileType = arg
        elif opt in ("-r", "--run"):
            run = arg
    print 'Run is ', run
    print 'Instrument ', instrument
    roundRun=(int(run)//100)*100
    baseRun=(int(run)//10000)*10000

    runDir=awareDir+"/"+instrument+"/runs"+str(baseRun)+"/runs"+str(roundRun)+"/run"+run
    singleFullName=runDir+'/'+fileType+'_full.json.gz'
    print runDir
    fullFileList=glob.glob(runDir+'/full/'+fileType+"_*")
    print fullFileList
    

    #Create the output dictionary
    jList=[]
    jOut = dict()
    
    for inFile in fullFileList:
        gFull = gzip.GzipFile(inFile)
        jFull = json.load(gFull)
        gFull.close()
        if "name" in jFull["full"] :
            print jFull["full"]["name"]
            print len(jFull["full"]["timeList"])
            jList.append(jFull["full"])
            jOut[jFull["full"]["name"]]={jFull["full"]}
        else:
            print "Got time"
            jOut["thetimes"]={jFull["full"]}
            jList.append(jFull["full"])

    print len(jList)
    print jList[0]
            

    outJson=json.dumps(jOut)        
    outFile = gzip.open(singleFullName,'w')
    outFile.write(outJson)
    outFile.close()
    sys.exit(0);

    # 
        
if __name__ == "__main__":
    main(sys.argv[1:])
