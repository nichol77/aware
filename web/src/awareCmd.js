//////////////////////////////////////////////////////////////////////////////
/////                                                                    /////
/////   awareCmd.js                                                       /////
/////                                                                    /////
/////   Simple javascript for showing commands and echos                 /////
/////                                                                    /////
/////   November 2014, r.nichol@ucl.ac.uk                                   /////
//////////////////////////////////////////////////////////////////////////////


function responseAsString(responseList) {
    if(responseList[0]==250 && responseList[1]==243 && responseList[2]==0)
	return "OK";
    return responseList;

}


function timeSortCmdSent(a,b) {
    return b.time-a.time;
}

function timeSortCmdEcho(a,b) {
    return b.unixTime-a.unixTime;
}

function writeCmdSentList(cmdList,cmdSentDiv) {
    cmdList.sort(timeSortCmdSent);


    //First thing is determine how many to show
    document.getElementById(cmdSentDiv+"End").value=cmdList.length;
    var startValue=1;
    if(! $("#"+cmdSentDiv+"Start").val()) {
	startValue=cmdList.length-9;
	if(startValue<1) startValue=1;
	document.getElementById(cmdSentDiv+"Start").value=startValue;
    }
    else {
	startValue=document.getElementById(cmdSentDiv+"Start").value;
    }
    var endValue=cmdList.length-startValue;
	
    

    var table = $('<table></table>').addClass('commandTable');
    var hrow=$('<tr></tr>').addClass('headRow');
    hrow.append('<th>Count</th><th>Time</th><th>Link-Route</th><th>Code</th><th>Bytes</th><th>Response</th><th>Description</th></tr>');
    table.append(hrow);
    for(i=0; i<=endValue; i++){
	var row = $('<tr></tr>').addClass('bar');
	row.append('<td>'+cmdList[i].cmdNumber+'</td>'+
		   '<td>'+timeConverter(cmdList[i].time)+'</td>'+
		   '<td>'+cmdList[i].cmdLink+'-'+cmdList[i].cmdRoute+'</td>'+
		   '<td>'+cmdList[i].cmd[1]+'</td>'+
		   '<td>'+cmdList[i].cmd+'</td>'+
		   '<td>'+responseAsString(cmdList[i].response)+'</td>'+
		   '<td>'+cmdList[i].cmdLog+'</td>');
		   

	table.append(row);
    }
    $('#'+cmdSentDiv).empty();
    $('#'+cmdSentDiv).append(table);

}


function writeCmdEchoList(cmdList,cmdEchoDiv) {
    cmdList.sort(timeSortCmdEcho);   


    //First thing is determine how many to show
    document.getElementById(cmdEchoDiv+"End").value=cmdList.length;
    var startValue=1;
    if(! $("#"+cmdEchoDiv+"Start").val()) {
	startValue=cmdList.length-9;
	if(startValue<1) startValue=1;
	document.getElementById(cmdEchoDiv+"Start").value=startValue;
    }
    else {
	startValue=document.getElementById(cmdEchoDiv+"Start").value;
    }
    var endValue=cmdList.length-startValue;
	



    var table = $('<table></table>').addClass('commandTable');
    var hrow=$('<tr></tr>').addClass('headRow');
    hrow.append('<th>Time</th><th>Code</th><th>Bytes</th><th>Flag</th><th>Description</th></tr>');
    table.append(hrow);
    for(i=0; i<=endValue; i++){
	var row = $('<tr></tr>').addClass('bar');
	row.append('<td>'+timeConverter(cmdList[i].unixTime)+'</td>'+
		   '<td>'+cmdList[i].cmd[0]+'</td>'+
		   '<td>'+cmdList[i].cmd+'</td>'+
		   '<td>'+cmdList[i].flag+'</td>'+
		   '<td>'+cmdList[i].description+'</td>');
		   

	table.append(row);
    }

    $('#'+cmdEchoDiv).empty();
    $('#'+cmdEchoDiv).append(table);

}


function showCmd() {
    showCmdSent("losCmdList.php","losCmdSent");
    showCmdSent("tdrssCmdList.php","tdrssCmdSent");
    showCmdEchos("groundCmdEchoList.php","cmdEchoGround");
    showCmdEchos("payloadCmdEchoList.php","cmdEchoPayload");
}

function showCmdSent(cmdUrl,cmdSentDiv) {

    
    var countFilesNeeded=0;
    var countFilesGot=0;
    var cmdSentList = [];
    

    function handleCmdJsonFile(cmd) {
	countFilesGot++; ///For now will just do this silly thing
	cmdSentList.push(cmd);
	//	$("#debugContainer").append("<p>"+cmd+"</p>")	
	if(countFilesNeeded==countFilesGot) {
	    writeCmdSentList(cmdSentList,cmdSentDiv);
	}
    }

    /**
     * This function counts the number of full hk files that can not be fetched
     */
    function handleCmdJsonFileError() {
	countFilesGot++; ///For now will just do this silly thing	
	if(countFilesNeeded==countFilesGot) {
	    writeCmdSentList(cmdSentList,cmdSentDiv);
	}
    }


    function handleCmdListJsonFile(cmdList) {
	for (i=0;i<cmdList.length;i++){
	    countFilesNeeded++;
	    
	    ajaxLoadingLog(cmdList[i].name);
	    $.ajax({
		    url: cmdList[i].name,
			type: "GET",
			dataType: "json",
			success: handleCmdJsonFile,
			error: handleCmdJsonFileError
			}); 
	
	    //	    $("#debugContainer").append("<p>"+cmdList[i].name+"</p>")
		}	
    }
    
    ajaxLoadingLog(cmdUrl);
    $.ajax({
	    url: cmdUrl,
		type: "GET",
		dataType: "json",
		success: handleCmdListJsonFile,
		error: handleAjaxError
    }); 

}


function showCmdEchos(cmdUrl,cmdEchoDiv) {
    
    var countFilesNeeded=0;
    var countFilesGot=0;
    var cmdEchoList = [];
    

    function handleCmdJsonFile(cmd) {
	countFilesGot++; ///For now will just do this silly thing
	cmdEchoList.push(cmd);
	//	$("#debugContainer").append("<p>"+cmd+"</p>")	
	if(countFilesNeeded==countFilesGot) {
	    writeCmdEchoList(cmdEchoList,cmdEchoDiv);
	}
    }

    /**
     * This function counts the number of full hk files that can not be fetched
     */
    function handleCmdJsonFileError() {
	countFilesGot++; ///For now will just do this silly thing	
	if(countFilesNeeded==countFilesGot) {
	    writeCmdEchoList(cmdEchoList,cmdEchoDiv);
	}
    }


    function handleCmdListJsonFile(cmdList) {
	for (i=0;i<cmdList.length;i++){
	    countFilesNeeded++;
	    
	    ajaxLoadingLog(cmdList[i].name);
	    $.ajax({
		    url: cmdList[i].name,
			type: "GET",
			dataType: "json",
			success: handleCmdJsonFile,
			error: handleCmdJsonFileError
			}); 
	
	    //	    $("#debugContainer").append("<p>"+cmdList[i].name+"</p>")
		}	
    }
    
    ajaxLoadingLog(cmdUrl);
    $.ajax({
	    url: cmdUrl,
		type: "GET",
		dataType: "json",
		success: handleCmdListJsonFile,
		error: handleAjaxError
    }); 

}


