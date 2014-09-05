#!/usr/bin/python

import sys, getopt
import json
import os

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
        if(semicolonIndex==-1):
            print "Missing semicolon",line
            semicolonIndex=len(line)
        commentIndex=line.find("//")
        # print commentIndex,line[commentIndex+2:]
        comment=None
        if(commentIndex>-1):
            comment=line[commentIndex+2:]
        name=line[0:hashIndex]
        equalIndex=line.find('=')
        varType=line[hashIndex+1:equalIndex]
        valueStr=line[equalIndex+1:semicolonIndex]
       # print line,valueStr
        value=None
        if(varType[0]=='I'):
            numValues=int(varType[1:])
            #Integer
            if(numValues==1):
                value=int(valueStr,0)
            else:
                if(valueStr.find(',')>0):
                    value = [int(x,0) for x in valueStr.split(',')]
                else:
                    value = [int(x,0) for x in valueStr.split(' ')]
        elif(varType[0]=='F'):
            numValues=int(varType[1:])
            if(numValues==1):
                value=float(valueStr)
            else:
                value = [float(x) for x in valueStr.split(',')]
        elif(varType[0]=='S'):
            value=valueStr
        self.sectionList[-1].addItem(name,varType,value,comment)

        
    def readFile(self,fileName):
        f = open(fileName)
        lines = [line.strip() for line in open(fileName)]
#        lines = f.readlines()
        f.close()
#        print lines
        count=0
        comment=None
        line=None
        multiline=False
        for curLine in lines:
            if(multiline):
                line+=curLine
            else:
                line=curLine
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
#                        print line[-1],line
                        if(line[-1]=='\\'):
                            line=line[:-2]
                            multiline=True
                        else:
                            multiline=False
                            self.parseItemString(line)
                    else:
                        if(line.find("//")>-1):
                            comment=line[line.find("//")+2:]

