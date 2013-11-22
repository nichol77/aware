
AWARE   -- Active Web for Antarctica Radio Experiments 
======================================================
Ryan Nichol, r.nichol@ucl.ac.uk	
July 2013 ... well ongoing really


Introduction 
------------
AWARE is a web based tool for remote monitoring of neutrino experiments in Antarctica which utilise radio detectors to search for high enegry neutrinos. In principle the tool could be used for monitoring any type of data. AWARE works by storing all of the data in Javascript Object Notation (JSON) format. "JSON is a text based open standard designed for human readable data interchange." according to Wikipedia. 


Structure
----------
There are three elements to 

1. A C++/ROOT library that can be used to generate the AWARE JSON files. This library can be used by many.
2. Some programs that use the library in 1) and turn ROOT data in to JSON data. Since these programs have to read in the experiment specific data they are experiemnt.
3. A set of javascript files that handle reading the JSON files (using jquery) and plotting the data (using Flot). Other than some experiment specific configuration files, these javascript files and web pages can be used by multiple experiments.
