/*
    Smart Event Hall - 3D-Visualization
    HTL Hollabrunn 2016 - 29 09 2016
    V1.0
    Author: Benjamin Ableidinger
*/

function initSidebar() {
}

// Draws data overview for a station.
// INPUTS:  none
// OUTPUTS: none
function setWebGLData() {
    var WebGLData = document.getElementById("webgldata");
    WebGLData.innerHTML = ''; // clear div element

    // create html elements
    var tableDiv = document.createElement("div");
    var WebGLDataContent = document.createElement("div");
    WebGLDataContent.innerHTML += '<b>Selected Station:</b>';
    var table = document.createElement("table");
    table.id = 'WebGLDataTable';
    var rows = [];
    var cells = [];
    // generate rows and fill them with cells (build table)
    for(var i=0;i<4;i++) {
        rows[i] = table.insertRow(i);
        cells[i] = [];
        for(var j=0;j<2;j++) {
            cells[i][j] = rows[i].insertCell(j);
        }  
    }
    // fill descriptive text (left column)
    cells[0][0].innerHTML = '<b>ID</b>';
    cells[1][0].innerHTML = 'Temperature';
    cells[2][0].innerHTML = 'Humidity';
    cells[3][0].innerHTML = 'Position';
    // fill in data
    cells[0][1].innerHTML = '<b>'+curSel+'</b>';
    if(sensData[curSel].temp == null) { // no °C if null
        cells[1][1].innerHTML = 'null';
    } else {
        cells[1][1].innerHTML = sensData[curSel].temp + String.fromCharCode(176) + 'C';
    }
    if(sensData[curSel].hum == null) { // no % if null
        cells[2][1].innerHTML = 'null';
    } else {
        cells[2][1].innerHTML = sensData[curSel].hum + '%';
    }

    var WebGLDataButtons = document.createElement("div");

    WebGLData.appendChild(WebGLDataContent);
    WebGLData.appendChild(WebGLDataButtons);
    WebGLDataContent.appendChild(tableDiv);
    tableDiv.appendChild(table);

    /* EDIT INTERFACE */
    // fill position data and generate position inputs
    if(editStation == true) {
        // generate number input elements
        cells[3][1].innerHTML = 'X: ';
        posXField = document.createElement("input");
        posXField.type = 'number';
        posXField.style.width = '40px';
        posXField.min = 0; posXField.max = 100;
        posXField.id = 'posXField';
        //set default to current position values
        posXField.defaultValue = (toViewCoords(sensInfo[curSel].pos).x).toFixed(0);
        cells[3][1].appendChild(posXField);

        cells[3][1].innerHTML += '</br>Y: ';
        posYField = document.createElement("input");
        posYField.type = 'number';
        posYField.style.width = '40px';
        posYField.min = 0; posYField.max = 100;
        posYField.id = 'posYField';
        posYField.defaultValue = (toViewCoords(sensInfo[curSel].pos).y).toFixed(0);
        cells[3][1].appendChild(posYField);

        cells[3][1].innerHTML += '</br>Z: ';
        posZField = document.createElement("input");
        posZField.type = 'number';
        posZField.style.width = '40px';
        posZField.min = 0; posZField.max = 100;
        posZField.id = 'posZField';
        posZField.defaultValue = (toViewCoords(sensInfo[curSel].pos).z).toFixed(0);
        cells[3][1].appendChild(posZField);

        // generate save button
        var saveButton = document.createElement("button");
        saveButton.innerHTML = 'Save Station';
        saveButton.id = 'saveButton';
        saveButton.onclick = function (){saveStationCalled();};
        WebGLDataButtons.appendChild(saveButton);
    } else { 
        /* STATION OVERVIEW */
        var coordString = 'X: ';
        if(sensInfo[curSel].pos[0] == null) { // prevent % when pos data is null
            coordString += 'null';
        } else { // if data is valid -> show position data
            coordString += (toViewCoords(sensInfo[curSel].pos).x).toFixed(0)+'%';
        }
        coordString += '</br>Y: ';
        if(sensInfo[curSel].pos[1] == null) {
            coordString += 'null';
        } else {
            coordString += (toViewCoords(sensInfo[curSel].pos).y).toFixed(0)+'%';
        }
        coordString += '</br>Z: ';
        if(sensInfo[curSel].pos[2] == null) {
            coordString += 'null';
        } else {
            coordString += (toViewCoords(sensInfo[curSel].pos).z).toFixed(0)+'%';
        }
        cells[3][1].innerHTML = coordString;

        // generate edit button
        var editButton = document.createElement("button");
        editButton.innerHTML = 'Edit Station';
        editButton.id = 'editButton';
        editButton.onclick = function (){editStationCalled();};
        WebGLDataButtons.appendChild(editButton);
    }

    //generate unselect button
    var unselectButton = document.createElement("button");
    unselectButton.innerHTML = 'Unselect Station';
    unselectButton.id = 'unselectButton';
    unselectButton.onclick = function (){unSelStationCalled();};
    WebGLDataButtons.appendChild(unselectButton);
}

