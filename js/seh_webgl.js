/*
    Smart Event Hall - 3D-Visualization
    HTL Hollabrunn 2016 - 29 09 2016
    V2.20
    Author: Benjamin Ableidinger
*/

function initGL(canvas) {
    try {
        // get cavas context
        gl = canvas.getContext("webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (e) {
    }
    if (!gl) {
        // webgl not supported, try experimental webgl or another browser
        console.log("Could not initialise WebGL.");
    }
}


function getShader(gl, id) {
    // get shader code
    var shaderScript = document.getElementById(id);
    if (!shaderScript) {
        console.log('Shader '+id+' not found.');
        return null;
    }

    var str = "";
    var k = shaderScript.firstChild;
    while (k) {
        if (k.nodeType == 3) {
            str += k.textContent;
        }
        k = k.nextSibling;
    }

    // create the shader
    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        // Shader compile failed
        console.log(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

function initShaders() {
    // create shaders
    var fragmentShader = getShader(gl, "shader-fs");
    var vertexShader = getShader(gl, "shader-vs");

    // create program and attach the shaders
    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    // link the program
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

    gl.useProgram(shaderProgram);

    // create attributes and uniforms
    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
    gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
}

function mvPushMatrix() {
    var copy = mat4.create();
    mat4.copy(copy, mvMatrix);
    mvMatrixStack.push(copy);
}

function mvPopMatrix() {
    if (mvMatrixStack.length == 0) {
        throw "Invalid popMatrix!";
    }
    mvMatrix = mvMatrixStack.pop();
}


function setMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}

function initBuffers() {
    vertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

    vertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);

}

// Draws a cube with color according to the temperature.
// INPUTS:  [x,y,z] ... Cube position
//          temp    ... Temperture in °C
// OUTPUTS: none
function drawData([x, y, z], temp) {
    if(document.getElementById("dataSel").value == 0) {
        var color = tempToColor(temp); // convert temperature to rgb values
    } else {
        var color = humToColor(temp); // convert humidity to rgb values
    }
    drawCube( [x,y,z], stationSize, color[0], color[1], color[2], 1.0); // draw cube with size=0.2u
}

// Draws a line from pos1 to pos2.
// INPUTS:  [x1,y1,z1] ... Start position
//          [x2,y2,z2] ... End position
//          r, g, b    ... RGB values (color)
//          a          ... Alpha value
// OUTPUTS: none
function drawLine([x1,y1,z1], [x2,y2,z2], r, g, b, a) {

    mvPushMatrix(); // save position

    // fill position buffer with start & end position
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
	x1, y1, z1,
	x2, y2, z2]), gl.STATIC_DRAW);

    // fill color buffer with color (r,g,b)
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
    gl.bufferData(
	gl.ARRAY_BUFFER,
	new Float32Array([
	r, g, b, a,
	r, g, b, a]),
	gl.STATIC_DRAW);

    setMatrixUniforms(); // push data to the shaders
    gl.drawArrays(gl.LINES, 0, 2); // draw line

    mvPopMatrix(); // restore position
}

