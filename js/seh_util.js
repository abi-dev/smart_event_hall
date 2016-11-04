/*
    Smart Event Hall - 3D-Visualization
    HTL Hollabrunn 2016 - 29 09 2016
    V1.1
    Author: Benjamin Ableidinger
*/

// Converts a position to view coordinates.
// INPUTS:  x, y, z ... Position in WebGL coordinates (0|0|0 in the middle of the screen)
// OUTPUTS: x, y, z ... Position in view coordinates (0|0|0 in lower back left corner of the hall)
function toViewCoords([x,y,z]) {
    x = (x*10+hallLength/2)*100/hallLength;
    y = (y*10+hallHeight/2)*100/hallHeight;
    z = (z*10+hallWidth/2)*100/hallWidth;

    return({
        x: x,
        y: y,
        z: z
        });
}

// Converts a position to WebGL coordinates.
// INPUTS:  x, y, z ... Position in view coordinates (0|0|0 in lower back left corner of the hall)
// OUTPUTS: x, y, z ... Position in WebGL coordinates (0|0|0 in the middle of the screen)
function toWebGLCoords([x,y,z]) {
    x = ((x*hallLength/100)-hallLength/2)/10;
    y = ((y*hallHeight/100)-hallHeight/2)/10;
    z = ((z*hallWidth/100)-hallWidth/2)/10;

    return({
        x: x,
        y: y,
        z: z
        });
}

// Generates color spectrum according to temp to color conversion.
// INPUTS:  none
// OUTPUTS: none
function generateColorPlot() {
	var color = [];
	var c = document.getElementById("colorPlot");
	var ctx = c.getContext("2d");
	ctx.clearRect(0, 0, 201, 75);
    // set font, draw descriptive text
	ctx.font = "12px Verdana";
	//ctx.fillText('5'+String.fromCharCode(176)+'C             20'+String.fromCharCode(176)+'C        30'+String.fromCharCode(176)+'C',5,65);
    // draw spectrum
    if(document.getElementById("dataSel").value == 0) {
    	var selSym = String.fromCharCode(176)+'C';
    	var selFact = 40; // max temp value = 40°C
    } else {
    	var selSym = '%';
    	var selFact = 100; // max temp value = 100%
    }
    var j = 0;
	for(var i=0; i<201;i++) {
		if(document.getElementById("dataSel").value == 0) {
			color = tempToColor(i*selFact/200);
		} else {
			color = humToColor(i*selFact/200);
		}
		ctx.beginPath();
		ctx.moveTo(i,0);
		ctx.lineTo(i,50);
		ctx.strokeStyle = 'rgb('+ (color[0]*255).toFixed(0) +','+ (color[1]*255).toFixed(0) +','+ (color[2]*255).toFixed(0) + ')';
		ctx.stroke();
		if(i%82 == 0) {
			ctx.fillText((i*selFact/200).toFixed(0)+selSym,i,65);
			j++;
		}
	}
}

function dataSelChanged() {
	generateColorPlot();
}

function AddEvent(object, type, callback) {
    if (object == null || typeof(object) == 'undefined') return;
	    if (object.addEventListener) {
	        object.addEventListener(type, callback, false);
	    } else if (object.attachEvent) {
	        object.attachEvent("on" + type, callback);
	    } else {
	        object["on"+type] = callback;
	    }
};

function RemoveEvent(object, type, callback) {
    if (object == null || typeof(object) == 'undefined') return;
	    if (object.removeEventListener) {
	        object.removeEventListener(type, callback, false);
	    } else if (object.detachEvent) {
	        object.detachEvent("on" + type, callback);
	    } else {
	        object["on"+type] = callback;
	    }
};

function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

function tempToColor(temp) {
	var r = Math.pow(Math.E,(-(Math.pow((temp-30),2)/70)));
	var g = Math.pow(Math.E,(-(Math.pow((temp-20),2)/60)));
	var b = Math.pow(Math.E,(-(Math.pow((temp-5),2)/85)));

	return [r, g, b];
}

function humToColor(temp) {
	var r = Math.pow(Math.E,(-(Math.pow((temp-82),2)/300)));
	var g = Math.pow(Math.E,(-(Math.pow((temp-50),2)/300)));
	var b = Math.pow(Math.E,(-(Math.pow((temp-18),2)/300)));

	return [r, g, b];
}

function toStartDate(timeScale, dateType, date) {
	var startDate = date;
	var scale = 0;
	var endDate = date;

	switch(timeScale) {
		case "0":
			scale = 5 * 365;
			break;
		case "1":
			scale = 20 * 30;
			break;
		case "2":
			scale = 20 * 7;
			break;
		case "3":
			scale = 20;
			break;
		case "4":
			scale = 3;
			break;
		case "5":
			scale = 1;
			break;
		default:
			scale = 0;
			break;
	}

	if(dateType == 1) {
		startDate = date;
		endDate.setDate((date.getDate() + scale));
	} else if(dateType == 0) {
		startDate.setDate((date.getDate() - Math.floor(scale/2)));
		endDate.setDate((date.getDate() + Math.floor(scale/2)));
	} else if(dateType == 2) {
		endDate = date;
		startDate.setDate((date.getDate() - scale));
	}

	return {
		startDate: startDate,
		endDate: endDate,
		scale: scale
	};
}
