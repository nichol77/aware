<h2 class="navigation">Web Monitoring</h2>
<p class="navigation">

<script type="application/javascript">
function checkFiles() {
	$.ajax({ 
        type: 'GET', 
        url: 'newFileChecker.php',  
        success: function (data) { 
            var fileTimes = $.parseJSON(data);
			//console.log(data);
			console.log(fileTimes);
			$.each(fileTimes, function(key,value) {
				// If the value in local storage is older than the new value
				// (in fileTimes) replace the local storage value + do something
				if (value > localStorage.getItem(key)){
					$("#statusBox").text("New files have been processed!\n A new "+key+" is available.");
					localStorage.setItem(key,value);
				}
			});
			
        }
    });
}

//Check every 10 seconds 
$(document).ready(function () {var timer = setInterval(checkFiles,10000);});
</script>

<div id="statusBox" style="color:red;"></div>
<a class="leftBar" title=
"Main Page" href="." accesskey=
"C">Main</a>


<a class=
"leftBar" title="Events" href="events.php"
accesskey="C">Events</a>

<a class=
"leftBar" title="Events" href="cmd.php"
accesskey="C">Command</a>


<a class=
"leftBar" title="Housekeeping" href="awareHk.php"
accesskey="C">Housekeeping</a>


<a class=
"leftBar" title="Summary" href="runSum.php"
accesskey="C">Summary</a>
</p>
