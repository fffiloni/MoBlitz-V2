Array.prototype.mbmove = function(from_index, to_index) {
	var x = this[from_index];

	this.splice(from_index, 1);
    this.splice(to_index,0,x);

    return this;
}

p5.disableFriendlyErrors = true;
let database, socket;
let magmaCNV, drawClass, scktClass, consoleClass, uiClass, toolClass, colorClass, framesClass, dbTalkClass, playClass, tracerClass, keyBoardClass;

let startDiv;
let setBG = 'rgb(255, 255, 248)';
let darkmode = false;

let touchX, touchY;

let insertedKey;

let btnScopeOver = btnSquareOver = btnFullOver = false;
let showRoughs = showDrawingLayer = showBrushLayer = true;


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
let duoDrawings = duoPrivateDrawings = [];
let predrawing = preroughs = prepainting = [];
let postdrawing = postroughs = postpainting = [];
let guidePath = guidelines = [];
let currentPath = currentForeign = [];
let lastPath = [];
let fixedParts = [];
let storeKeyPoses = [];
let keyPoses = [];
let showSafetyLines = true;
let colorChoice, sliderR, sliderV, sliderB, sliderStroke;
let csR = csB = csV = setR = setV = setB = 0;
let paletteHandle = palette = [];


let ableToSend = true;

let foreignDrawing = false;
let showForeign = true;


let previousKeyfromInsert = null;


let optionPressed = ctrlPressed = ctrlGkeyPressed = ctrlFkeyPressed = false;
let deleteAble = false;



let maxDraw = 49;
let countFrames;
let maxIsReached = false;
let frameAfter = dataToKeep = drawingsToKeep = paintingsToKeep = roughsToKeep = [];
let bg;



function preload() {
	//Here we load components
	magmaCNV = new MagmaCanvas();
	drawClass = new HowToDraw();
	scktClass = new SCKT();
	consoleClass = new ConsoleMessage();
	uiClass = new UI();
	toolClass = new Tools();
  colorClass = new Colors();
  framesClass = new Frames();
  dbTalkClass = new DBTalk();
  playClass = new Play();
  tracerClass = new Tracer();
	keyBoardClass = new KeyBoard();

  // bg = loadImage('./paris-color-3.jpg');

  //console.log("WELCOME ON MOBLITZ!");
  let wlcm = createP('Welcome On MoBlitz Solo Version!<br><br>' +
    'This is your console, where you\'ll get feedback from everything you do. <br> If you need help, Scroll down to see the ShortCuts documentation.<br><br>' +
    'Now you can click on the big green button to begin your awesome animation!' +
    '');
  wlcm.parent('console');

  // socket = io.connect('https://magmanin.nanomenta.com/');
  // socket = io.connect('http://localhost:4000');
	socket = io.connect('https://mb-duo.herokuapp.com/');
	scktClass.initializeDB();

} //END PRELOAD

function connectDB() {
  socket.emit('connectDB');
  let rmbtn = document.getElementById('connectFirst');
  rmbtn.remove();
  consoleClass.newMessage('You started a new Session! Enjoy! Bim!', 'console');
  $("#startSession").addClass("hide");
  toolClass.selectPencilTool();
}

function setup() {

	//Here we load actions fired from the server via socket.
	scktClass.actionSocketResponses();

  magmaCNV.setMagmaCanvas();
	magmaCNV.initializeExportFormat();
	magmaCNV.loadCoveredCanvas();
	magmaCNV.initializeGraphics();
	drawClass.initializePressureSensor();
	keyBoardClass.setKeyboardShortcuts();

  let tlsubstitute = createDiv('');
  tlsubstitute.id('substitute');
  tlsubstitute.parent('drawinglist');

  socket.on('yourID', (data) => {
    yourID = data;
    //socket.emit('newPeople');
    //console.log("Your ID is " + yourID);
  });

  colorClass.setColorComponent();
  colorClass.setFirstColors();

  let clearButton = select('#clearButton');
  clearButton.touchStarted(framesClass.goVirgin);

  $(".changeBtn").addClass("disableAllBtn");

  uiClass.createAsideContainers();
	uiClass.setToolsContainer();

	uiClass.setOnionControls();
	uiClass.setLoopControl();
	uiClass.setFPSControl();

} // END SETUP

function selectEraserTool() {
  erasing = !erasing;
	socket.emit('iamerasing');

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


function draw() {

	touchX = mouseX;
  touchY = mouseY;

	//

	uiClass.watchFrameCount();
	uiClass.toggleStateLoopOnion();
	uiClass.toggleStatePostOnion();
	uiClass.toggleStatePreOnion();
  uiClass.watchFPSControl();
	uiClass.watchLoopControl();

	//

	uiClass.toggleShowRoughs();
	uiClass.toggleShowDrawingLayer();
	uiClass.toggleShowBrushLayer();
	uiClass.toggleStateOnionPencil();
	uiClass.toggleStateOnionRough();
  uiClass.toggleStateOnionBrush();

  if (ctrlGkeyPressed == true) {
    $("#addGuideBtn").addClass("cursorDelGuide");
  } else if (ctrlGkeyPressed == false) {
    $("#addGuideBtn").removeClass("cursorDelGuide");

  }

  uiClass.toggleDarkmodeCursorBehavior();

  graphicBG.background(setBG);
	graphicDUO.clear();
	graphicPrivateDUO.clear();
  graphicBrush.clear();
  graphicRough.clear();
  graphicFRONT.clear();
  graphicGuides.clear();


  if (isDrawing == false) {
    graphicKeyPoses.clear();
    graphicFixed.clear();

    graphicOnion.clear();
  }

	magmaCNV.safetyLinesBehavior();
  framesClass.buttonsBehaviorOnFrameChanges();


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

  drawClass.traceCurrentPath();

  if (isRecording == false) {
    tracerClass.traceGuidelines();
  }

  if (isDrawing == false) {

		tracerClass.traceFixedParts();
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

	if (showForeign == true){
		tracerClass.traceDUO();
		tracerClass.tracePrivateDUO();
	}

  if (showBrushLayer) {
    tracerClass.tracePainting();
  }

  if (showRoughs == true) {
    tracerClass.traceRoughs();
  }

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
	image(graphicDUO, 0, 0);
	image(graphicPrivateDUO, 0, 0);
  image(graphicFixed, 0, 0);
  image(graphicKeyPoses, 0, 0);
  image(graphicGuides, 0, 0);
  image(graphicOnion, 0, 0);
  image(graphicBrush, 0, 0);
  image(graphicRough, 0, 0);
  image(graphicFRONT, 0, 0);
	// let imgToSend = graphicFRONT;

	// socket.on('displayGraphic', function(data){
	// 	image(data, 0, 0);
	// })
 countPathNew = drawing.length + painting.length + roughs.length;

}
// Closing the DRAW function


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
		socket.emit('undoForeign');
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

function showPrivateAnimFriend(key) {
  if (key instanceof MouseEvent) {
    let key = this.id();

    if (optionPressed || ctrlFkeyPressed) {
      framesClass.showPrivateDrawingFriend(key);
      // keyToUpdate = key;
      //console.log(keyToUpdate);
    }
  }
  redraw();
}

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