// Draws a cube with certain size and color.
// INPUTS:  [x,y,z] ... Position
//          size    ... Length of a side
//          r, g, b ... RGB values (color)
//          a       ... Alpha value
// OUTPUTS: none
function drawCube ([x,y,z], size, r, g, b, a) {

    mvPushMatrix(); // save position

    mat4.translate(mvMatrix, mvMatrix, [x, y, z]); // move to requested position

	gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
		//top
		-(size/2), +(size/2), -(size/2),
		+(size/2), +(size/2), -(size/2),
		-(size/2), +(size/2), +(size/2),

		+(size/2), +(size/2), -(size/2),
		+(size/2), +(size/2), +(size/2),
		-(size/2), +(size/2), +(size/2),
		//left
		-(size/2), +(size/2), +(size/2),
		-(size/2), -(size/2), +(size/2),
		-(size/2), +(size/2), -(size/2),

		-(size/2), -(size/2), +(size/2),
		-(size/2), -(size/2), -(size/2),
		-(size/2), +(size/2), -(size/2),
		//right
		+(size/2), +(size/2), +(size/2),
		+(size/2), -(size/2), +(size/2),
		+(size/2), +(size/2), -(size/2),

		+(size/2), -(size/2), +(size/2),
		+(size/2), -(size/2), -(size/2),
		+(size/2), +(size/2), -(size/2),
		//front
		+(size/2), +(size/2), +(size/2),
		+(size/2), -(size/2), +(size/2),
		-(size/2), +(size/2), +(size/2),

		+(size/2), -(size/2), +(size/2),
		-(size/2), -(size/2), +(size/2),
		-(size/2), +(size/2), +(size/2),
		//back
		+(size/2), +(size/2), -(size/2),
		+(size/2), -(size/2), -(size/2),
		-(size/2), +(size/2), -(size/2),

		+(size/2), -(size/2), -(size/2),
		-(size/2), -(size/2), -(size/2),
		-(size/2), +(size/2), -(size/2),
		//bottom
		-(size/2), -(size/2), -(size/2),
		-(size/2), -(size/2), +(size/2),
		+(size/2), -(size/2), -(size/2),

		-(size/2), -(size/2), +(size/2),
		+(size/2), -(size/2), +(size/2),
		+(size/2), -(size/2), -(size/2)]), gl.STATIC_DRAW
	);

	//fill the color array
	colors = [];
    for (var i=0; i < 6*6; i++) {
        colors = colors.concat([r, g, b, a]);
    }

    // fill color buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    setMatrixUniforms(); // push data to the shaders
	gl.drawArrays(gl.TRIANGLES, 0, 6*6); // draw triangles

    mvPopMatrix(); // restore position
}

// Draws outlines of the bigger sector of the predefined hall.
// INPUTS:  l, w, h ... length, width, height of the hall
//          r, g, b ... RGB values (color)
//          a       ... Alpha value
// OUTPUTS: none
function drawOutlinesHall1 (l, w, h, r, g, b, a) {
	//back
	drawLine([-l/2,  h/2, -w/2], [ l/2,  h/2, -w/2], r, g, b, a);
	drawLine([ l/2,  h/2, -w/2], [ l/2, -h/2, -w/2], r, g, b, a);
	drawLine([ l/2, -h/2, -w/2], [-l/2, -h/2, -w/2], r, g, b, a);
	drawLine([-l/2, -h/2, -w/2], [-l/2,  h/2, -w/2], r, g, b, a);
	//front 
	drawLine([-l/2,  h/2,  w/2], [ l/2,  h/2,  w/2], r, g, b, a);
	drawLine([ l/2,  h/2,  w/2], [ l/2, -h/2,  w/2], r, g, b, a);
	drawLine([ l/2, -h/2,  w/2], [-l/2, -h/2,  w/2], r, g, b, a);
	drawLine([-l/2, -h/2,  w/2], [-l/2,  h/2,  w/2], r, g, b, a);
	//left
	drawLine([-l/2,  h/2,  w/2], [-l/2,  h/2, -w/2], r, g, b, a);
	drawLine([-l/2, -h/2, -w/2], [-l/2,  -h/2, w/2], r, g, b, a);
	//right
	drawLine([ l/2,  h/2,  w/2],  [l/2,  h/2, -w/2], r, g, b, a);
	drawLine([ l/2, -h/2, -w/2],  [l/2, -h/2,  w/2], r, g, b, a);
	//roof
	drawLine([l/2, h/2, -w/2],  [l/2, h/2 + 0.2,  0], r, g, b, a);
	drawLine([l/2, h/2 + 0.2, 0], [ l/2, h/2 - 0.08, w/2 + 0.5], r, g, b, a);
	drawLine([-l/2, h/2, -w/2],  [-l/2, h/2 + 0.2,  0], r, g, b, a);
	drawLine([-l/2, h/2 + 0.2, 0], [ -l/2, h/2 - 0.08, w/2 + 0.5], r, g, b, a);

	drawLine([ -l/2, h/2 - 0.08, w/2 + 0.5],  [ l/2, h/2 - 0.08, w/2 + 0.5], r, g, b, a);
	drawLine([ l/2, h/2 + 0.2,  0],  [-l/2, h/2 + 0.2,  0], r, g, b, a);

	//garage door short side
	drawLine([ l/2, -h/2,  w/2 - 0.05],  [ l/2, -h/2 + 0.45,  w/2 - 0.05], r, g, b, a);
	drawLine([ l/2, -h/2 + 0.45,  w/2 - 0.05],  [ l/2, -h/2 + 0.45,  w/2 - 0.65], r, g, b, a);
	drawLine([ l/2, -h/2 + 0.45,  w/2 - 0.65],  [ l/2, -h/2,  w/2 - 0.65], r, g, b, a);

	//door next to garage door long side
	drawLine([ l/2 - 3.45, -h/2,  w/2],  [ l/2 - 3.45, -h/2+0.2,  w/2], r, g, b, a);
    drawLine([ l/2 - 3.45, -h/2+0.2,  w/2],  [ l/2 - 3.55, -h/2+0.2,  w/2], r, g, b, a);
    drawLine([ l/2 - 3.55, -h/2+0.2,  w/2],  [ l/2 - 3.55, -h/2,  w/2], r, g, b, a);

	//garage door long side
	drawLine([ l/2 - 3.6, -h/2,  w/2],  [ l/2 - 3.6, -h/2 + 0.45,  w/2], r, g, b, a);
	drawLine([ l/2 - 3.6, -h/2 + 0.45,  w/2],  [ l/2 - 4.2, -h/2 + 0.45,  w/2], r, g, b, a);
	drawLine([ l/2 - 4.2, -h/2 + 0.45,  w/2],  [ l/2 - 4.2, -h/2,  w/2], r, g, b, a);
}

