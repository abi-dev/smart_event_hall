<html>


<head>
	<title>SEH - 3D</title>
	<meta http-equiv="content-type" content="text/html; charset=utf-8">

	<link rel="stylesheet" type="text/css" href="style.css">
	<script type="text/javascript" src="../js/gl-matrix.js"></script>
    <script type="text/javascript" src="../js/jquery-3.1.1.min.js"></script>
    <script type="text/javascript" src="../js/Chart.js"></script>
	<script type="text/javascript" src="../js/seh_webgl.js"></script>
	<script type="text/javascript" src="../js/seh_util.js"></script>
	<script type="text/javascript" src="../js/seh_event.js"></script>
	<script type="text/javascript" src="../js/seh_display_data.js"></script>
	<script type="text/javascript" src="../js/seh_global_vars.js"></script>
    <script type="text/javascript" src="../js/seh_dbcom.js"></script>
</head>

<script id="shader-fs" type="x-shader/x-fragment">
    precision mediump float;

    varying vec4 vColor;

    void main(void) {
        gl_FragColor = vColor;
    }
</script>

<script id="shader-vs" type="x-shader/x-vertex">
    attribute vec3 aVertexPosition;
    attribute vec4 aVertexColor;

    uniform mat4 uMVMatrix;
    uniform mat4 uPMatrix;

    varying vec4 vColor;

    void main(void) {
        gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
        vColor = aVertexColor;
    }
</script>	

<body onload="webGLStart();initSidebar();">
    <h1 id="datacont"></h1>
    <div id="content">
        <div id="surface">
        	<div id="surface3D"><canvas id="webGLCanvas" style="border: solid black 1px;" width="1000" height="800">test</canvas></div>
        	<div id="surfaceOverlay">
                <img src="logo/seh_small.jpg" alt="seh_logo" id="sehLogo" >
                <div id="fpsCounter"> </div>
            </div>
        </div>
        <div id="sidebar">
    	    <div id="webglinfo">
    	    	<div id="infocontent">
    		   		<input id="rotation" type="checkbox" name="rot">Autorotation<br>
                    Hall selection:
    		   		<select id="hallSel">
    					<option value="1">Hall 1</option>
    					<option value="2">Hall 2</option>
    				</select>
                    <br>
                    Data selection:
                    <select id="dataSel" onchange="dataSelChanged()">
                        <option value="0">Temperature</option>
                        <option value="1">Humidity</option>
                    </select>
                    </br></br>
    		   		<div id="zoomText"><b>Zoom: </b></br>
    		   		<input type="range" class="slider" id="zoomnumber" value="0" step="2" name="zoom" min="-10" max="10"></div>
                    </br><b>Rotation: </b></br>
                    <input type="range" class="slider" id="rotnumber" value="0" step="10" name="zoom" min="0" max="360">
                    </br></br>Mode:
                    <select id="modeSel" onchange="modeSelChanged()">
                        <option value="0">Current</option>
                        <option value="1">History</option>
                    </select>
                    </br></br>
                    <div class="popup">
                      <button type="button" id="historySettingsButton" onclick="historySettingsButtonClicked()">Settings</button>
                      <span class="popuptext" id="myPopup">
                            <select id="timeScaleSel" onchange="historyDataChanged()">
                                <option value="0">Years</option>
                                <option value="1">Months</option>
                                <option value="2">Weeks</option>
                                <option value="3">Days(20)</option>
                                <option value="4">Days(3)</option>
                                <option value="5">Hours</option>
                            </select>

                            <select id="dateTypeSel" onchange="historyDataChanged()">
                                <option value="0">mid</option>
                                <option value="1">start</option>
                                <option value="2">end</option>
                            </select>

                            </br> Date:
                            <input type="date" id="fromDate" onchange="historyDataChanged()">
                      </span>
                    </div>
    		   	</div>
    	   		<div id="infobottom">
    		   		<div id="resetbutton"><button onclick="resetView()">Reset View</button></div>
    		   		<canvas id="colorPlot" style="border: solid black 1px;" width="200" height="70"></canvas>
    		   	</div>
    	    </div>
    	    <div id="webgldata">
    	    </div>
        </div>
        <div id="sliderCanvasContainer">
            <!--<div id="sliderCanvasOverlay">
                <input type="range" id="timeSlider" value="0" step="1" min="0" max="100">
            </div>-->
            <!--<div id="sliderCanvasContent">-->
                <canvas id="historyDataCanvas" width="1000" height="150"></canvas>
                <!--<canvas id="historySliderCanvas" width="1000" height="150"></canvas>-->
            <!--</div>-->
        </div>
    </div>
</body>

</html>
