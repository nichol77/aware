#############################################################################
## Makefile -- New Version of my Makefile that works on both linux
##              and mac os x
## Ryan Nichol <rjn@hep.ucl.ac.uk>
##############################################################################
include Makefile.arch

SRCSUF=cxx
DLLSUF=so
OBJSUF=o


LD_ARA_UTIL=-L$(ARA_UTIL_INSTALL_DIR)/lib  -lAraEvent
INC_ARA_UTIL=-I$(ARA_UTIL_INSTALL_DIR)/include


#Generic and Site Specific Flags
CXXFLAGS     += $(ROOTCFLAGS) $(FFTFLAG) $(SYSINCLUDES) $(INC_ARA_UTIL)
LDFLAGS      += -g $(ROOTLDFLAGS) 

LIBS          = $(ROOTLIBS)  -lMinuit $(SYSLIBS) $(LD_ARA_UTIL) $(FFTLIBS) 
GLIBS         = $(ROOTGLIBS) $(SYSLIBS)

ROOT_LIBRARY = libAwareWeb.so

LIB_OBJS = AwareRunSummaryFileMaker.o AwareVariableSummary.o AwareVariable.o awareDict.o
CLASS_HEADERS = AwareRunSummaryFileMaker.h AwareVariableSummary.h AwareVariable.h

PROGRAM =   makeEventXmlFile makeSensorHkXmlFiles

all : $(ROOT_LIBRARY) $(PROGRAM)

#The library
$(ROOT_LIBRARY) : $(LIB_OBJS) 
	@echo "Linking $@ ..."
ifeq ($(PLATFORM),macosx)
# We need to make both the .dylib and the .so
		$(LD) $(SOFLAGS)$@ $(LIBS) $(LDFLAGS) $^ $(OutPutOpt) $@
ifneq ($(subst $(MACOSX_MINOR),,1234),1234)
ifeq ($(MACOSX_MINOR),4)
		ln -sf $@ $(subst .$(DllSuf),.so,$@)
else
		$(LD) -bundle -undefined $(UNDEFOPT) $(LDFLAGS) $^ \
		   $(OutPutOpt) $(subst .$(DllSuf),.so,$@)
endif
endif
else
	$(LD) $(SOFLAGS) $(LDFLAGS) $(LIBS) $(LIB_OBJS) -o $@
endif



awareDict.C: $(CLASS_HEADERS)

	@echo "Generating dictionary ..."
	@ rm -f *Dict* 
	rootcint $@ -c $(INC_ANITA_UTIL) $(CLASS_HEADERS) LinkDef.h


% :  %.$(SRCSUF) $(ROOT_LIBRARY)
	@echo "<**Linking**> "  
	$(LD)  $(CXXFLAGS) $(LDFLAGS) $< tinyxml2.cpp $(LIBS) $(ROOT_LIBRARY) -o $@

%.$(OBJSUF) : %.$(SRCSUF)
	@echo "<**Compiling**> "$<
	$(CXX) $(CXXFLAGS) -c $< -o  $@


clean:
	@rm -f *Dict*
	@rm -f *.${OBJSUF}
	@rm -f $(PROGRAM)

