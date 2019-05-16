Array.prototype.mbmove = function(from_index, to_index) {
	var x = this[from_index];

	this.splice(from_index, 1);
    this.splice(to_index,0,x);

    return this;
}

p5.disableFriendlyErrors = true;
let database, socket;
let consoleClass, toolClass, colorClass, framesClass, dbTalkClass, playClass, tracerClass;
let canvas, cnvWidth, cnvHeight , expWidthF , expHeightF , expTopF , expLeftF, expWidthSq, expHeightSq, expTopSq, expLeftSq, expWidthSc, expHeightSc, expTopSc, expLeftSc;
let graphicBG, graphicFixed, graphicKeyPoses, graphicGuides, graphicOnion, graphicBrush, graphicRough, graphicFRONT, graphicDUO;
let startDiv;
let setBG = 'rgb(255, 255, 248)';
let darkmode = false;

let touchX, touchY;
let statePreOnion = statePostOnion = stateLoopOnion  = true;
let stateOnionPencil = stateOnionBrush = stateOnionRough = true;
let waitDB = false;
let currentEnsemble = null;
let currentDB = 'drawings/';
let newdbKeys = [];
let insertedKey;
let storeSketches = [];
let storeProjects = [[]];
let maxProjects = 3;
let storeEnsembles = [];

let ableDelete = ableInsert = ableUpdate = ableDuplicate = false;
let btnScopeOver = btnSquareOver = btnFullOver = false;

let nbdrawingloaded, nbdrawingupdated;
let nbpaintingloaded, nbpaintingupdated;
let nbroughsloaded, nbroughsupdated;
let showRoughs = showDrawingLayer = showBrushLayer = true;

let px, py, ppx, ppy, sx, sy;
let erasing = false;
let eraserUsed = false;
let safetyEraser = true;
let brushing = roughing = makingLine = false;
let penciling = true;
let lineTracing = [];
let showGuidelines = true;

let typeOfTool;
let yourID;
let pressure, lastPressure, lastStroke, getStrokeValue, strkVal, tempPressure;

let onionDisplayed = false;
let framesCount;
let drawing = roughs = painting = [];
let duoDrawings = [];
let predrawing = preroughs = prepainting = [];
let postdrawing = postroughs = postpainting = [];
let comparedrawing = compareroughs = comparepainting = [];
let guidePath = guidelines =[];
let currentPath = currentForeign = [];
let lastPath = [];
let fixedParts = [];
let storeKeyPoses = [];
let keyPoses = [];
let showSafetyLines = true;
let colorChoice, sliderR, sliderV, sliderB, sliderStroke;
let csR = csB = csV = setR = setV = setB = 0;
let paletteHandle = palette = [];

let ableToDraw = true;
let ableToSend = true;
let isDrawing = false;

let storeKeys = [];
let previousKeyfromInsert = null;
let timelinePos = 0, onionPos, postOnionPos;
let posKey, onionKey, postonionkey, keyToUpdate, previouskey, nextkey;
let tm;
let playing = false;
let loopTm = true;
let nframe;
let onVirginFrame = true;

let optionPressed = ctrlPressed = ctrlGkeyPressed = ctrlFkeyPressed = false;
let deleteAble = false;

let recorder;
let isRecording = false;
let fps = 12;

let maxDraw = 49;
let countFrames;
let maxIsReached = false;
let frameAfter = dataToKeep = drawingsToKeep = paintingsToKeep = roughsToKeep = [];
let bg;

function preload() {

  // bg = loadImage('./paris-color-3.jpg');

  //console.log("WELCOME ON MOBLITZ!");
  let wlcm = createP('Welcome On MoBlitz Solo Version!<br><br>' +
    'This is your console, where you\'ll get feedback from everything you do. <br> If you need help, Scroll down to see the ShortCuts documentation.<br><br>' +
    'Now you can click on the big green button to begin your awesome animation!' +
    '');
  wlcm.parent('console');

  //console.log("This is an alpha version. Please be gentle.");
  //console.log("This sketch will only fire essential logs in the console. For a more verbose one, please replace your sketch with the 'sketchVerbose' one.");

  // socket = io.connect('https://magmanin.nanomenta.com/');
  // socket = io.connect('http://localhost:4000');
	socket = io.connect('https://mb-duo.herokuapp.com/');
  // Initialize Firebase
  socket.on('getdb', (config) => {
    firebase.initializeApp(config);
    database = firebase.database();
    // let ref = database.ref(currentDB);
    // ref.on('value', gotData, errData);
    var params = getURLParams();
    console.log(params);
    if (params.id) {
      dbTalkClass.loadParamDB(params.id);
			socket.emit('join custom', params.id);
    } else {
      dbTalkClass.createNewEnsemble();
      dbTalkClass.createNewDB();
    }
  });
} //END PRELOAD

function connectDB() {
  socket.emit('connectDB');
  let rmbtn = document.getElementById('connectFirst');
  rmbtn.remove();
  consoleClass.newMessage('You started a new Session! Enjoy! Bim!', 'console');
  $("#startSession").addClass("hide");
  selectPencilTool();
}