// Draws outlines of the smaller sector of the predefined hall.
// INPUTS:  l, w, h ... length, width, height of the hall
//          r, g, b ... RGB values (color)
//          a       ... Alpha value
// OUTPUTS: none
function drawOutlinesHall2 (l, w, h, r, g, b, a) {
	//back
	drawLine([-l/2,  h/2, -w/2], [ l/2,  h/2, -w/2], r, g, b, a);
	drawLine([ l/2,  h/2, -w/2], [ l/2, -h/2, -w/2], r, g, b, a);
	drawLine([ l/2, -h/2, -w/2], [-l/2, -h/2, -w/2], r, g, b, a);
	drawLine([-l/2, -h/2, -w/2], [-l/2,  h/2, -w/2], r, g, b, a);
	//front 
	drawLine([-l/2,  h/2-0.08,  w/2], [ l/2,  h/2-0.08,  w/2], r, g, b, a);
	drawLine([ l/2,  h/2-0.08,  w/2], [ l/2, -h/2,  w/2], r, g, b, a);
	drawLine([ l/2, -h/2,  w/2], [-l/2, -h/2,  w/2], r, g, b, a);
	drawLine([-l/2, -h/2,  w/2], [-l/2,  h/2-0.08,  w/2], r, g, b, a);
	//left
	drawLine([-l/2,  h/2-0.08,  w/2], [-l/2,  h/2, -w/2], r, g, b, a);
	drawLine([-l/2, -h/2, -w/2], [-l/2,  -h/2, w/2], r, g, b, a);
	//right
	drawLine([ l/2,  h/2-0.08,  w/2],  [l/2,  h/2, -w/2], r, g, b, a);
	drawLine([ l/2, -h/2, -w/2],  [l/2, -h/2,  w/2], r, g, b, a);

	//garage door
	drawLine([ l/2, -h/2+0.45, -w/2 + 0.05],  [l/2, -h/2+0.45,  w/2-0.05], r, g, b, a);
	drawLine([ l/2, -h/2+0.45, -w/2 + 0.05],  [ l/2, -h/2, -w/2 + 0.05], r, g, b, a);
	drawLine([l/2, -h/2+0.45,  w/2-0.05],  [l/2, -h/2,  w/2-0.05], r, g, b, a);
}

