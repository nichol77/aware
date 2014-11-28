<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Events</title>
<script language="javascript" type="text/javascript" src="src/flot/jquery.min.js.gz"></script>
<script language="javascript" type="application/javascript">
	function runRefresher(){
		if ($("#runNumInput").val() != "Run Number" || $("#runNumInput").val() == ""){
			viewRun(1);
		}
		else {
			viewRun(0);
		}
	}
	function viewAll() {
		$("#loader").css("visibility","visible");
		var first = null;
		var runNum = $("#runNumInput").val();
		$.ajax({ 
        type: 'GET', 
        url: 'pngCrawler.php',  
			success: function (data) { 
				var runs = $.parseJSON(data);
				//console.log(runs);
				$("#eventSelect")
					.empty()
					.end()
					.append('<option value="DEFAULT"> - </option>');
				$("#runSelect")
					.empty()
					.end()
					.append('<option value="DEFAULT"> - </option>');
				$.each(runs, function(run, pngs) {
					//console.log(pngs);
					$("#runSelect")
							.append($("<option></option>")
							.attr("value",run.replace("run",""))
							.text(run));
					$.each(pngs[0], function(eventKey,eventValue) {
						//console.log(eventKey);
						//console.log(eventValue);
						//if(first == null){first = eventKey.replace("ev","");}
						$("#eventSelect")
							.append($("<option></option>")
							.attr("value",eventKey.replace("ev",""))
							.text(eventKey));
						/*$.each(eventValue, function(key,value) {
							var png = value.png;
							var name = value.png.replace("output/ANITA3/event/all/run"+runNum+"/"+eventKey+"/event_","").replace(".png","");
							localStorage.setItem(name, png);
						});*/
					});
				});
				//changeImage(findFirst(first));
			}
   		});
		$("#loader").css("visibility","hidden");
	}

	function viewRun(typed) {
		$("#loader").css("visibility","visible");
		var first = null;
		if (($("#runNumInput").val() != "Run Number" || $("#runNumInput").val() == "")&& typed == 1){
			var runNum = $("#runNumInput").val();
		}
		else if (typed == 0){
			var runNum = $("#runSelect").val();	
		}
		else {
			return;	
		}
		console.log("Getting run: "+runNum);
		$.ajax({ 
        type: 'GET', 
        url: 'pngCrawler.php', 
		data: {run:runNum}, 
			success: function (data) { 
				var pngs = $.parseJSON(data);
				//console.log(pngs);
				$("#eventSelect")
					.empty()
					.end()
					.append('<option value="DEFAULT"> - </option>');
				$.each(pngs, function(eventKey,eventValue) {
					if(first == null){first = eventKey.replace("ev","");}
					$("#eventSelect")
						.append($("<option></option>")
						.attr("value",eventKey.replace("ev",""))
						.text(eventKey));
					$.each(eventValue, function(key,value) {
						var png = value.png;
						var name = value.png.replace("output/ANITA3/event/all/run"+runNum+"/"+eventKey+"/event_","").replace(".png","");
						if (localStorage.getItem(name)!= null) {localStorage.setItem(name, png);}
					});
				});
				if($("#current").val() == '0' && first != null){changeImage(findFirst(first));}
			}
   		});
		$("#loader").css("visibility","hidden");
	}
		
	function findFirst(base) {
		var i = base;
		while (i!= base+10000) {
			if(localStorage.getItem(i)!= null) {
				return i;
			}
			i++;
		}
	}		
	
	function changeImage(id) {
		$("#img").attr("src", localStorage.getItem(id));
		$("#current").val("ev"+id);
	}
	
	function viewEvent() {
		var base = $("#eventSelect").val();	
		var first = findFirst(base);
		changeImage(first);
	}
	
	function next() {
		var current = parseInt($("#current").val().replace("ev",""));
		var i = current+1;
		var changed = false;
		while (i!= current+10000) {
			//console.log(i);
			//console.log(localStorage.getItem(i));
			if(localStorage.getItem(i)!== null) {
				changeImage(i);
				changed = true;
				return;
			}
			else {
				i++;
			}
		}
		if (!changed) {
			alert("No more images in this event section. (Or you clicked too fast)");
		}
	}
	
	function previous() {
		var current = parseInt($("#current").val().replace("ev",""));
		var i = current-1;
		var changed = false;
		while (i!= current-10000) {
			if(localStorage.getItem(i)!== null) {
				changeImage(i);
				changed = true;
				return;
			}
			else {
				i--;
			}
		}
		if (!changed) {
			alert("No previous images in this event section. (Or you clicked too fast)");
		}
	}
	
	//Check every 30 secs for new images and add them to the list 
	$(document).ready(function () {var timer = setInterval(runRefresher,30000)});
	localStorage.clear();
	
</script>
</head>

<body>
<div>
    <p>Enter a run number or view all?</p>
    <input id="runNumInput" type="text" value="Run Number">
    <button onclick="viewRun(1);" type="button">View run</button>
    <button onclick="viewAll();" type="button">View all</button>
    <img id="loader" src="images/ajaxLoading.gif" style="visibility:hidden">
</div>
<br />
<div id="tree">
	<select id="runSelect" onChange="viewRun(0);"><option value="DEFAULT"> - </option></select>
	<select id="eventSelect" onChange="viewEvent();"><option value="DEFAULT"> - </option></select>
</div>
<div id="screen">
	<img id="img" src="http://www.hep.ucl.ac.uk/uhen/anita/chris/aware/aware/web/output/ANITA3/event/all/run10583/ev11242000/event_11242642.png" width="1196px" height="772px">
</div>
<div id="controls">
    <button onclick="previous();" type="button">Previous</button>
    <input  id="current" type="text" width="50px" value="0" disabled>
    <button onclick="next();" type="button">Next</button>
</div>
</body>
</html>