function setup() {

	socket.on('startFromDuo', function(){
		currentForeign = [];
		duoDrawings.push(currentForeign);
		currentForeign.splice(0, 1);
		redraw();
	});

	socket.on('pushPointFromDuo', function(points){
		//console.log(data);
		currentForeign.push(points);
		redraw();
	});

	socket.on('cleanDuo', function(){
		duoDrawings = [];
		redraw();
	});

  consoleClass = new ConsoleMessage();
  toolClass = new Tools();
  colorClass = new Colors();
  framesClass = new Frames();
  dbTalkClass = new DBTalk();
  playClass = new Play();
  tracerClass = new Tracer();

  if (device.mobile() == true) {
    cnvWidth = 405;
  } else if (device.tablet() == true) {
    cnvWidth = 800;
  } else {
    cnvWidth = 1000;
  }

  cnvHeight = cnvWidth * 0.5625;

  // Note: pour jouer avec des background
  //   let getHeight = Math.round(bg.height /5);
  //   let getWidth = Math.round(bg.width /5);
  //
  // console.log(getHeight + ' / ' + getWidth);
  //   cnvWidth = getWidth;
  //   cnvHeight = getHeight;

  expWidthF = cnvWidth - 40;
  expHeightF = cnvHeight - 40;
  expTopF = 20;
  expLeftF = 20;

  expWidthSq = cnvHeight - 40;
  expHeightSq = cnvHeight - 40;
  expTopSq = 20;
  expLeftSq = 20 + ((cnvWidth - cnvHeight) / 2);

  expWidthSc = cnvWidth - 40;
  expHeightSc = (cnvHeight / 6) * 4;
  expTopSc = (cnvHeight / 6);
  expLeftSc = 20;
  //console.log('device.tablet() === %s', device.tablet())
  $('#defaultCanvas0').pressure({

    change: function(force, event) {
      // this is called every time there is a change in pressure
      // 'force' is a value ranging from 0 to 1
      pressure = force;
    },
    unsupported: function() {
      // NOTE: this is only called if the polyfill option is disabled!
      // this is called once there is a touch on the element and the device or browser does not support Force or 3D touch
      pressure = 1;
    }
  }, {
    polyfill: false
  });

  loadingDiv = createDiv('');
  loadingDiv.id('loadingDiv');
  loadingDiv.parent('canvascontainer')
  loadingDiv.style('width', cnvWidth + 'px');
  loadingDiv.style('height', cnvHeight + 40 + 'px');

  let loadingContent = createDiv('We\'re loading your projects');
  loadingContent.id('loadingContent');
  loadingContent.parent('loadingDiv');

  startDiv = createDiv('');
  startDiv.id('startSession');
  startDiv.parent('canvascontainer')
  startDiv.style('width', cnvWidth + 'px');
  startDiv.style('height', cnvHeight + 40 + 'px');

  let startContent = createDiv('');
  startContent.id('startContent');
  startContent.parent('startSession');

  let tlsubstitute = createDiv('');
  tlsubstitute.id('substitute');
  tlsubstitute.parent('drawinglist');

  canvas = createCanvas(cnvWidth, cnvHeight);
  canvas.parent('canvascontainer');
  pixelDensity(1);
  frameRate(24);
  noLoop();
  graphicBG = createGraphics(cnvWidth, cnvHeight);
  graphicBG.background(setBG);
  graphicFixed = createGraphics(cnvWidth, cnvHeight);
  graphicKeyPoses = createGraphics(cnvWidth, cnvHeight);
  graphicGuides = createGraphics(cnvWidth, cnvHeight);
  graphicOnion = createGraphics(cnvWidth, cnvHeight);
  graphicBrush = createGraphics(cnvWidth, cnvHeight);
  graphicRough = createGraphics(cnvWidth, cnvHeight);
  graphicFRONT = createGraphics(cnvWidth, cnvHeight);
	graphicDUO = createGraphics(cnvWidth, cnvHeight);

  let formatTopWindow = document.getElementById('topwindow');
  formatTopWindow.style.width = "cnvWidth";
  let formatDrawingList = document.getElementById('drawinglist');
  formatDrawingList.style.width = "cnvWidth";
  //Note: Initialize recorder for Gif export

  socket.on('yourID', (data) => {
    yourID = data;
    //socket.emit('newPeople');
    //console.log("Your ID is " + yourID);
  });

  socket.on('hello', () => {
    var params = getURLParams();
    // console.log(params);
    if (params.id) {
      let startButton = createButton('<i class="fas fa-power-off" style="font-size: 60px;"></i><br><br>Connect to Session<br>' + params.id);
      startButton.id('startButton');
      startButton.parent('startContent');
      startButton.touchStarted(connectDB);
    } else {
      let startButton = createButton('<i class="fas fa-power-off" style="font-size: 60px;"></i><br><br>Start Session');
      startButton.id('startButton');
      startButton.parent('startContent');
      startButton.touchStarted(connectDB);
    }
    let elts = selectAll('.feedback');
    for (let i = 0; i < elts.length; i++) {
      elts[i].remove();
    }
    consoleClass.newMessage('All system ready to rock!', 'console', 'connectFirst');
  });

  $('#defaultCanvas0').bind('contextmenu', function(e) {
    return false;
  });

  canvas.touchStarted(startPath);

  canvas.touchEnded(function() {

    if (currentPath.length === 0) {
      //console.log("OUPS | SLOW DOWN JOLLY JUMPER!");
      ableToDraw = false;
      let point = {
        type: typeOfTool,
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
        x3: 0,
        y3: 0,
        x4: 0,
        y4: 0,
        csR: csR,
        csV: csV,
        csB: csB,
        pressure: pressure,
        strk: sliderStroke.value()
      }

      currentPath.push(point);
      endPath();

      ableToDraw = true;
    } else if (currentPath.length === 1) {
      //console.log("OUPS | SLOW DOWN JOLLY JUMPER!");
      ableToDraw = false;
      let safetyPoint = currentPath[0];
      currentPath.push(safetyPoint);
      endPath();
      if (brushing) {
        painting.pop();
      } else if (roughing) {
        roughs.pop();
      } else {
        drawing.pop();
      }
      ableToDraw = true;
    } else {
      ableToDraw = false;
      endPath();
      ableToDraw = true;
    }
    redraw();
  });

  //Colors RGB/RVB i used V for G because french
  colorChoice = createElement('div');
  colorChoice.style('width', '100px');
  colorChoice.style('height', '18px');
  colorChoice.style('margin-right', '10px');
  colorChoice.style('display', 'inline-block');
  colorChoice.style('border-radius', '20px');

  sliderR = createSlider(0, 255, 0);
  sliderV = createSlider(0, 255, 0);
  sliderB = createSlider(0, 255, 0);

  sliderR.style('width', '100px');
  sliderV.style('width', '100px');
  sliderB.style('width', '100px');
  colorChoice.parent('currentColor');
  sliderR.parent('colorCtrls');
  sliderV.parent('colorCtrls');
  sliderB.parent('colorCtrls');

  sliderR.mousePressed(function() {
    setR = null;
    setV = null;
    setB = null;
    redraw();
  });

  sliderR.mouseReleased(function() {
    redraw();
  });

  sliderV.mousePressed(function() {
    setR = null;
    setV = null;
    setB = null;
    redraw();
  });

  sliderV.mouseReleased(function() {
    redraw();
  });

  sliderB.mousePressed(function() {
    setR = null;
    setV = null;
    setB = null;
    redraw();
  });

  sliderB.mouseReleased(function() {
    redraw();
  });
  colorClass.setFirstColors();

  // END COLORS MODULE

  let preonionBtn = createDiv('<i class="fas fa-circle"></i>');
  preonionBtn.parent('onionControls');
  preonionBtn.id('preonionBtn');
  preonionBtn.addClass('onion-is-on');
  preonionBtn.touchStarted(function() {
    statePreOnion = !statePreOnion;
    redraw();
  });
  let postonionBtn = createDiv('<i class="fas fa-circle"></i>');
  postonionBtn.parent('onionControls');
  postonionBtn.id('postonionBtn');
  postonionBtn.addClass('onion-is-on');
  postonionBtn.touchStarted(function() {
    statePostOnion = !statePostOnion;
    redraw();
  });
  let looponionBtn = createDiv('<i class="fas fa-circle"></i>');
  looponionBtn.parent('onionControls');
  looponionBtn.id('looponionBtn');
  looponionBtn.addClass('onion-is-on');
  looponionBtn.touchStarted(function() {
    stateLoopOnion = !stateLoopOnion;
    redraw();
  });



  // let saveButton = select('#saveButton');
  // saveButton.touchStarted(saveDrawing);
  let clearButton = select('#clearButton');
  clearButton.touchStarted(framesClass.clearDrawing);

  $(".changeBtn").addClass("disableAllBtn");

  let divStrokeValue = createDiv('');
  divStrokeValue.id('strokeValue');
  divStrokeValue.parent('blankspace');

  let toolsContainer = createDiv('');
  toolsContainer.id('toolsContainer');
  toolsContainer.parent('leftToolHandler');

  let layersMaster = createDiv('');
  layersMaster.id('layersMaster');
  layersMaster.parent('blankspace');

  let layersContainer = createDiv('');
  layersContainer.id('layersContainer');
  layersContainer.parent('layersMaster');

  let drawingIsON = createDiv('<i class="fas fa-eye" style="font-size: 12px;"></i> Pencil Layer is ON');
  drawingIsON.id('drawingIsON');
  drawingIsON.style('color', 'white');
  drawingIsON.parent('layersContainer');
  drawingIsON.touchStarted(toggleDrawings);

  let drawingIsOFF = createDiv('<i class="fas fa-eye-slash" style="font-size: 12px;"></i> Pencil Layer is OFF');
  drawingIsOFF.id('drawingIsOFF');
  drawingIsOFF.style('color', 'white');
  drawingIsOFF.parent('layersContainer');
  drawingIsOFF.touchStarted(toggleDrawings);

  let roughIsON = createDiv('<i class="fas fa-eye" style="font-size: 12px;"></i> Roughs Layer is ON');
  roughIsON.id('roughIsON');
  roughIsON.style('color', 'white');
  roughIsON.parent('layersContainer');
  roughIsON.touchStarted(toggleRoughs);

  let roughIsOFF = createDiv('<i class="fas fa-eye-slash" style="font-size: 12px;"></i> Roughs Layer is OFF');
  roughIsOFF.id('roughIsOFF');
  roughIsOFF.style('color', 'white');
  roughIsOFF.parent('layersContainer');
  roughIsOFF.touchStarted(toggleRoughs);

  let brushIsON = createDiv('<i class="fas fa-eye" style="font-size: 12px;"></i> Brush Layer is ON');
  brushIsON.id('brushIsON');
  brushIsON.style('color', 'white');
  brushIsON.parent('layersContainer');
  brushIsON.touchStarted(toggleBrush);

  let brushIsOFF = createDiv('<i class="fas fa-eye-slash" style="font-size: 12px;"></i> Brush Layer is OFF');
  brushIsOFF.id('brushIsOFF');
  brushIsOFF.style('color', 'white');
  brushIsOFF.parent('layersContainer');
  brushIsOFF.touchStarted(toggleBrush);

  let toggleOnionBntContainer = createDiv('');
  toggleOnionBntContainer.id('toggleOnionBntContainer');
  toggleOnionBntContainer.parent('layersMaster');

  let toggleOnionPencil = createDiv('<i class="fas fa-circle"></i>');
  toggleOnionPencil.parent('toggleOnionBntContainer');
  toggleOnionPencil.id('toggleOnionPencilBtn');
  toggleOnionPencil.addClass('onion-is-on');
  toggleOnionPencil.touchStarted(function() {
    stateOnionPencil = !stateOnionPencil;
    redraw();
  });

  let toggleOnionRough = createDiv('<i class="fas fa-circle"></i>');
  toggleOnionRough.parent('toggleOnionBntContainer');
  toggleOnionRough.id('toggleOnionRoughBtn');
  toggleOnionRough.addClass('onion-is-on');
  toggleOnionRough.touchStarted(function() {
    stateOnionRough = !stateOnionRough;
    redraw();
  });

  let toggleOnionBrush = createDiv('<i class="fas fa-circle"></i>');
  toggleOnionBrush.parent('toggleOnionBntContainer');
  toggleOnionBrush.id('toggleOnionBrushBtn');
  toggleOnionBrush.addClass('onion-is-on');
  toggleOnionBrush.touchStarted(function() {
    stateOnionBrush = !stateOnionBrush;
    redraw();
  });

  let addLayerContainer = createDiv('');
  addLayerContainer.parent('blankspace');
  addLayerContainer.id('addLayer');

  let msgSupport = createP('DO YOU NEED MORE LAYER? <br>SUPPORT DEVELOPMENT ON Facebook!');
  msgSupport.parent('addLayer');

  toolClass.createNewTool('fa-pen', 'Pencil', 'pencilBtn', selectPencilTool);
  toolClass.createNewTool('fa-paint-brush', 'Brush', 'brushBtn', selectBrushTool);
  toolClass.createNewTool('fa-pencil-alt', 'Rough', 'roughBtn', selectRoughTool);
  toolClass.createNewTool('fa-eraser', 'Eraser', 'eraserBtn', selectEraserTool);

  let separator = createDiv('   —   ');
  separator.parent(toolsContainer);
  separator.style('display', 'inline-block');
  separator.style('color', 'white');
  separator.style('text-align', 'center');
  separator.style('margin', '0 0 16px');

  toolClass.createNewTool('fa-pen', 'Line', 'lineBtn', selectLineTool);

  let addGuideBtn = createButton('<i class="fas fa-ruler" style="font-size: 20px;transform: rotate(-15deg);"></i><br>Guide');
  addGuideBtn.id('addGuideBtn');
  addGuideBtn.class('toolBtn');

  addGuideBtn.style('cursor', 'cell');


  addGuideBtn.parent('toolsContainer');
  addGuideBtn.touchStarted(function() {
    if (ctrlGkeyPressed == false) {
      saveGuide();
    } else if (ctrlGkeyPressed == true) {
      delGuide();
    }

  });

  let toggleBGBtn = createButton('<i class="fas fa-adjust" style="font-size: 20px;"></i><br>BG');
  toggleBGBtn.id('toggleBGBtn');
  toggleBGBtn.class('toolBtn');
  toggleBGBtn.parent('toolsContainer');
  toggleBGBtn.touchStarted(function() {
    if (darkmode == false) {
      setBG = 'rgb(37, 32, 39)';
      darkmode = !darkmode;
    } else {

      setBG = 'rgb(255, 255, 248)';
      darkmode = !darkmode;
    }
    redraw();
    // clear();
  });

  let snapshotBtn = createButton('<i class="fas fa-camera" style="font-size: 20px;"></i><br>Snap');
  snapshotBtn.id('snapshotBtn');
  snapshotBtn.class('toolBtn');
  snapshotBtn.parent('toolsContainer');
  snapshotBtn.touchStarted(function() {
    showSafetyLines = false;
    redraw();
    setTimeout(function() {
      save('snapshop-moblitz.jpg');
      showSafetyLines = true;
      redraw();
    }, 500);

  });



  let nameStrokeValue = createDiv('Tool Size: ');
  nameStrokeValue.parent('strokeValue');

  sliderStroke = createSlider(1, 50, 1);
  sliderStroke.parent('strokeValue');

  getStrokeValue = createDiv('');
  getStrokeValue.style('color', 'white');
  getStrokeValue.parent('strokeValue');

  sliderStroke.touchEnded(function() {
    strkVal = sliderStroke.value();
    getStrokeValue.html(strkVal);
    redraw();
  });


  // selectPencilTool();



  let fpsplus = select('#fpsp');
  fpsplus.touchStarted(function() {
    fps += 1;
    // recorder.settings.framerate = fps;
    redraw();
  });
  let fpsminus = select('#fpsm');
  fpsminus.touchStarted(function() {
    fps -= 1;
    // recorder.settings.framerate = fps;
    redraw();
  });

  let displayLoop = select('#displayLoop');
  displayLoop.touchStarted(toggleLoop);
  displayLoop.style('cursor', 'pointer');

} // END SETUP

