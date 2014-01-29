#!/usr/bin/python

import sys, getopt
import gzip
import json
import time
from pprint import pprint
import os

def main(argv):
    
    if(len(argv)<4):
        print 'updateLastFile.py -i <inputfile> -l <lastfile> '
        sys.exit()   
    
    inputfilename='' 
    lastfilename='' 

    try:
       opts, args = getopt.getopt(argv,"hi:l:",["ifile=","lfile="])
    except getopt.GetoptError:
       print 'updateLastFile.py -i <inputfile> -l <lastfile>'
       sys.exit(2)
    for opt, arg in opts:
        if opt == '-h':
            print 'updateLastFile.py -i <inputfile> -l <lastfile>'
            sys.exit()
        elif opt in ("-i", "--ifile"):
            inputfilename = arg
        elif opt in ("-l", "--lfile"):
            lastfilename = arg
    print 'Input file is "', inputfilename
    print 'Last file is "', lastfilename


    # reading
    
    gCal = gzip.GzipFile(inputfilename)
    jCal = json.load(gCal)
    gCal.close()
    
    run=jCal["timeSum"]["run"]
    timeString=jCal["timeSum"]["startTime"]
#2014-01-27 22:30:00
    ts = time.mktime(time.strptime(timeString, '%Y-%m-%d %H:%M:%S'))
#    print ts,run
    
    stinfo = os.stat(lastfilename)
#    print stinfo.st_mtime
    if(ts>stinfo.st_mtime):
        print "Got newer run"
        f=open(lastfilename,"w")
        f.write(str(run))
        f.write("\n")
        f.close()
        os.utime(lastfilename,(ts,ts))


    
if __name__ == "__main__":
    main(sys.argv[1:])
