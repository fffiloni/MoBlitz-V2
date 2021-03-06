Array.prototype.mbmove = function(from_index, to_index) {
	var x = this[from_index];

	this.splice(from_index, 1);
    this.splice(to_index,0,x);

    return this;
}

p5.disableFriendlyErrors = true;
let database, socket;
let magmaCNV, drawClass, scktClass, consoleClass, uiClass, toolClass, colorClass, framesClass, dbTalkClass, playClass, tracerClass, keyBoardClass;
let bgdropped;
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
let dropdata;
let checkPaintCount, checkRoughCount;
let checkPrivateDuoCount, prevCheckCountPrivateDuo = 0;

let soundComponentIsActive = false;
let rotoComponentIsActive = false;


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

  // socket = io.connect('https://magmanim.nanomenta.com/');
  socket = io.connect('http://localhost:4000');
	// socket = io.connect('https://mb-duo.herokuapp.com/');
	scktClass.initializeDB();

} //END PRELOAD


function setup() {

	frameRate(60);

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
	uiClass.setChainControl();

	if(soundComponentIsActive == true){
		uiClass.setChainSoundControl();
	}


	canvas.drop(gotFile);




} // END SETUP





function draw() {


	touchX = mouseX;
  touchY = mouseY;

	// HANDLE UI CHANGES //
	uiClass.watchUIinDraw();

	if(folks.length > 0){
		folks.forEach(function(folk){
			let index = slots.findIndex(i => i.user == folk.folk);
			if(index != -1){

				if (folk.display != undefined){
					if(folk.display == 'hidden'){
						$('#friendBtn' + slots[index].db).html("<i class=\"far fa-user-circle\"></i>");


					} else if (folk.display == 'not hidden'){
						$('#friendBtn' + slots[index].db).html("<i class=\"fas fa-user-circle\"></i>");
					}
				}
			}


		})
	}

	layersArray.forEach(function(layer){
		//IS PLAYING LAYER ?
		if (layer.isPlaying == false){
			$('#playLayerBtn' + layer.folderKey).html("<i class=\"fas fa-play-circle\"></i>");
		} else if (layer.isPlaying == true){
			$('#playLayerBtn' + layer.folderKey).html("<i class=\"fas fa-pause-circle\" style=\"color: #ff847b;\"></i>");
		} else if (layer.isPlaying == undefined){

		}

		//TRANSPARENCY LAYER
		if (layer.transparency == 'off'){
			$('#transparencyBtn' + layer.folderKey).html("<i class=\"fas fa-circle\"></i>");
		} else if (layer.transparency == 'on'){
			$('#transparencyBtn' + layer.folderKey).html("<i class=\"far fa-dot-circle\"></i>");
		} else if (layer.transparency == undefined){

		}
		// COLORED LAYER
		if (layer.colored == 'off'){
			$('#colorBtn' + layer.folderKey).html("<i class=\"far fa-circle\" style=\"color: rgb(" + layer.csR + ", " + layer.csV + "," + layer.csB + ")!important;\"></i>");
    } else if (layer.colored == 'on'){
    	$('#colorBtn' + layer.folderKey).html("<i class=\"fas fa-circle\" style=\"color: rgb(" + layer.csR + ", " + layer.csV + "," + layer.csB + ")!important;\"></i>");
    } else if (layer.colored == undefined){

    }
	});


  if (ctrlGkeyPressed == true) {
    $("#addGuideBtn").addClass("cursorDelGuide");
  } else if (ctrlGkeyPressed == false) {
    $("#addGuideBtn").removeClass("cursorDelGuide");

  }

  // GRAPHICS BEHAVIOR //
	// 1. CLEANING CANVAS

	graphicBG.background(setBG); // BG FIRST
	magmaCNV.safetyLinesBehavior();
  framesClass.buttonsBehaviorOnFrameChanges();
	keyBoardClass.watchKeyboardDown();
  colorClass.watchColorsInDraw();

	// 2. TRACE CURRENT USER PATH BEING DRAWED //
	drawClass.traceCurrentPath();

  if (isRecording == false) {
		// A. GUIDELINES DOES NOT APPEAR WHILE CREATING GIF
		graphicGuides.clear(); // GUIDELINES
    tracerClass.traceGuidelines();
  }

  // MULTI — SHOW FRIENDS DRAWINGS
	if (showForeign == true){

		graphicDUO.clear();
		tracerClass.traceDUO();
	}

	graphicPrivateDUO.clear();
	tracerClass.tracePrivateDUO();

	drawClass.traceFRONTLayerWithAll();


  // fill();
  // stroke(120);
  // strokeWeight(1);
  // if(isDrawing){
	// 	graphicFRONT.push();
	// 	graphicFRONT.noStroke();
	// 	graphicFRONT.fill('rgb(' + csR + ',' + csV + ',' + csB + ')');
  //   graphicFRONT.ellipse(mouseX,mouseY,map(pressure, 0, 1, 0, sliderStroke.value()/5));
	// 	graphicFRONT.pop();
  // }
	folks.forEach((folk) => {
		graphicDUO.push();
		graphicDUO.strokeWeight(1);
		graphicDUO.text('. friend', folk.position.x, folk.position.y);
		graphicDUO.pop();
	})


	// D. FINALLY LOAD ALL GRAPHIC CANVAS IN THE RIGHT ORDER
  drawClass.loadAllGraphics();

 	countPathNew = drawing.length + painting.length + roughs.length;

}
// Closing the DRAW function

function mouseDragged() {
  strkVal = sliderStroke.value();
  getStrokeValue.html(strkVal);
	if(loopActivated == false){
		redraw();
	}
}

function gotFile(file){

	console.log(file);
	if(file.type == "image"){
		dropdata = file;
		bgdropped = createImg(file.data).hide();

		setTimeout(function(){
			redraw();
		}, 200);
	} else if(file.type == "video"){
		if(videoFile){
    	videoFile.remove();
  	}
	  console.log(file.type);
	  currentFrame = 0;
	  videoFile = createVideo(file.data).hide();
	  videoFile.id("myVideo");
	  videoEl = document.getElementById("myVideo");
	  videoEl.addEventListener('loadeddata', function() {
	   	calculateFrames();
	 	}, false);
	}
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

function toggleChain() {
  layersAreChained = !layersAreChained;
  redraw();
}

function toggleChainSound() {
  soundIsChained = !soundIsChained;
	console.log("sound is chained ?: " + soundIsChained)
  redraw();
}

function ChangeUrl(page, url) {
        if (typeof (history.pushState) != "undefined") {
            var obj = { Page: page, Url: url };
            history.pushState(obj, obj.Page, obj.Url);
        } else {
            alert("Browser does not support HTML5.");
        }
    }

var moblitzCB = function() {
  consoleClass.newMessage("——<br><br>YOUR GIF HAS BEEN DOWNLOADED<br>", 'console', 0, 0, '#54db54');

  let removeWait = select('#waitSession').remove();
  $(".gif-cogs").remove();
};