function selectEraserTool() {
  erasing = !erasing;

  if (erasing) {
    //console.log("Eraser selected: " + erasing );
    $("#eraserBtn").addClass("selectedEraser");
  } else {
    //console.log("Eraser selected: " + erasing );
    $("#eraserBtn").removeClass("selectedEraser");
  }

  // $( "#pencilBtn" ).removeClass( "selectedTool" );
  // $( "#brushBtn" ).removeClass( "selectedTool" );
  redraw();
};

function selectPencilTool() {
  toolClass.selectPencilTool();
  consoleClass.newMessage('You are drawing on the front layer.', 'console', 0, 'feedback');
  redraw();
};

function selectBrushTool() {
  toolClass.selectBrushTool();
  consoleClass.newMessage('You are painting on the brush layer.', 'console', 0, 'feedback');
  redraw();
};

function selectRoughTool() {
  toolClass.selectRoughTool();
  consoleClass.newMessage('You are roughing on the rough layer.', 'console', 0, 'feedback');
  redraw();
};

function selectLineTool() {
  toolClass.selectLineTool();
  redraw();
};

//Note: Function to update scroll in console and chat
function updateScroll() {
  let element = document.getElementById("console");
  element.scrollTop = element.scrollHeight;
}
//Note: Function to update scroll in palette
function updatePLScroll() {
  let element = document.getElementById("yourPalette");
  element.scrollTop = element.scrollHeight;
}
//Note: Function to update Timline's scroll
function updateTLScroll() {
  let element = document.getElementById("drawinglist");
  element.scrollLeft = element.scrollWidth;
}

