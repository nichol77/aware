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

AWARE_INCLUDES = -I../
AWARE_LIBS = -L../ -l AwareWeb

#Generic and Site Specific Flags
CXXFLAGS     += $(ROOTCFLAGS) $(FFTFLAG) $(SYSINCLUDES) $(AWARE_INCLUDES) $(INC_ARA_UTIL)
LDFLAGS      += -g $(ROOTLDFLAGS) 

LIBS          = $(ROOTLIBS)  -lMinuit $(SYSLIBS)  $(LD_ARA_UTIL) $(FFTLIBS) $(AWARE_LIBS)
GLIBS         = $(ROOTGLIBS) $(SYSLIBS)



PROGRAM =    makeSensorHkJsonFiles makeEventHkJsonFiles makeEventJsonFiles

all : $(PROGRAM)

%.$(OBJSUF) : %.$(SRCSUF)
	@echo "<**Compiling**> "$<
	$(CXX) $(CXXFLAGS) -c $< -o  $@


% :  %.$(SRCSUF) 
	@echo "<**Linking**> "  
	$(LD)  $(CXXFLAGS) $(LDFLAGS)  $<  $(LIBS) -o $@


clean:
	@rm -f *Dict*
	@rm -f *.${OBJSUF}
	@rm -f $(PROGRAM)