function drawCubeOutlines ([x,y,z], size) {
    var l = size;
    var w = size;
    var h = size;
    var r = 0.2;
    var g = 0.2;
    var b = 0.2;
    var a = 1.0;
    mvPushMatrix();

    mat4.translate(mvMatrix, mvMatrix, [x, y, z]); // move to requested position

    //back
    drawLine([-l/2,  h/2, -w/2], [ l/2,  h/2, -w/2], r, g, b, a);
    drawLine([ l/2,  h/2, -w/2], [ l/2, -h/2, -w/2], r, g, b, a);
    drawLine([ l/2, -h/2, -w/2], [-l/2, -h/2, -w/2], r, g, b, a);
    drawLine([-l/2, -h/2, -w/2], [-l/2,  h/2, -w/2], r, g, b, a);
    //front 
    drawLine([-l/2,  h/2,  w/2], [ l/2,  h/2,  w/2], r, g, b, a);
    drawLine([ l/2,  h/2,  w/2], [ l/2, -h/2,  w/2], r, g, b, a);
    drawLine([ l/2, -h/2,  w/2], [-l/2, -h/2,  w/2], r, g, b, a);
    drawLine([-l/2, -h/2,  w/2], [-l/2,  h/2,  w/2], r, g, b, a);
    //left
    drawLine([-l/2,  h/2,  w/2], [-l/2,  h/2, -w/2], r, g, b, a);
    drawLine([-l/2, -h/2, -w/2], [-l/2,  -h/2, w/2], r, g, b, a);
    //right
    drawLine([ l/2,  h/2,  w/2],  [l/2,  h/2, -w/2], r, g, b, a);
    drawLine([ l/2, -h/2, -w/2],  [l/2, -h/2,  w/2], r, g, b, a);
    mvPopMatrix();
}

// Draws the scene.
// INPUTS:  none
// OUTPUTS: none
function drawScene() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);    // clear screen

    // set fov, min/max zoom to still display the graphic
    mat4.perspective (pMatrix, 45.0, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0);


    mat4.identity(mvMatrix); // set camera to 0,0,0 of world

    mat4.translate(mvMatrix, mvMatrix, [0.0, 0.0, curZoom]); // Translate the view if zoomed (mouseevent)
    
    mat4.translate(mvMatrix, mvMatrix, [0.0, 0.0, document.getElementById("zoomnumber").value]); // Translate the view if zoomed (slider input)

    // set default zoom according to selected hall
    if (document.getElementById("hallSel").value == "1") {
    	mat4.translate(mvMatrix, mvMatrix, [0.0, 0.0, -6.0]);
    } else if (document.getElementById("hallSel").value == "2") {
		mat4.translate(mvMatrix, mvMatrix, [0.0, 0.0, -2.5]);
    }

    // set default rotation
    mat4.rotate(mvMatrix, mvMatrix, degToRad(-55), [0, 1, 0]);
    mat4.rotate(mvMatrix, mvMatrix, degToRad(15), [1, 0, 0]);
    mat4.rotate(mvMatrix, mvMatrix, degToRad(-15), [0, 0, 1]);

    mat4.rotate(mvMatrix, mvMatrix, degToRad(rot), [0, 1, 0]); // update autorotation

    mat4.mul(mvMatrix, mvMatrix, rotMatrix); // update the view if dragged (mouseevent)
    mat4.rotate(mvMatrix, mvMatrix, degToRad(document.getElementById("rotnumber").value), [0, 1, 0]); // Rotate the view by slider value

    // BUFFER SELECT? var -> drawFramebuffer
    if (picked == true) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
        gl.viewport(0, 0, frameWidth, frameHeight); // set viewport
    } else {
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight); // set viewport
    }

    // clear station selection on hall change
    if (hallSelCur != document.getElementById("hallSel").value) {
        unSelStationCalled();
    }
    hallSelCur = document.getElementById("hallSel").value;

    // draw hall outlines, read dropdown value to select
    if ((document.getElementById("hallSel").value == "1") && (picked == false)) {
        hallLength = 60; hallWidth = 25; hallHeight = 6;
    	drawOutlinesHall1(hallLength/10, hallWidth/10, hallHeight/10, 0.2, 0.2, 0.2, 0.7);
		mvPushMatrix();
		mat4.translate(mvMatrix, mvMatrix, [-2.25, 0.0, 1.5]); // move to center of 2nd hall
		drawOutlinesHall2(1.5, 0.5, 0.6, 0.2, 0.2, 0.2, 0.3); // draw 2nd hall with low alpha
		mvPopMatrix();
    } else if ((document.getElementById("hallSel").value == "2") && (picked == false)) {
        hallLength = 15; hallWidth = 5; hallHeight = 6;
		drawOutlinesHall2(hallLength/10, hallWidth/10, hallHeight/10, 0.2, 0.2, 0.2, 0.7);
		mvPushMatrix();
        mat4.translate(mvMatrix, mvMatrix, [2.25, 0.0, -1.5]); // move to center of 2nd hall 
		drawOutlinesHall1(6.0, 2.5, 0.6, 0.2, 0.2, 0.2, 0.3); // draw 2nd hall with low alpha
		mvPopMatrix();
    }

    // loop through data array and draw temperature data
    var i = 0;
    while(sensData[i]) {
        if(sensData[i].hallID == document.getElementById("hallSel").value) {
            if(document.getElementById("dataSel").value == 0) { // only render data points with valid data
                var selData = sensData[i].temp;
            } else {
                var selData = sensData[i].hum;
            }
            if ((sensData[i].pos[0] != null)&&(sensData[i].pos[1] != null)&&(sensData[i].pos[2] != null)&&(selData != null)) {
                if (picked == true) {
                    drawCube(sensData[i].pos, 0.2, i/256, 1, 1, 1);
                } else {
                    if (curSel == i) {
                        stationSize = 0.25;
                        drawCubeOutlines(sensData[i].pos, stationSize); // cubesize = 0.2
                    }
                    if(document.getElementById("dataSel").value == 0) {
                        drawData(sensData[i].pos, sensData[i].temp);
                    } else {
                        drawData(sensData[i].pos, sensData[i].hum);
                    }
                    
                    stationSize = 0.2;
                }
            } else {
                console.log('PosData not set.');
            }
        }
        i++;
    }

    if (picked == true) {
        gl.readPixels(clipX, clipY, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, colorPicked);
        if (colorPicked[0] == 255) {
            //curSel = null;
        } else {
            if(curSel != colorPicked[0]) { // exit edit interface on station change
                editStation = false;
            }
            curSel = colorPicked[0];
            setWebGLData();
        }
    }

    // reset picking values
    picked = false;
    x = null;
    y = null;
}