function touchStarted() {
  px = mouseX;
  py = mouseY;
  sx = mouseX;
  sy = mouseY;
  ppx = mouseX;
  ppy = mouseY;
}

//Main Drawing On Canvas Part
function startPath() {
  if (timelinePos == 0) {
    framesClass.clearDrawing();
  }

  px = mouseX;
  py = mouseY;
  sx = mouseX;
  sy = mouseY;
  ppx = mouseX;
  ppy = mouseY;

  if (ableToDraw) {
    //console.log("——");
    //console.log("You started a new path!");
    isDrawing = true;
    if (!erasing) {

      currentPath = [];
      if (brushing) {
        if (showBrushLayer == true) {
          painting.push(currentPath);
          currentPath.splice(0, 1);
        } else {
          return;
        }

      } else if (roughing) {
        if (showRoughs == true) {
          roughs.push(currentPath);
          currentPath.splice(0, 1);
        } else {
          return;
        }

      } else if (makingLine) {

        let firstPoint = {
          x: mouseX,
          y: mouseY
        }
        lineTracing = [];
        lineTracing.push(firstPoint);
        redraw();
      } else {

        if (showDrawingLayer == true) {
          drawing.push(currentPath);
					socket.broadcast.emit('startToDuo');
          currentPath.splice(0, 1);
        } else {
          return;
        }
      }
      nbdrawingupdated += 1;
    }
    //console.log("A new array of points is pushed in 'drawing'");
    //console.log(currentPath);
  }
}

function endPath() {
  if (makingLine) {
    let newLine = {
      x1: lineTracing[0].x,
      y1: lineTracing[0].y,
      x2: mouseX,
      y2: mouseY
    }
    guidelines.push(newLine);
  }
  isDrawing = false;


  //console.log("You released the pen, and ended this path!");
  //console.log("There is " + drawing.length + " paths in 'drawing' now.");
  //console.log("Let see the content of the drawing array:");
  //console.log(drawing);
  //console.log("You're not drawing right now");
	//socket.emit('sendToDuo', drawing);
  redraw();
}

