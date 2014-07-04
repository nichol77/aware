#!/bin/bash

for runDir in /unix/ara/data/aware/output/ARA02/runs0/runs*/run????/eventHkTime.json.gz; do 
    echo $runDir; 
    python ./makeDateCodeSymLink.py -i $runDir
done