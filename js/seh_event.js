/*
    Smart Event Hall - 3D-Visualization
    HTL Hollabrunn 2016 - 29 09 2016
    V1.01
    Author: Benjamin Ableidinger
*/

// Called when edit button is clicked. Selects according station and calls station edit interface.
// INPUTS:  buttonID... ID of the pressed button
// OUTPUTS: none
function editButtonSmallClick(buttonID) {
    curSel = buttonID;
    editStationCalled();
}

// Sets variable to draw edit-station interface.
// INPUTS:  none
// OUTPUTS: none
function editStationCalled() {
    editStation = true;
    setWebGLData();
}

// Saves the edited values.
// INPUTS:  none
// OUTPUTS: none
function saveStationCalled() {
    // validate inputs
    if(( (document.getElementById("posXField").value<0)||(document.getElementById("posXField").value>100) )||( (document.getElementById("posYField").value<0)||(document.getElementById("posYField").value>100) )||( (document.getElementById("posZField").value<0)||(document.getElementById("posZField").value>100) )) {
        alert('Input out of range!');
    } else {
        // if input data is correct -> update variables
        var WebGLCoords = toWebGLCoords([document.getElementById("posXField").value, document.getElementById("posYField").value, document.getElementById("posZField").value]);
        
        $.ajax({
            'url': '../php/updatePos.php', 
            'type': 'POST',
            'dataType': 'json', 
            'data': {
                posX: WebGLCoords.x,
                posY: WebGLCoords.y,
                posZ: WebGLCoords.z,
                curSel: curSel
            }, 
            'success': function(data) 
            {
               console.log('Pos for Station'+curSel+' updated successfully.');
            },
            'beforeSend': function() 
             {
             },
              'error': function(data) 
              {
              // request failed
                console.log('Failed to update pos for Station'+curSel+'.');
            }
        });
        //sensData[curSel].pos = [WebGLCoords.x, WebGLCoords.y, WebGLCoords.z];
    }
    editStation = false;
    setWebGLData(); // draw station overview in no-edit mode
}

// Unselects the currently selected station.
// INPUTS:  none
// OUTPUTS: none
function unSelStationCalled() {
    curSel = null;
    editStation = false;
    var WebGLData = document.getElementById("webgldata");
    WebGLData.innerHTML = ''; // clear div element
    listMissingData(); // draw missing data overview
}

// Gets mouseposition when left mousebutton is clicked.
// INPUTS:  event   ... browser mouse event
// OUTPUTS: none
function getPosition(event)
{
    var canvas = document.getElementById("webGLCanvas");
    var surface = document.getElementById("surface");

    //event.preventDefault();
    //event.stopPropagation();

    if (event.x != undefined && event.y != undefined)
    {
      clipX = event.x + document.documentElement.scrollLeft + document.body.scrollLeft;
      clipY = event.y + document.documentElement.scrollTop + document.body.scrollTop;
    }
    else // Firefox method to get the position
    {
      clipX = event.clientX + document.body.scrollLeft +
          document.documentElement.scrollLeft;
      clipY = event.clientY + document.body.scrollTop +
          document.documentElement.scrollTop;
    }

    // offset of the WebGL canvas caused by margins, paddings
    clipX -= surface.offsetLeft; // canvas.offsetLeft
    clipY -= surface.offsetTop; // canvas.offsetTop

    // flip y coords
    clipY = gl.viewportHeight - clipY; 

    // convert to canvas coords
    x = (2 * clipX) / canvas.width - 1;
    y = 1 - (2 * clipY) / canvas.height;
    var z = 1;

    picked = true; // mouse has been clicked on the canvas
}

// Sets global variable indicating that the mousepos is within the WebGL canvas.
// INPUTS:  none
// OUTPUTS: none
function onMouseOverWebGL() {
	webGLActive = true;
}

// Clears global variable indicating that the mousepos is within the WebGL canvas.
// INPUTS:  none
// OUTPUTS: none
function onMouseOutWebGL() {
	webGLActive = false;
}

// xxxxxx
// INPUTS:  none
// OUTPUTS: none
function onMouseOverSliderCanvas() {
    sliderCanvasActive = true;
}

// xxxxxxxxx
// INPUTS:  none
// OUTPUTS: none
function onMouseOutSliderCanvas() {
    sliderCanvasActive = false;
    sliderDragActive = false;
}

