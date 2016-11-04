/*
    Smart Event Hall - 3D-Visualization
    HTL Hollabrunn 2016 - 29 09 2016
    V1.0
    Author: Benjamin Ableidinger
*/

var selDate = new Date();

var historyData3D = {
	data: [],
	pos: []
};

var historyChart;

var lineIndex = null;

var labels = []; // history chart labels

var data = []; // history chart data

var sliderDragActive = false; // true if history slider is being dragged

var sliderPos = 50; // postion of the slider on the datahistory canvas

var sliderCanvasActive = false; // true if mouse is currently over the silderCanvas div

var dataDB = [];

var posXOld = null, posYOld = null, posZOld = null; // save edit pos input for data refresh

var frameCounter = 0; // counts frames to only update the fps number every X frames

var elemCount = null; // counts amount of stations from database
var dataCurSel = null; // stores data selection: 0 = temp, 1 = hum

var editStation = false; // draw station edit interface if ==true
var posXField; // number input element for x coord in station edit interface
var posYField; // number input element for y coord in station edit interface
var posZField; // number input element for z coord in station edit interface

var picked = false; // true = mouse clicked on canvas -> render to picking framebuffer
var x = null; // mouse position(webgl space) x coord of the last mouseclick on the canvas
var y = null; // mouse position(webgl space) y coord of the last mouseclick on the canvas
var clipX = null; // mouse position(clipspace) x coord of the last mouseclick on the canvas
var clipY = null; // mouse position(clipspace) y coord of the last mouseclick on the canvas

var colorTexture; // texture containing colors used for picking
var fb; // framebuffer, which picking frames are rendered into
var depthBuffer; // renderbuffer used for picking -> correct objects are rendered in front
var frameWidth = 1000; // width of the webgl canvas
var frameHeight = 800; // height of the webgl canvas

var lastTime = 0; // time passed since first render of the scene

var sensInfo = [];
var sensData = []; // stores sensData
var colorPicked = new Uint8Array(4); // color (rgb) of the position clicked on (picking)
var curSel = null; // currently selected station; null = no station selected
var hallSelCur = null; // currently selected hall
var hallLength, hallWidth, hallHeight; // l, w, h of the currently selected hall
var stationSize = 0.2; // drawn cube size of stations

var zoomincrement = 0.5; // determines how for is zoomed with each mouseevent
var rotationangle = 0.2; // determines rotation speed
var curZoom = 0; // curent zoom level
var rotMatrix = mat4.create(); // rotation matrix for 
mat4.identity(rotMatrix); // stores rotation applied by mouse dragging

var webGLActive = false; // true, if mouse is currently above webgl canvas

var rot = 0; // stores current rotation: autorotation, buttons, not mousedrag

var vertexPositionBuffer; // buffer storing raw position data

var mvMatrix = mat4.create(); // model view matrix (camera position)
var mvMatrixStack = [];	// stack to temp.-save mvMatrix
var pMatrix = mat4.create(); // projection matrix 

var shaderProgram; // see graphics pipeline for webgl

var gl; // webgl context, if not set -> browser not supported