function draw() {

  if (stateLoopOnion == true) {
    $("#looponionBtn").removeClass("hideOnion");
  } else {
    $("#looponionBtn").addClass("hideOnion");
  };

  if (statePostOnion == true) {
    $("#postonionBtn").removeClass("hideOnion");
  } else {
    $("#postonionBtn").addClass("hideOnion");
  };


  if (statePreOnion == true) {
    $("#preonionBtn").removeClass("hideOnion");
  } else {
    $("#preonionBtn").addClass("hideOnion");
  };

  if (stateOnionPencil == true) {
    $("#toggleOnionPencilBtn").addClass("hideOnion");
  } else {
    $("#toggleOnionPencilBtn").removeClass("hideOnion");
  };

  if (stateOnionRough == true) {
    $("#toggleOnionRoughBtn").addClass("hideOnion");
  } else {
    $("#toggleOnionRoughBtn").removeClass("hideOnion");
  };

  if (stateOnionBrush == true) {
    $("#toggleOnionBrushBtn").addClass("hideOnion");
  } else {
    $("#toggleOnionBrushBtn").removeClass("hideOnion");
  };

  let displayFPS = select('#displayFPS');
  displayFPS.html(fps + ' fps');

  let displayLoop = select('#displayLoop');
  if (loopTm == true) {
    displayLoop.html('loop');
  } else {
    displayLoop.html('noLoop');
  }

  touchX = mouseX;
  touchY = mouseY;
  if (storeKeys[0] !== undefined) {
    if (storeKeys[0].length == 1) {
      framesCount = 0;
      select('#frames').html((framesCount) + '<span style=\"color: #a7a7a7;\"> / ' + (storeKeys[0].length - 1) + '</span>');
    } else if (onVirginFrame == true) {
      framesCount = '*';
      select('#frames').html((framesCount) + '<span style=\"color: #a7a7a7;\"> / ' + (storeKeys[0].length - 1) + '</span>');
    } else if (storeKeys[0].length != 1 && onVirginFrame == false) {
      framesCount = timelinePos;

      select('#frames').html((framesCount) + '<span style=\"color: #a7a7a7;\"> / ' + (storeKeys[0].length - 1) + '</span>');
    }
  }

  if (showRoughs == true) {
    $("#roughIsOFF").addClass("hide");
    $("#roughIsON").removeClass("hide");
  } else {
    $("#roughIsOFF").removeClass("hide");
    $("#roughIsON").addClass("hide");
  }

  if (showDrawingLayer == true) {
    $("#drawingIsOFF").addClass("hide");
    $("#drawingIsON").removeClass("hide");
  } else {
    $("#drawingIsOFF").removeClass("hide");
    $("#drawingIsON").addClass("hide");
  }

  if (showBrushLayer == true) {
    $("#brushIsOFF").addClass("hide");
    $("#brushIsON").removeClass("hide");
  } else {
    $("#brushIsOFF").removeClass("hide");
    $("#brushIsON").addClass("hide");
  }

  if (ctrlGkeyPressed == true) {
    $("#addGuideBtn").addClass("cursorDelGuide");
  } else if (ctrlGkeyPressed == false) {
    $("#addGuideBtn").removeClass("cursorDelGuide");

  }

  if (brushing == true) {
    if (darkmode == true) {
      $("#defaultCanvas0").addClass("cursorBrushDM");
      $("#defaultCanvas0").removeClass("cursorBrush");
    } else {
      $("#defaultCanvas0").addClass("cursorBrush");
      $("#defaultCanvas0").removeClass("cursorBrushDM");
    }

  } else if (roughing == true || (roughing == true && brushing == false)) {
    if (darkmode == true) {
      $("#defaultCanvas0").addClass("cursorRoughDM");
      $("#defaultCanvas0").removeClass("cursorBrushDM");
    } else {
      $("#defaultCanvas0").addClass("cursorRough");
      $("#defaultCanvas0").removeClass("cursorBrush");
      $("#defaultCanvas0").removeClass("cursorBrushDM");
    }

  } else {
    if (darkmode == true) {
      $("#defaultCanvas0").addClass("cursorPencilDM");
      $("#defaultCanvas0").removeClass("cursorBrushDM");
      $("#defaultCanvas0").removeClass("cursorRoughDM");
      $("#defaultCanvas0").removeClass("cursorBrush");
      $("#defaultCanvas0").removeClass("cursorRough");
    } else {
      $("#defaultCanvas0").addClass("cursorPencil");
      $("#defaultCanvas0").removeClass("cursorBrush");
      $("#defaultCanvas0").removeClass("cursorRough");
      $("#defaultCanvas0").removeClass("cursorBrushDM");
      $("#defaultCanvas0").removeClass("cursorRoughDM");
      $("#defaultCanvas0").removeClass("cursorPencilDM");
    }
  }

  if (erasing == false || (erasing == false && brushing == false && roughing == false)) {
    if (darkmode == true) {
      $("#defaultCanvas0").removeClass("cursorEraserDM");
      $("#defaultCanvas0").removeClass("cursorEraser");
    } else {
      $("#defaultCanvas0").removeClass("cursorEraser");
      $("#defaultCanvas0").removeClass("cursorEraserDM");
    }
  }
  if (erasing == true) {
    if (darkmode == true) {
      $("#defaultCanvas0").addClass("cursorEraserDM");
      $("#defaultCanvas0").removeClass("cursorEraser");
    } else {
      $("#defaultCanvas0").addClass("cursorEraser");
      $("#defaultCanvas0").removeClass("cursorEraserDM");
    }
  }

  graphicBG.background(setBG);

  graphicBrush.clear();
  graphicRough.clear();
  graphicFRONT.clear();
  graphicGuides.clear();
	graphicDUO.clear();

  if (isDrawing == false) {
    graphicKeyPoses.clear();
    graphicFixed.clear();

    graphicOnion.clear();
  }

  if (showSafetyLines == true) {
    graphicBG.strokeWeight(0.5);
    //safetyborder square
    if (darkmode == true) {
      graphicBG.stroke(50);
    } else {
      graphicBG.stroke(230);
    }

    if (btnSquareOver) {
      graphicBG.stroke(0, 0, 255);
    }
    graphicBG.line(20 + ((cnvWidth - cnvHeight) / 2), 20, 20 + ((cnvWidth - cnvHeight) / 2), cnvHeight - 20); // gauche vertical
    graphicBG.line(canvas.width - 20 - ((cnvWidth - cnvHeight) / 2), 20, canvas.width - 20 - ((cnvWidth - cnvHeight) / 2), cnvHeight - 20); // droite vertical

    //safetyborder scope
    if (darkmode == true) {
      graphicBG.stroke(50);
    } else {
      graphicBG.stroke(230);
    }
    if (btnScopeOver) {
      graphicBG.stroke(0, 0, 255);
    }
    graphicBG.line(20, (cnvHeight - expHeightSc) / 2, cnvWidth - 20, (cnvHeight - expHeightSc) / 2); // haut horizontal
    graphicBG.line(20, cnvHeight - expTopSc, cnvWidth - 20, cnvHeight - expTopSc); //bas horizontal
    if (darkmode == true) {
      graphicBG.stroke(70);
    } else {
      graphicBG.stroke(180);
    }
    //cross line(x1,y1,x2,y2)
    graphicBG.line(cnvWidth / 2, 20, cnvWidth / 2, cnvHeight - 20);
    graphicBG.line(20, cnvHeight / 2, cnvWidth - 20, cnvHeight / 2);
    //safetyborder full
    if (darkmode == true) {
      graphicBG.stroke(50);
    } else {
      graphicBG.stroke(150);
    }
    if (btnFullOver) {
      graphicBG.stroke(0, 0, 255);
    }
    graphicBG.line(20, 20, canvas.width - 20, 20);
    graphicBG.line(20, canvas.height - 20, canvas.width - 20, canvas.height - 20);
    graphicBG.line(20, 20, 20, canvas.height - 20);
    graphicBG.line(canvas.width - 20, 20, canvas.width - 20, canvas.height - 20);
  }

  //save controls behavior
  if (maxIsReached == false) {
    $(".frameReady").removeClass("hideImportant");
    $(".saveButton").removeClass("hideImportant");
  } else {
    $(".frameReady").addClass("hideImportant");
    $(".saveButton").addClass("hideImportant");
  }

  if (frameAfter.length == 0) {
    $("#insertButton").addClass("disableBtn");
    ableInsert = false;
  } else {
    $("#insertButton").removeClass("disableBtn");
    ableInsert = true;
  }

  if (timelinePos == 0 || timelinePos == undefined){
    $("#duplicateButton").addClass("disableBtn");
    ableDuplicate = false;
  } else {
    $("#duplicateButton").removeClass("disableBtn");
    ableDuplicate = true;
  }

  if ((nbdrawingloaded != nbdrawingupdated || nbpaintingloaded != nbpaintingupdated || nbroughsloaded != nbroughsupdated) && (nbdrawingloaded == undefined || nbpaintingloaded == undefined || nbroughsloaded == undefined)) {
    $("#updateButton").removeClass("disableBtn");
    ableUpdate = true;
  } else if ((nbdrawingloaded != nbdrawingupdated || nbpaintingloaded != nbpaintingupdated || nbroughsloaded != nbroughsupdated) && (nbdrawingloaded != undefined || nbpaintingloaded != undefined || nbroughsloaded != undefined)) {
    $("#saveButton").addClass("secondarySave");
    $("#updateButton").removeClass("disableBtn");
    ableUpdate = true;
  } else {
    $("#saveButton").removeClass("secondarySave");
    $("#updateButton").addClass("disableBtn");
    ableUpdate = false;
  }

  if (eraserUsed == true) {
    $("#saveButton").addClass("secondarySave");
    $("#updateButton").removeClass("disableBtn");
  }

  if (onVirginFrame) {
    $("#saveButton").removeClass("secondarySave");
    nbdrawingloaded = null;
    nbdrawingupdated = null;
    ableInsert = false;
    ableDuplicate = false;
  }


  if (keyIsDown(OPTION)) {
    optionPressed = true;
    //console.log("You are holding the 'Option' key.");
  }

  if (keyIsDown(CONTROL)) {
    ctrlPressed = true;
    //console.log("You are holding the 'Option' key.");
  }

  if (keyIsDown(69)) {
    deleteAble = true;
    //console.log("You are holding the 'E' key.");
  }

  if (setR === null) {
    csR = sliderR.value();
  } else {
    csR = setR;
  }
  if (setV === null) {
    csV = sliderV.value();
  } else {
    csV = setV;
  }
  if (setB === null) {
    csB = sliderB.value();
  } else {
    csB = setB;
  }

  colorChoice.style('background', 'rgb(' + csR + ',' + csV + ',' + csB + ')');

  if (isDrawing) {

    if (!erasing) {
      if (makingLine) {
        graphicGuides.stroke(189, 225, 255);
        graphicGuides.strokeWeight(1);
        graphicGuides.line(lineTracing[0].x, lineTracing[0].y, mouseX, mouseY);
      } else {
        let point = {
          type: typeOfTool,
          x1: sx,
          y1: sy,
          x2: ppx,
          y2: ppy,
          x3: px,
          y3: py,
          x4: mouseX,
          y4: mouseY,
          csR: csR,
          csV: csV,
          csB: csB,
          pressure: pressure,
          strk: sliderStroke.value()
        }
        currentPath.push(point);
				socket.emit('sendPoint', point);
        sx = ppx;
        sy = ppy;
        ppx = px;
        ppy = py;
        px = mouseX;
        py = mouseY;
      }
    } else {
      //erase
      sx = ppx;
      sy = ppy;
      ppx = px;
      ppy = py;
      px = mouseX;
      py = mouseY;

      if (brushing) {
        tracerClass.eraserPainting();
      } else if (roughing) {
        tracerClass.eraserRoughs();
      } else {
        tracerClass.eraserDrawings();
      }
    }
    //console.log("Pushing points in the 'currentPath' array.");
    // let name = document.getElementById('animatorName').value;
    // if (name === ""){name = yourID;}
    let name = yourID;
    let posX = mouseX;
    let posY = mouseY;
  }

  if (isRecording == false) {
    tracerClass.traceGuidelines();
  }
  if (isDrawing == false) {
    tracerClass.traceFixedParts();
  }

  if (isDrawing == false) {
    tracerClass.traceKeyPoses();
    if (showBrushLayer) {
      if (stateOnionBrush == true) {
        if (statePreOnion == true) {
          tracerClass.tracePrePainting();
        }
      }
    }
    if (showRoughs == true) {
      if (stateOnionRough == true) {
        if (statePreOnion == true) {
          tracerClass.tracePreRoughs();
        }
      }
      if (statePostOnion == true) {
        if (stateOnionRough == true) {
          tracerClass.tracePostRoughs();
        }
      }
    }
    if (showDrawingLayer == true) {
      if (statePreOnion == true) {
        if (stateOnionPencil == true) {
          tracerClass.tracePreOnion();
        }
      }
      if (statePostOnion == true) {
        if (stateOnionPencil == true) {
          tracerClass.tracePostOnion();
        }
      }
    }
  }

  if (showBrushLayer) {
    tracerClass.tracePainting();
  }

  if (showRoughs == true) {
    tracerClass.traceRoughs();
  }

	tracerClass.traceDUO();



  if (showDrawingLayer == true) {

    graphicFRONT.clear();
    tracerClass.traceDrawings();
  }

  noFill();
  stroke(120);
  strokeWeight(1);
  if(isDrawing){
    graphicFRONT.ellipse(mouseX,mouseY,sliderStroke.value());
  }
  image(graphicBG, 0, 0);
  image(graphicFixed, 0, 0);
  image(graphicKeyPoses, 0, 0);
  image(graphicGuides, 0, 0);
  image(graphicOnion, 0, 0);
  image(graphicBrush, 0, 0);
  image(graphicRough, 0, 0);
  image(graphicFRONT, 0, 0);
	image(graphicDUO, 0, 0);

}
// Closing the DRAW function

