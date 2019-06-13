let timelinePos = 0, onionPos, postOnionPos;
let timelinePosFriend;
let posKey, onionKey, postonionkey, keyToUpdate, previouskey, nextkey;
let posKeyFriend;
let tm;
let playing = false;
let loopTm = true;
let nframe;
let onVirginFrame = true;

//RECORDER GIF VARIABLES
let recorder;
let isRecording = false;
let fps = 12;

class Play {
  keyShowing() {
    onVirginFrame = false;
    $(".changeBtn").removeClass("disableAllBtn");
    ableDelete = true;
    ableUpdate = true;
    if (onVirginFrame) {
      ableInsert = false;
    } else if (timelinePos != storeKeys[0].length - 1) {
      ableInsert = true;
    }
    //console.log("——");
    //console.log("We just fired keyShowing() !");
    let key = posKey;
    let calcNbAfter = (storeKeys[0].length - 1) - (storeKeys[0].indexOf(key));
    //console.log("Nb of frames after the displayed one: " + calcNbAfter);
    frameAfter = [];
    // drawingsToKeep = [];
    for (let i = storeKeys[0].indexOf(key) + 1; i < storeKeys[0].length; i++) {
      frameAfter.push(storeKeys[0][i]);
    }
    //console.log("Keys of frames remaining after: ");
    //console.log(frameAfter);
    $(".current").removeClass("activelast");
    $(".listing").removeClass("activedraw");
    $("#" + previouskey).removeClass("braceFrame");
    $("#" + nextkey).removeClass("braceFrame");
    $("#" + key).addClass("activedraw");
    // waitDB = true;
    let ref = database.ref(currentDB + key);
    ref.once('value', oneDrawingOfkeyShowing, dbTalkClass.errData);

    function oneDrawingOfkeyShowing(data) {
      //console.log("We fired oneDrawingOfkeyShowing !");
      let dbdrawing = data.val();
      drawing = dbdrawing.drawing;
      let keyToSendData = {
        folkID: yourID,
        layerID: currentLayerKey,
        keyDisplayed: key
      }
      socket.emit('iamchangingkey', keyToSendData);
      painting = dbdrawing.painting;
      roughs = dbdrawing.roughs;
      keyToUpdate = key;
      if (dbdrawing.nearPrevKey){
        previousKeyfromInsert = dbdrawing.nearPrevKey;
      }
      //console.log("Key displayed: " + key);
      //console.log("Key to update loaded: " + keyToUpdate);
      //console.log("Let see the content of drawing array: ")
      //console.log(drawing);
      //console.log("nb elements in drawing: " + drawing.length);
    countPathOld = drawing.length + painting.length + roughs.length;
    eraserUsed = false;
    }
    // if(foreignDrawing == false){
      scktClass.safeRedraw();
    // }
  };

  togglePlay() {
    //console.log("——");
    //console.log("We just fired 'togglePlay'!");
    playing = !playing;
    if(playing == true){
      ableToDraw = false;
      $("#stopButton").removeClass("hide");
      $("#playButton").addClass("hide");
      socket.emit('iamplaying');
    } else if (playing == false){
      ableToDraw = true;
      $("#stopButton").addClass("hide");
      $("#playButton").removeClass("hide");
      socket.emit('iamnotplaying');
    }

    // showForeign = !showForeign;
    framesClass.clearOnion();
    //console.log("ANIMATION STARTED. (playing: " + playing + ")");
    if (playing) {
      if (isRecording == true) {
        recorder.frames = [];
      }
      // recorder = null;
      timelinePos = 0;
      tm = setInterval(playClass.playFrames, 1000 / fps);
    } else {
      clearInterval(tm);
    }
  };

  playFrames() {
    timelinePos += 1;
    //saveCanvas(canvas, 'myCanvas' + timelinePos, 'jpg');
    if (timelinePos == storeKeys[0].length) {
      if (loopTm == false) {
        timelinePos = storeKeys[0].length - 1;
        clearInterval(tm);
        playing = !playing;
        if (isRecording) {
          isRecording = false;
          showSafetyLines = true;
          playClass.proposeGifDownload();
        }
        //console.log("ANIMATION STOPPED. (playing: " + playing + ")");
        framesClass.goVirgin();
        framesClass.clearOnion();
        isRecording = false;
      } else {
        timelinePos = 1;
        posKey = storeKeys[0][timelinePos];
        //console.log("Frame:" + timelinePos + "/" + (storeKeys[0].length - 1) + " | Key: " + posKey);
        playClass.keyShowing();
      }
    } else {
      posKey = storeKeys[0][timelinePos];
      //console.log("Frame:" + timelinePos + "/" + (storeKeys[0].length - 1) + " | Key: " + posKey);
      playClass.keyShowing();
      if (isRecording) {
        if (timelinePos != 0) {
          recorder.addFrame();
        }
      }
    }
    if(foreignDrawing == false){
      redraw();
    }

  };