function animate() {
    var timeNow = new Date().getTime() /1000;
    if (lastTime != 0) {
        var elapsed = timeNow - lastTime;

        if(document.getElementById('rotation').checked) {
        	rot += (50 * elapsed);
        }
    }
    frameCounter++;
    if(frameCounter >= 60) {
        document.getElementById("fpsCounter").innerHTML = (1/elapsed).toFixed(2)+"fps";
        frameCounter = 0;
    }
    lastTime = timeNow;
}


function tick() {
    requestAnimationFrame(tick);
    drawScene();
    animate();
}

// Initializes WebGL visualization
// INPUTS:  none
// OUTPUTS: none
function webGLStart() {
	generateColorPlot(); // draw color spectrum

    drawHistory({time: [], avgTemp: []}); // draw historyCanvas

    listMissingData(); // list stations with missing data

    timeSel = null; // use newest data
    loadData(); // start database requests

    var canvas = document.getElementById("webGLCanvas");
    // initialize WebGL
    initGL(canvas);
    initShaders();
    initBuffers(); 
    initPicking();

    // add mouseevents
    AddEvent(window, 'wheel', onZoom);
	AddEvent(window, 'mousemove', onMouseMove);

    // add mouseoverWebGL events
	document.getElementById("webGLCanvas").onmouseover = function() {onMouseOverWebGL()};
	document.getElementById("webGLCanvas").onmouseout = function() {onMouseOutWebGL()};

    // add mouseposition
    canvas.addEventListener("mousedown", getPosition, false);

    // set background color of the canvas
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    tick();
}

// Setup for picking framebuffer.
// INPUTS:  none
// OUTPUTS: none
function initPicking() {
    //Creates texture
    colorTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, colorTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, frameWidth, frameHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

    //Creates framebuffer
    fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, colorTexture, 0);
    gl.bindTexture(gl.TEXTURE_2D, colorTexture);
    gl.enable(gl.DEPTH_TEST);

    // create renderbuffer
    depthBuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);

    // allocate renderbuffer
    gl.renderbufferStorage(
    gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, frameWidth, frameHeight);  

    // attach renderbuffer
    gl.framebufferRenderbuffer(
    gl.FRAMEBUFFER,
    gl.DEPTH_ATTACHMENT,
    gl.RENDERBUFFER,
    depthBuffer);

    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) != gl.FRAMEBUFFER_COMPLETE) {
        alert("Failed to initialize framebuffer.");
    return;
    }
}
