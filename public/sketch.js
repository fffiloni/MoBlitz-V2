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

let btnScopeOver = btnSquareOver = btnFullOver = false;

let typeOfTool;
let yourID;

let onionDisplayed = false;
let framesCount;

let currentPath = currentForeign = [];
let lastPath = [];
let fixedParts = [];
let storeKeyPoses = [];
let keyPoses = [];
let showSafetyLines = true;

let ableToSend = true;

let foreignDrawing = false;
let showForeign = true;

let deleteAble = false;

let maxDraw = 49;
let countFrames;
let maxIsReached = false;
let frameAfter = [];
// let dataToKeep = drawingsToKeep = paintingsToKeep = roughsToKeep = [];
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
  let wlcm = createP('Welcome On MoBlitz DUO Version!<br><br>' +
    'This is your console, where you\'ll get feedback from everything you do. <br> If you need help, Scroll down to see the ShortCuts documentation.<br><br>' +
    'Now click on the big green button to begin your awesome animation!' +
    '');
  wlcm.parent('console');

  // socket = io.connect('https://magmanin.nanomenta.com/');
  // socket = io.connect('http://localhost:4000');
	socket = io.connect('https://mb-duo.herokuapp.com/');
	scktClass.initializeDB();

} //END PRELOAD


function setup() {
	frameRate(24);

	//Here we load actions fired from the server via socket.
	scktClass.actionSocketResponses();

  magmaCNV.setMagmaCanvas();
	magmaCNV.initializeExportFormat();
	magmaCNV.loadCoveredCanvas();
	magmaCNV.initializeGraphics();
	drawClass.initializePressureSensor();
	keyBoardClass.setKeyboardShortcuts();

  colorClass.setColorComponent();
  colorClass.setFirstColors();

	// ACTION BUTTONS //
	uiClass.setActionButtons();
  // SIDE CONTAINERS
  uiClass.createAsideContainers();
	uiClass.setToolsContainer();
  // ON CANVAS WATCH CONTROLS
	uiClass.setOnionControls();
	uiClass.setLoopControl();
	uiClass.setFPSControl();

} // END SETUP

function draw() {

	touchX = mouseX;
  touchY = mouseY;

	// HANDLE UI CHANGES //
	uiClass.watchUIinDraw();


  if (ctrlGkeyPressed == true) {
    $("#addGuideBtn").addClass("cursorDelGuide");
  } else if (ctrlGkeyPressed == false) {
    $("#addGuideBtn").removeClass("cursorDelGuide");

  }

  // GRAPHICS BEHAVIOR //
	// 1. CLEANING CANVAS

  graphicBG.background(setBG); // BG FIRST

	// START MULTI LABELED
	graphicDUO.clear();
	graphicPrivateDUO.clear();
	// END MULTI LABELED

  graphicBrush.clear();
  graphicRough.clear();
  graphicFRONT.clear();

  graphicGuides.clear(); // GUIDELINES

  if (isDrawing == false) {
    graphicKeyPoses.clear();
    graphicFixed.clear();

    graphicOnion.clear();
  }

	magmaCNV.safetyLinesBehavior();
  framesClass.buttonsBehaviorOnFrameChanges();
	keyBoardClass.watchKeyboardDown();
  colorClass.watchColorsInDraw();

	// 2. TRACE CURRENT USER PATH BEING DRAWED //
	drawClass.traceCurrentPath();

  if (isRecording == false) {
		// A. GUIDELINES DOES NOT APPEAR WHILE CREATING GIF
    tracerClass.traceGuidelines();
  }

  if (isDrawing == false) {

		tracerClass.traceFixedParts();
    tracerClass.traceKeyPoses();

		// B. TRACING ONIONS POST AND PREVIOUS FOR EACH TOOL //
    drawClass.tracePreAndPost();
  }

	if (showForeign == true){
		// MULTI — SHOW FRIENDS DRAWINGS
		tracerClass.traceDUO();
		tracerClass.tracePrivateDUO();
	}

	// C. TRACE TOOLS LAYER CONTENT
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

  // fill();
  // stroke(120);
  // strokeWeight(1);
  if(isDrawing){
		graphicFRONT.push();
		graphicFRONT.noStroke();
		graphicFRONT.fill('rgb(' + csR + ',' + csV + ',' + csB + ')');
    graphicFRONT.ellipse(mouseX,mouseY,map(pressure, 0, 1, 0, sliderStroke.value()/5));
		graphicFRONT.pop();
  }
	folks.forEach((folk) => {
		graphicPrivateDUO.text('. friend', folk.position.x, folk.position.y)
	})


	// D. FINALLY LOAD ALL GRAPHIC CANVAS IN THE RIGHT ORDER
  drawClass.loadAllGraphics();

 	countPathNew = drawing.length + painting.length + roughs.length;

}
// Closing the DRAW function

function mouseDragged() {
  strkVal = sliderStroke.value();
  getStrokeValue.html(strkVal);
  redraw();
}

// function mouseIsPressed() {
//
//   redraw();
// }

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

// document.getElementById("magma-canvas").addEventListener("mousedown", mouseDown);
// function mouseDown(){
// 	console.log("mouse is down");
// }

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
