#!/bin/bash

for runDir in /Users/rjn/Sites/aware/web/output/ARA02/2014/0126/run2954; do 
    echo $runDir; 
    RAW_FILE=${runDir}/full/header_rawEventRate.json.gz 
    CAL_FILE=${runDir}/full/header_calEventRate.json.gz 
    SOFT_FILE=${runDir}/full/header_softEventRate.json.gz 
    RF_FILE=${runDir}/full/header_rfEventRate.json.gz 
    HEADER_FILE=${runDir}/headerTime.json.gz
    if [ -f "$RAW_FILE" ]; then
	mv $CAL_FILE $CAL_FILE.orig
	./fixEventRateFull.py -r ${RAW_FILE} -i ${CAL_FILE}.orig -o ${CAL_FILE}
	
	mv $SOFT_FILE $SOFT_FILE.orig
	./fixEventRateFull.py -r ${RAW_FILE} -i ${SOFT_FILE}.orig -o ${SOFT_FILE}
	
	mv $RF_FILE $RF_FILE.orig
	./fixEventRateFull.py -r ${RAW_FILE} -i ${RF_FILE}.orig -o ${RF_FILE}   

	mv ${HEADER_FILE} ${HEADER_FILE}.orig
	./fixEventRateSimple.py -i ${HEADER_FILE}.orig -o ${HEADER_FILE}
 
    fi
done