// ———————————————————————————
//How we handle drawings Part

function mouseDragged() {
  strkVal = sliderStroke.value();
  getStrokeValue.html(strkVal);
  // graphicFRONT.clear();
  redraw();
}

function undoLastPath() {
  if (brushing == true) {
    painting.pop();
  } else if (roughing == true) {
    roughs.pop();
  } else if (makingLine == true) {
    guidelines.pop();
  } else if (penciling == true) {
    drawing.pop();
  }
  //console.log("——");
  //console.log("You deleted the last path in 'drawing'.");
  //console.log("So, there is " + drawing.length + " paths in 'drawing' now.");
  redraw();
}

function toggleRoughs() {
  if (showRoughs == true) {
    showRoughs = false;
    $("#roughIsOFF").addClass("hide");
    $("#roughIsON").removeClass("hide");
  } else {
    showRoughs = true;
    $("#roughIsOFF").removeClass("hide");
    $("#roughIsON").addClass("hide");
  }
  redraw();
}

function toggleDrawings() {
  if (showDrawingLayer == true) {
    showDrawingLayer = false;
    $("#drawingIsOFF").addClass("hide");
    $("#drawingIsON").removeClass("hide");
  } else {
    showDrawingLayer = true;
    $("#drawingIsOFF").removeClass("hide");
    $("#drawingIsON").addClass("hide");
  }
  redraw();
}