// Changes current zoom level when mousewheel is scrolled.
// INPUTS:  none
// OUTPUTS: none
function onZoom(e) {
	if(webGLActive == true) {
		if (e.deltaY < 0) {
			curZoom += zoomincrement;
		} else {
			curZoom -= zoomincrement;
		}
	}
}

// Sets rotation matrix if view is dragged with the mouse.
// INPUTS:  none
// OUTPUTS: none
function onMouseMove(e) {
	if ((e.buttons === 1)&&(webGLActive == true)) {
		/*if(e.movementY != 0) {
			mat4.rotate(rotMatrix, rotMatrix, degToRad(e.movementY * rotationangle), [1, 0, 0]); 
		}*/
		if(e.movementX != 0) {
			mat4.rotate(rotMatrix, rotMatrix, degToRad(e.movementX * rotationangle), [0, 1, 0]);
    		}
	} else if (sliderCanvasActive == true) {
        
        var surface = document.getElementById("sliderCanvasContent");
        if (e.x != undefined && e.y != undefined)
        {
          var canvX = e.x + document.documentElement.scrollLeft + document.body.scrollLeft;
          var canvY = e.y + document.documentElement.scrollTop + document.body.scrollTop;
        }
        else // Firefox method to get the position
        {
          var canvX = e.clientX + document.body.scrollLeft +
              document.documentElement.scrollLeft;
          var canvY = e.clientY + document.body.scrollTop +
              document.documentElement.scrollTop;
        }

        canvX -= surface.offsetLeft;
        canvY -= surface.offsetTop;
        if((e.movementX != 0)&&(canvX < sliderPos +4)&&(canvX > sliderPos -4)) {
            surface.style.cursor = "ew-resize";
        }else {
            surface.style.cursor = "default";
        }
        if((e.movementX != 0)&&(sliderDragActive == true)) {
            sliderPos += e.movementX;
            drawSlider();
        }
    } else {
    }

}

// Resets the view to standards.
// INPUTS:  none
// OUTPUTS: none
function resetView() {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	mat4.identity(rotMatrix);
	curZoom = 0;
	rot = 0;
    // reset sliders
    document.getElementById("zoomnumber").value = 0;
    document.getElementById("rotnumber").value = 0;
}

function onSliderCanvasClicked(e) {
    var surface = document.getElementById("sliderCanvasContent");
    if (e.x != undefined && e.y != undefined)
    {
      var canvX = e.x + document.documentElement.scrollLeft + document.body.scrollLeft;
      var canvY = e.y + document.documentElement.scrollTop + document.body.scrollTop;
    }
    else // Firefox method to get the position
    {
      var canvX = e.clientX + document.body.scrollLeft +
          document.documentElement.scrollLeft;
      var canvY = e.clientY + document.body.scrollTop +
          document.documentElement.scrollTop;
    }


    canvX -= surface.offsetLeft;
    canvY -= surface.offsetTop;

    if((canvX < sliderPos +4)&&(canvX > sliderPos -4)) {
        sliderDragActive = true;
    }else {
        sliderDragActive = false;
    }
}

function onSliderCanvasReleased() {
    sliderDragActive = false;
}

function modeSelChanged() {
    var modeSel = document.getElementById("modeSel");
    var historySettings = document.getElementById("historySettingsButton");
    if(modeSel.value == 0) {
        historySettings.style.visibility = "hidden";
    } else if(modeSel.value == 1) {
        historySettings.style.visibility = "visible";
        historySettings.innerHTML = "Settings";
    }
}

function historySettingsButtonClicked() {
    var historySettings = document.getElementById("myPopup");
    historySettings.classList.toggle('show');
}

function historyDataChanged() {
    var timeScale = document.getElementById("timeScaleSel");
    var dateTypeSel = document.getElementById("dateTypeSel");
    var date = document.getElementById("fromDate");

    date = new Date(date.value);
    var startDate = new Date();

    var temp = toStartDate(timeScale.value, dateTypeSel.value, date);
    
    if(curSel != null) {
        $.post("../php/loadHistoryData.php", 
            {
                mode: ""+document.getElementById("modeSel"),
                startDate: temp.startDate.toISOString().substring(0, 10),
                dateType: ""+document.getElementById("dateTypeSel"),
                span: ""+document.getElementById("timeScaleSel"),
                curSel: curSel
            },
            function (data) {
                historyData = JSON.parse(data);
                console.log(data);
                /*$.each(historyData, function(time, value) {
                    console.log(time, value);
                };*/

        });
    }
}