// Creates a list of stations which have missing data.
// INPUTS:  none
// OUTPUTS: none
function listMissingData() {
    if(curSel == null) { // only display list if no station is selected
        document.getElementById("webgldata").innerHTML = ""; // clear div
        // create surrounding html elements
        var WebGLData = document.getElementById("webgldata");
        var content = document.createElement("div");
        if(document.getElementById("modeSel").value == 0) { // Current / Most recent mode
            content.innerHTML = '<b>Data missing:</b>';
            var table = document.createElement("table");
            table.id = 'WebGLDataMissing';
            var rows = [];
            var cells = [];
            var status = 0;
            var i = 0;
            var j = 0;
            var editButtonSmall = [];
            // loop through stations and look for missing data
            while(sensData[i]) {
                // set status according to missing data
                if((sensInfo[i].pos[0] == null)||(sensInfo[i].pos[1] == null)||(sensInfo[i].pos[2] == null)) {
                    status = 'posMissing';
                } else if(sensData[i].temp == null) {
                    status = 'tempMissing';
                } else if(sensData[i].hum == null) {
                    status = 'humMissing';
                }  else {
                    status = 0; // no data is missing
                }

                if((status != 0)&&(sensInfo[i].hallID == document.getElementById("hallSel").value)) { // add row to the list if data is missing
                    rows[j] = table.insertRow(j);
                    cells[j] = [];
                    for(var k=0;k<3;k++) {
                        cells[j][k] = rows[j].insertCell(k);
                    }
                    cells[j][0].innerHTML = 'Station'+i; 
                    cells[j][1].innerHTML = status;

                    editButtonSmall[i] = document.createElement("button");
                    editButtonSmall[i].innerHTML = 'Edit';
                    editButtonSmall[i].id = i;
                    editButtonSmall[i].setAttribute("onclick", "javascript: editButtonSmallClick(this.id);");
                    editButtonSmall[i].className = ' editButtonSmall';
                    cells[j][2].appendChild(editButtonSmall[i]);

                    j++;
                }
                i++;
            }

            if(j != 0) {
                // create header
                var header = table.createTHead();
                var headerRow = header.insertRow(0);
                var headerCell0 = headerRow.insertCell(0); var headerCell1 = headerRow.insertCell(1); var headerCell2 = headerRow.insertCell(2);
                headerCell0.innerHTML = '<b>Station</b>'; headerCell1.innerHTML = '<b>StatusMsg</b>'; headerCell2.innerHTML = '';
            } else {
                content.innerHTML += '</br>none';
            }

            content.appendChild(table);
            //webgldata.appendChild(content);
        } else if(document.getElementById("modeSel").value == 1) { // History mode
            content.innerHTML = '<b>Existent Stations:</b>';

            // insert table creation
            var i = 0;
            while(sensInfo[i]) {
                content.innerHTML += '</br>Station'+i;
                i++;
            }
            //console.log(sensInfo);

            /*if(j != 0) {
                // create header
                var header = table.createTHead();
                var headerRow = header.insertRow(0);
                var headerCell0 = headerRow.insertCell(0); var headerCell1 = headerRow.insertCell(1);
                headerCell0.innerHTML = '<b>Station</b>'; 
            } else {
                content.innerHTML += '</br>none';
            }*/
        }
        webgldata.appendChild(content);
    }
}

/*  DATA HISTORY CANVAS CONTENT FUNCTIONS   */


function drawHistory(historyData) {
    var historyCanvas = document.getElementById("historyDataCanvas");
    var history2DContext = historyCanvas.getContext("2d");
    history2DContext.clearRect(0, 0, 1000, 150);
    var label = "temp";
    lineIndex = 10;
    selDate = historyData.time[lineIndex];
    var data = {
        labels: historyData.time,
        datasets: [
            {
                label: label,
                fill: false,
                lineTension: 0.1,
                backgroundColor: "rgba(0, 0, 0,1)",
                borderWidth: 2,
                borderColor: "rgba(30, 116, 255,1)",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "rgba(22, 83, 183,1)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 3,
                pointHoverBackgroundColor: "rgba(22, 83, 183,1)",
                pointHoverBorderColor: "rgba(22, 83, 183,1)",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: historyData.avgTemp,
                spanGaps: false,
            }
        ],
        lineAtIndex: lineIndex
    }

    var originalLineDraw = Chart.controllers.line.prototype.draw;
    Chart.helpers.extend(Chart.controllers.line.prototype, {
      draw: function() {
        originalLineDraw.apply(this, arguments);

        var chart = this.chart;
        var ctx = chart.chart.ctx;

        var index = chart.config.data.lineAtIndex;
        if (index) {
          var xaxis = chart.scales['x-axis-0'];
          var yaxis = chart.scales['y-axis-0'];

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(xaxis.getPixelForValue(undefined, index), yaxis.top);
          ctx.strokeStyle = '#ff0000';
          ctx.lineTo(xaxis.getPixelForValue(undefined, index), yaxis.bottom);
          ctx.stroke();
          ctx.restore();
        }
      }
    });

    historyChart = new Chart(history2DContext, {
    type: 'line',
    data: data,
    options: {
        legend: {
            display: false
        },
        scales: {
            yAxes: [{
                //display: false
            }],
            xAxes: [{
                //display: false
            }]
        },
    }
    });

    historyCanvas.onclick = function(e) {
        var selPoint = historyChart.getElementsAtEvent(e);
        if (selPoint[0]) {
            lineIndex = selPoint[0]._index;
            historyChart.data.lineAtIndex = lineIndex;
            historyChart.update();
            selDate = historyChart.data.labels[lineIndex];
            historyDataChanged();
            loadData();
        } else {
            console.log('No hits dectected.');
        }   
    }
}

function updateHistory(historyData) {
    historyChart.data.datasets[0].data = historyData.avgTemp;
    historyChart.data.labels = historyData.time;
    historyChart.update();
}

function resetHistory()  {
    loadData();
    var historyCanvas = document.getElementById("historyDataCanvas");
    var history2DContext = historyCanvas.getContext("2d");
    history2DContext.clearRect(0, 0, 1000, 150);
    selDate = null;
    sensData = [];
}
