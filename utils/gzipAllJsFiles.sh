#!/bin/bash
find . -name "*.js" | while read file; do gzip -c $file > $file.gz; done