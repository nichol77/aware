#!/usr/bin/python

import sys, getopt
import json
import os


"""Parses a python object from a JSON string. Every Object which should be loaded needs a constuctor that doesn't need any Arguments.
Arguments: The JSON string; the module which contains the class, the parsed object is instance of."""
def load(jsonString, module):
	def _load(d, module):
		if isinstance(d, list):
			l = []
			for item in d:
				l.append(_load(item, module))
			return l
		elif isinstance(d, dict) and "type" in d: #object
			t = d["type"]
			try:
				o = module[t]()
			except KeyError, e:
				raise ClassNotFoundError("Class '%s' not found in the given module!" % t)
			except TypeError, e:
				raise TypeError("Make sure there is an constuctor that doesn't take any arguments (class: %s)" % t)
			for key in d:
				if key != "type":
					setattr(o, key, _load(d[key], module))
			return o
		elif isinstance(d, dict): #dict
			rd = {}
			for key in d:
				rd[key] = _load(d[key], module)
			return rd
		else:
			return d
	d = json.loads(jsonString)
	return _load(d, module)

"""Dumps a python object to a JSON string. Argument: Python object"""
def dump(obj):
	def _dump(obj, path):
		if isinstance(obj, list):
			l = []
			i = 0
			for item in obj:
				l.append(_dump(item, path + "/[" + str(i) + "]"))
				i+=1
			return l
		elif isinstance(obj, dict): #dict
			rd = {}
			for key in obj:
				rd[key] = _dump(obj[key], path + "/" + key)
			return rd
		elif isinstance(obj, str) or isinstance(obj, unicode) or isinstance(obj, int) or isinstance(obj, float) or isinstance(obj, long) or isinstance(obj, complex) or isinstance(obj, bool) or type(obj).__name__ == "NoneType":
			return obj
		else:
			d = {}
			d["type"] = obj.__class__.__name__
			for key in obj.__dict__:
				d[key] = _dump(obj.__dict__[key], path + "/" + key)
			return d
	return json.dumps(_dump(obj,"/"))

class ClassNotFoundError(Exception):
	"""docstring for ClassNotFoundError"""
	def __init__(self, msg):
		super(ClassNotFoundError, self).__init__(msg)

class ConfigItem:

    def __init__(self, name=None, varType=None, value=None,comment=None):
        self.name = name
        self.varType = varType
        self.value = value
        self.comment = comment

    def printItem(self):
        print self.name,self.varType,self.value

class ConfigSection:

    def __init__(self, name=None, comment=None):
        self.name = name
        self.comment = comment
        self.itemList = []

    def addItem(self,name,varType,value,comment=None):
        item = ConfigItem(name,varType,value,comment)
        self.itemList.append(item)

    def printThings(self):
        print self.name
        print "Num Items: "+str(len(self.itemList))
        for item in self.itemList:
            item.printItem()


class ConfigFile:

    def __init__(self, name=None, comment=None):
        self.name = name
        if(comment==None):
            self.comment=""
        else:
            self.comment = comment
        self.sectionList = []

    def printThings(self):
        print self.name
        if(len(self.comment)>0):
            print self.comment
        print "Num Sections: "+str(len(self.sectionList))
        for section in self.sectionList:
            section.printThings()


    # This takes a string (as read by readConfigFile) and creates a new ConfigItem
    def parseItemString(self,line):
        hashIndex=line.find('#')
        semicolonIndex=line.find(';')
        commentIndex=line.find("//")
        # print commentIndex,line[commentIndex+2:]
        comment=None
        if(commentIndex>-1):
            comment=line[commentIndex+2:]
        name=line[0:hashIndex]
        equalIndex=line.find('=')
        varType=line[hashIndex+1:equalIndex]
        valueStr=line[equalIndex+1:semicolonIndex]
        #print valueStr
        numValues=int(varType[1:])
        value=None
        if(varType[0]=='I'):
            #Integer
            if(numValues==1):
                value=int(valueStr,0)
            else:
                value = [int(x,0) for x in valueStr.split(',')]
        else:
            if(varType[0]=='F'):
                #Float
                if(numValues==1):
                    value=float(valueStr)
                else:
                    value = [float(x) for x in valueStr.split(',')]
               
        self.sectionList[-1].addItem(name,varType,value,comment)

        
    def readFile(self,fileName):
        f = open(fileName)
        lines = [line.strip() for line in open(fileName)]
#        lines = f.readlines()
        f.close()
#        print lines
        count=0
        comment=None
        for line in lines:
            count+=1
            if(len(line)):
                if(count==1 and line.find("//")>-1):
                    self.comment=line[line.find("//")+2:]
                if(line[0]=='<'):
                    if(line[1]=='/'):
                        #End of section
                        #print line
                        print "Finished: "+str(self.sectionList[-1].name)
                    else:
                        endIndex=line.find('>')
                        name=line[1:endIndex]
                        newSection=ConfigSection(name,comment)
                        self.sectionList.append(newSection)
                        comment=None

                else:
                    if(str(line[0]).isalpha()):
                        self.parseItemString(line)
                    else:
                        if(line.find("//")>-1):
                            comment=line[line.find("//")+2:]




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
    myConfig=ConfigFile(configName)
    myConfig.readFile(inputfilename)
    jsonObj=dump(myConfig)
        
    f=open(outputfilename,"w")
    f.write(jsonObj)
    f.write("\n")
    f.close()


if __name__ == "__main__":
    main(sys.argv[1:])