  //Gif record PROCESS
  proposeGifDownload() {
    consoleClass.newMessage("——<br><br>GIF IS READY TO BE DOWLOADED<br><button id=\"downloadGifBtn\" class=\"controlBtns\" ontouchstart=\"playClass.downloadGif()\" onclick=\"playClass.downloadGif()\">Download GIF ?</button><br>", 'console', 'messageGifIsReady');
  };

  chooseGifFormat() {
    loopTm = false;
    redraw();
    $(".feedback").remove();
    recorder = null;
    //console.log('FPS' + fps);
    recorder = p5Gif.capture({
      framerate: fps,
      repeat: true
    });


    consoleClass.newMessage("——<br><br>You want to export your animation to gif. You can decide between 3 renders. <br><br>CHOOSE A FORMAT: <br><button id=\"squareBtn\" class=\"formatGifBtn\" ontouchstart=\"playClass.launchRecordProcess('square')\" onclick=\"playClass.launchRecordProcess('square')\">SQUARE</button> <button id=\"fullBtn\" class=\"formatGifBtn\" ontouchstart=\"playClass.launchRecordProcess('full')\" onclick=\"playClass.launchRecordProcess('full')\">FULL</button>  <button id=\"scopeBtn\" class=\"formatGifBtn\" ontouchstart=\"playClass.launchRecordProcess('scope')\" onclick=\"playClass.launchRecordProcess('scope')\">SCOPE</button>", 'console', 'chooseGifMessage', 0);



    let squareOver = select('#squareBtn')
      .mouseOver(function() {
        btnSquareOver = true;
        redraw();
      })
      .mouseOut(function() {
        btnSquareOver = false;
        redraw();
      });
    let scopeOver = select('#scopeBtn')
      .mouseOver(function() {
        btnScopeOver = true;
        redraw();
      })
      .mouseOut(function() {
        btnScopeOver = false;
        redraw();
      });
    let fullOver = select('#fullBtn')
      .mouseOver(function() {
        btnFullOver = true;
        redraw();
      })
      .mouseOut(function() {
        btnFullOver = false;
        redraw();
      });
  };

  launchRecordProcess(gifFormat) {
    showSafetyLines = false;
    btnSquareOver = btnScopeOver = btnFullOver = false;
    if (gifFormat == 'square') {
      recorder.settings.width = expWidthSq;
      recorder.settings.height = expHeightSq;
      recorder.settings.top = expTopSq;
      recorder.settings.left = expLeftSq;
    } else if (gifFormat == 'full') {
      recorder.settings.width = expWidthF;
      recorder.settings.height = expHeightSq;
      recorder.settings.top = expTopF;
      recorder.settings.left = expLeftF;
    } else if (gifFormat == 'scope') {
      recorder.settings.width = expWidthSc;
      recorder.settings.height = expHeightSc;
      recorder.settings.top = expTopSc;
      recorder.settings.left = expLeftSc;
    }
    isRecording = true;
    let cleanMessage = select('#chooseGifMessage').remove();
    playClass.togglePlay();
  };

  downloadGif() {
    $(".feedback").remove();
    let waitDiv = createDiv('');
    waitDiv.id('waitSession');
    waitDiv.parent('canvascontainer')
    waitDiv.style('width', cnvWidth + 'px');
    waitDiv.style('height', cnvHeight + 40 + 'px');
    let waitContent = createDiv('<i class="fas fa-layer-group" style="font-size: 60px;"></i><br><br>YOUR GIF IS BEING BAKED. PLEASE WAIT.');
    waitContent.id('waitContent');
    waitContent.parent('waitSession');
    let cleanMessage2 = select('#messageGifIsReady').remove();
    // let rmbtn = document.getElementById('downloadGifBtn');
    // rmbtn.remove();
    consoleClass.newMessage("——<br><br>YOUR GIF IS BEING BAKED. PLEASE WAIT.", 'console', 0, 'gif-cogs', 'orange');
    setTimeout(function() {
      consoleClass.newMessage("YOUR BROWSER PAGE WILL FREEZE DURING PROCESS.", 'console', 0, 'gif-cogs', 'orange');
    }, 200);
    setTimeout(function() {
      consoleClass.newMessage("This will take approximatively " + 1.5 * recorder.frames.length + " seconds", 'console', 0, 'gif-cogs');
    }, 300);
    setTimeout(function() {
      consoleClass.newMessage("DON'T PANIC AND MAKE A COFFEE.<br>", 'console', 0, 'gif-cogs');
    }, 400);
    setTimeout(function() {
      recorder.download('moblitz-animation')
    }, 1000);
  };

}