function toggleBrush() {
  if (showBrushLayer == true) {
    showBrushLayer = false;
    $("#brushIsOFF").addClass("hide");
    $("#brushIsON").removeClass("hide");
  } else {
    showBrushLayer = true;
    $("#brushIsOFF").removeClass("hide");
    $("#brushIsON").addClass("hide");
  }
  redraw();
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    //console.log("——");
    //console.log("Move left | Go backward.");
    timelinePos -= 1;
    if (timelinePos < 1) {
      timelinePos = storeKeys[0].length - 1;
      onionPos = timelinePos - 1;
      if (stateLoopOnion == true) {
        postOnionPos = 1;
      }
    } else if (timelinePos == 1) {
      if (stateLoopOnion == true) {
        onionPos = storeKeys[0].length - 1;
      }
      postOnionPos = timelinePos + 1;
    } else {
      onionPos = timelinePos - 1;
      postOnionPos = timelinePos + 1;
    }
    posKey = storeKeys[0][timelinePos];

    document.getElementById('onionkey').value = storeKeys[0][onionPos];
    document.getElementById('postonionkey').value = storeKeys[0][postOnionPos];
    //console.log(timelinePos, (storeKeys[0].length) - 1, posKey, onionPos, postOnionPos);
    //console.log("TimelinePos: " + timelinePos);
    //console.log("StoreKey length - 1: " + (storeKeys[0].length - 1));
    //console.log("Key of this frame (posKey): " + posKey)
    //console.log("OnionPos: " + onionPos);
    //console.log("Post OnionPos: " + postOnionPos);
    //console.log("WE FIRE keyShowing()");
    playClass.keyShowing();
    framesClass.clearOnion();
    framesClass.showOnion();
  } else if (keyCode === RIGHT_ARROW) {
    //console.log("——");
    //console.log("Move right | Go forward.");
    timelinePos += 1;
    if (timelinePos > storeKeys[0].length - 1) {
      timelinePos = 1;
      if (stateLoopOnion == true) {
        onionPos = storeKeys[0].length - 1;
      }
      postOnionPos = timelinePos + 1;
    } else if (timelinePos == storeKeys[0].length - 1) {
      onionPos = timelinePos - 1;
      if (stateLoopOnion == true) {
        postOnionPos = 1;
      }
    } else {
      onionPos = timelinePos - 1;
      postOnionPos = timelinePos + 1;
    }
    posKey = storeKeys[0][timelinePos];
    document.getElementById('onionkey').value = storeKeys[0][onionPos];
    document.getElementById('postonionkey').value = storeKeys[0][postOnionPos];
    //console.log(timelinePos, (storeKeys[0].length) - 1, posKey, onionPos, postOnionPos);
    playClass.keyShowing();
    framesClass.clearOnion();
    framesClass.showOnion();
  } else if (keyCode === 32) {
    // preventDefault();
    playClass.togglePlay();
  } else if (keyCode === UP_ARROW) {
    if (sliderStroke.value() != 50) {
      sliderStroke.value(sliderStroke.value() + 1);
      strkVal = sliderStroke.value();
      getStrokeValue.html(strkVal);
      redraw();
    }
  } else if (keyCode === DOWN_ARROW) {
    if (sliderStroke.value() != 1) {
      sliderStroke.value(sliderStroke.value() - 1);
      strkVal = sliderStroke.value();
      getStrokeValue.html(strkVal);
      redraw();
    }
  }
}

window.onkeydown = function(event) {
  if (event.keyCode === 32) {
    event.preventDefault();
    // document.querySelector('a').click(); //This will trigger a click on the first <a> element.
  } else if (event.ctrlKey) {
    event.preventDefault();
    event.stopPropagation();
  }
};

