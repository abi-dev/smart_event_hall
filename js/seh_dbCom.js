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

	if(document.getElementById("modeSel").value == 0) {
		$.post("../php/loadData.php", 
		{
			mode: ""+document.getElementById("modeSel"),
			date: ""+document.getElementById("fromDate"),
			dateType: ""+document.getElementById("dateTypeSel"),
			span: ""+document.getElementById("timeScaleSel")
		},
    	function (data) {
	    	sensData = JSON.parse(data);
	    	for(var i = 0; i<sensData.length;i++) {
					sensData[i].pos = [sensData[i].posX, sensData[i].posY, sensData[i].posZ];
				}
			
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
		});
	} else if(document.getElementById("modeSel").value == 1) {
		var i = 0;
		while (sensData[i]) {
			if(historyData3D[i]) {
				sensData[i].temp = historyData3D[i].temp;
			} else {
				var index = sensData.indexOf(i);
				if (index > -1) {
				    sensData.splice(index, 1);
				}
			}
			i++;
		}
		//sensData = historyData3D;
	}

	// call loadData every 10 seconds
	setTimeout(loadData, 10000);
}
