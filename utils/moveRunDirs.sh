
if [ "$1" = "" ]; then
    echo "Usage: `basename $0` <station> "
    exit 1
fi


if [ "$AWARE_OUTPUT_DIR" = "" ]; then
    echo "Need AWARE_OUTPUT_DIR to be set"
    exit 1
fi

STATION=$1

for runDir in ${AWARE_OUTPUT_DIR}${STATION}/????/????/run???; do
    if [ -d "$runDir" ]; then
	if [ -h "$runDir" ]; then 
	    echo "Is Symlink"
	else	    
	    echo $runDir;
	    justRun=${runDir##*/run}
	    run10000=$(($justRun - ($justRun % 10000) ))
	    run100=$(($justRun - ($justRun % 100) ))
	    newDir=${AWARE_OUTPUT_DIR}${STATION}/runs${run10000}/runs${run100}
	    fullNewDir=$newDir/run${justRun}
	    if [ -d "$fullNewDir" ]; then
		echo "New Dir Exists"
		mv ${runDir}/ev* $fullNewDir
		rm -f $runDir/run${justRun}
		rmdir $runDir
	    else			    
		mkdir -p $newDir
		mv $runDir $newDir
		ln -sf ${newDir}/run${justRun} $runDir
	    fi
	    
	fi

    fi
done