document.onkeydown = function(e) {
  e = e || window.event; //Get event
  if ([38, 40].indexOf(e.keyCode) > -1) {
    e.preventDefault();
  }
  if (e.ctrlKey) {
    var c = e.which || e.keyCode; //Get key code
    switch (c) {
      case 70: //Block Ctrl + F
      case 71: //Block Ctrl + G
      case 69: //Block Ctrl + E
      case 72: // Ctrl + H
      case 83: //Block Ctrl+S
      case 87: //Block Ctrl+W --Not work in Chrome

        e.preventDefault();
        e.stopPropagation();
        break;
    }
  }
};

function keyReleased() {
  if (keyCode === OPTION) {
    optionPressed = false;
  }

  if (keyCode === CONTROL) {
    ctrlPressed = false;
  }
  if (keyCode === 70) {
    ctrlFkeyPressed = false;
  }
  if (keyCode === 71) {
    ctrlGkeyPressed = false;
    redraw();
  }
  if (keyCode === 69) {
    deleteAble = false;
  }
}

function showAnim(key) {
  if (key instanceof MouseEvent) {
    let key = this.id();

    if (optionPressed || ctrlFkeyPressed) {
      framesClass.showDrawing(key);
      keyToUpdate = key;
      //console.log(keyToUpdate);
    }
  }
  redraw();
}

function keySave() {
  document.addEventListener('keydown', (event) => {
    const keyName = event.key;
    if (keyName === 'Control') {
      // do not alert when only Control key is pressed.
      return;
    }
    if (keyName === 'g') {
      ctrlGkeyPressed = true;
      redraw();
    }
    if (keyName === 'u') {
      framesClass.updateFrame();
    }
    if (keyName === 'k') {
      makeThisFixed();
    }
    if (keyName === 'i') {
      framesClass.insertFrame();
    }
    if (keyName === 'p') {
      pinThisKey(keyToUpdate);
    }
    if (keyName === 'o') {
      if (onionDisplayed) {
        framesClass.clearOnion();
      } else {
        framesClass.showOnion();
      }
    }
    if (keyName === 'b') {
      selectBrushTool();
    }
    if (keyName === 'l') {
      selectLineTool();
    }
    if (keyName === 'e') {
      if (!ctrlPressed) {
        selectEraserTool();
      }
    }
    if (keyName === 'v') {
      selectPencilTool();
    }
    if (keyName === 'x') {
      framesClass.clearDrawing();
    }
    if (keyName === 'r') {
      selectRoughTool();
    }

    if (event.ctrlKey) {
      // Even though event.key is not 'Control' (i.e. 'a' is pressed),
      // event.ctrlKey may be true if Ctrl key is pressed at the time.
      if (keyName === 's') {
        framesClass.saveDrawing();
      }

      if (keyName === 'f') {
        ctrlFkeyPressed = true;
      }
      if (keyName === 'p') {
        // do not alert when only Control key is pressed.
        //saveCanvas(canvas, 'myCanvas', 'jpg');
        //console.log(storeKeys[0]);
      }
      if (keyName === 'z') {
        undoLastPath();
        socket.emit('undo');
      }
      if (keyName === 'd') {
        framesClass.duplicateFrame();
      }
      if (keyName === 'h') {
        triggerHelp();
      }
      if (keyName === 'e') {
        framesClass.deleteFrame();
      }
    }
  }, false);
}
keySave();

function triggerHelp() {
  consoleClass.newMessage('You asked for help ?', 'console', 0, 0, 'white');

  let msg2 = createP(
    "<b>ctrl+ H</b>: show help again <br>" +
    "<b>ctrl+ S</b>: save & next <br>" +
    "<b>ctrl+ Z</b>: undo last line <br>" +
    "<b>ctrl+ E</b>: delete frame <br>" +
    "<br><b>ctrl+ F + hover a frame</b>: fly over frames<br>" +
    "<br><b>G + hover guide button</b>: delete blue guidelines<br>" +
    "<br><b>left arrow </b>: show previous frame with onion<br>" +
    "<b>right arrow</b>: show next frame with onion<br>" +
    "<b>up arrow </b>: increase tool size<br>" +
    "<b>down arrow </b>: decrease tool size<br>" +
    "<br><b>V </b>: select pen tool<br>" +
    "<b>B </b>: select brush tool<br>" +
    "<b>R </b>: select rough tool<br>" +
    "<b>E </b>: toggle eraser<br>" +
    "<b>L </b>: select line tool<br>" +
    "<br><b>G + hover line button</b>: toggle lines<br>" +
    "<b>U </b>: update frame<br>" +
    "<b>I </b>: insert frame<br>" +
    "<b>O </b>: toggle onion skin<br>" +
    "<b>X </b>: clear pad<br>" +
    "<b>spacebar </b>: play animation<br>"
  );
  msg2.style('color', 'white');
  msg2.style('font-size', '12px');
  msg2.parent('console');
  updateScroll();
}

function frameToUpdate() {
  //console.log(keyToUpdate);
}

function pinThisKey(keyToPin) {
  storeKeyPoses.push(keyToPin);
  console.log("we pushed this key to the storeKeyPoses array:" + keyToPin);
  console.log("storeKeyPoses: " + storeKeyPoses);

  let ref = database.ref(currentDB + keyToPin);
  ref.once('value', pinTheseDrawings, dbTalkClass.errData);

  function pinTheseDrawings(data) {
    //console.log("We fired oneDrawingOfkeyShowing !");
    let dbdrawing = data.val();
    keyPoses.push(dbdrawing.drawing);
  }
  $("#" + keyToPin).addClass("keepedPose");
  redraw();
}

function makeThisFixed() {
  fixedParts.push(drawing);
  drawing = [];
  redraw();
}

function saveGuide() {
  //console.log("——");
  //console.log("We just fired 'saveGuide'!");
  guidePath.push(drawing);
  //console.log("We send the paths in the 'guidePath' array.");
  drawing = [];
  //console.log("Aaand we clear the 'drawing' array.");
  //console.log("You saved that path as a guideline.");
  redraw();
}

function delGuide() {
  //console.log("——");
  //console.log("We just fired 'delGuide'!");
  guidePath = [];
  //console.log("As expected, the 'guidePath' array is now empty.");
  //console.log("Guidelines have been deleted.");
  redraw();
}

function toggleLoop() {
  loopTm = !loopTm;
  redraw();
}

var moblitzCB = function() {
  consoleClass.newMessage("——<br><br>YOUR GIF HAS BEEN DOWNLOADED<br>", 'console', 0, 0, '#54db54');

  let removeWait = select('#waitSession').remove();
  $(".gif-cogs").remove();
};
