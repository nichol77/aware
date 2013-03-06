#############################################################################
## Makefile -- New Version of my Makefile that works on both linux
##              and mac os x
## Ryan Nichol <rjn@hep.ucl.ac.uk>
##############################################################################
include Makefile.arch

SRCSUF=cxx
DLLSUF=so
OBJSUF=o




#Generic and Site Specific Flags
CXXFLAGS     += $(ROOTCFLAGS) $(FFTFLAG) $(SYSINCLUDES) 
LDFLAGS      += -g $(ROOTLDFLAGS) 

LIBS          = $(ROOTLIBS)  -lMinuit $(SYSLIBS)  $(FFTLIBS) 
GLIBS         = $(ROOTGLIBS) $(SYSLIBS)

ROOT_LIBRARY = libAwareWeb.so

LIB_OBJS = AwareRunSummaryFileMaker.o AwareVariableSummary.o AwareVariable.o AwareRunDatabase.o awareDict.o
CLASS_HEADERS = AwareRunSummaryFileMaker.h AwareVariableSummary.h AwareVariable.h AwareRunDatabase.h


all : $(ROOT_LIBRARY) 

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



%.$(OBJSUF) : %.$(SRCSUF)
	@echo "<**Compiling**> "$<
	$(CXX) $(CXXFLAGS) -c $< -o  $@


clean:
	@rm -f *Dict*
	@rm -f *.${OBJSUF}
	@rm -f $(ROOT_LIBRARY)

