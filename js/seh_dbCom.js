/*
    Smart Event Hall - 3D-Visualization
    HTL Hollabrunn 2016 - 05 10 2016
    V1.0
    Author: Benjamin Ableidinger
*/

function loadData() {
	//sensData = []; // clear old data
	elemCount = null;
	document.getElementById("datacont").innerHTML = "";

	if(document.getElementById("modeSel").value == 0) { // Current / Most recent mode
		spinner.spin();
		console.log('Updating current data.');
		$.post("../php/loadData.php", 
		{
			mode: ""+document.getElementById("modeSel"),
			date: ""+document.getElementById("fromDate"),
			dateType: ""+document.getElementById("dateTypeSel"),
			span: ""+document.getElementById("timeScaleSel")
		},
    	function (data) {
	    	var data = JSON.parse(data);
	    	sensData = data.sensData;
	    	sensInfo = data.sensInfo;
			
	    	if(curSel != null) {
				if (editStation == true) {
					posXOld = toWebGLCoords([document.getElementById("posXField").value,document.getElementById("posYField").value,document.getElementById("posZField").value]).x;
					posYOld = toWebGLCoords([document.getElementById("posXField").value,document.getElementById("posYField").value,document.getElementById("posZField").value]).y;
					posZOld = toWebGLCoords([document.getElementById("posXField").value,document.getElementById("posYField").value,document.getElementById("posZField").value]).z;
				} else {
					posXOld = null; posYOld = null; posZOld = null;
				}
				setWebGLData();
				if(editStation == true) {
					document.getElementById("posXField").value = (toViewCoords([posXOld, posYOld, posZOld]).x).toFixed(0);
					document.getElementById("posYField").value = (toViewCoords([posXOld, posYOld, posZOld]).y).toFixed(0);
					document.getElementById("posZField").value = (toViewCoords([posXOld, posYOld, posZOld]).z).toFixed(0);
				}
			} else {
				listMissingData();
			}
			spinner.stop();
		});
	} else if(document.getElementById("modeSel").value == 1) { // History mode
		console.log('Updating history data.');
		var i = 0;
		sensData = [];
		try {
		  while(historyData3D.data[selDate][i] != null) {
				sensData[i] = {};
				//sensInfo[i] = {};
				sensData[i].temp = historyData3D.data[selDate][i];
				//console.log(historyData3D.data[selDate][i]);
				sensInfo[i].pos = [historyData3D.pos[i][0],historyData3D.pos[i][1],historyData3D.pos[i][2]];
				sensInfo[i].hallID = historyData3D.pos[i][3];
				//console.log(sensData);
				i++;
			}
		} catch (e) {
		  if (e instanceof TypeError) {
		  	//console.log(historyData3D);
		  	console.log('historyData3D.data is null');
		    // ignore TypeError
		  } 
		  else if(e instanceof RangeError) {
		    // handle RangeError
		  }
		  else {
		    // something else
		  } 
		}
	}

	// call loadData every 10 seconds
	setTimeout(loadData, 10000);
}
