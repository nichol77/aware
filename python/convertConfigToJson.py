#!/usr/bin/python

import sys, getopt
import json
import os
import PyJSONSerialization
import PyConfigLib


def usage():
     print 'convertConfigToJson.py -i <inputfile> -o <outputfile '

def main(argv):
    
    if(len(argv)<4):
        usage()
        sys.exit()   
    
    inputfilename='' 
    outputfilename='temp.json' 

    try:
       opts, args = getopt.getopt(argv,"hi:o:",["ifile=","ofile="])
    except getopt.GetoptError:
        usage()
        sys.exit(2)

    for opt, arg in opts:
        if opt == '-h':
            usage()
            sys.exit()
        elif opt in ("-i", "--ifile"):
            inputfilename = arg
        elif opt in ("-o", "--ofile"):
            outputfilename = arg
    print 'Input file is ', inputfilename
    print 'Output file is ', outputfilename

    configName=os.path.basename(inputfilename)
    myConfig=PyConfigLib.ConfigFile(configName)
    myConfig.readFile(inputfilename)
    jsonObj=PyJSONSerialization.dump(myConfig)

    f=open(outputfilename,"w")
    f.write(jsonObj)
    f.write("\n")
    f.close()



if __name__ == "__main__":
    main(sys.argv[1:])
