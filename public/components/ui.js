let statePreOnion = statePostOnion = stateLoopOnion  = true;
let stateOnionPencil = stateOnionBrush = stateOnionRough = true;

class UI{
  // ACTION BUTTONS //

  setActionButtons(){
    let undoButton = select('#undoButton');
    undoButton.touchStarted(drawClass.undoLastPath);
    let clearButton = select('#clearButton');
    clearButton.touchStarted(framesClass.clearPad);
  	let clearOnionBtn = select('#clearOnion');
  	clearOnionBtn.touchStarted(framesClass.clearOnion);
  	let showOnionBtn = select('#showOnion');
  	showOnionBtn.touchStarted(framesClass.showOnion);
  	let delBtn = select('#delButton');
  	delBtn.touchStarted(framesClass.deleteFrame);
  	let insertBtn = select('#insertButton');
  	insertBtn.touchStarted(framesClass.newInsertFrame);
  	let duplicateBtn = select('#duplicateButton');
  	duplicateBtn.touchStarted(framesClass.duplicateFrame);
  	let updateBtn = select('#updateButton');
  	updateBtn.touchStarted(framesClass.updateFrame);
  	let saveBtn = select('#saveButton');
  	saveBtn.touchStarted(framesClass.saveDrawing);
    $(".changeBtn").addClass("disableAllBtn");
  }

  //////////////////////////////////////////
  // SIDE PANEL
  //////////////////////////////////////////

  createAsideContainers(){
    let divStrokeValue = createDiv('');
    divStrokeValue.id('strokeValue');
    divStrokeValue.parent('blankspace');

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

    let toolsContainer = createDiv('');
    toolsContainer.id('toolsContainer');
    toolsContainer.parent('leftToolHandler');

    let layersMaster = createDiv('');
    layersMaster.id('layersMaster');
    layersMaster.parent('blankspace');

    let layersContainer = createDiv('');
    layersContainer.id('layersContainer');
    layersContainer.parent('layersMaster');

    this.createLayerType('fa-eye', 'Pencil', 'drawingIsON', 'ON', toggleDrawings);
  	this.createLayerType('fa-eye-slash', 'Pencil', 'drawingIsOFF', 'OFF', toggleDrawings);

  	this.createLayerType('fa-eye', 'Roughs', 'roughIsON', 'ON', toggleRoughs);
  	this.createLayerType('fa-eye-slash', 'Roughs', 'roughIsOFF', 'OFF', toggleRoughs);

  	this.createLayerType('fa-eye', 'Brush', 'brushIsON', 'ON', toggleBrush);
  	this.createLayerType('fa-eye-slash', 'Brush', 'brushIsOFF', 'OFF', toggleBrush);

    this.setLayerOnionControls();

    let addLayerContainer = createDiv('');
    addLayerContainer.parent('blankspace');
    addLayerContainer.id('addLayer');

    let msgSupport = createP('DO YOU NEED MORE LAYER? <br>SUPPORT DEVELOPMENT ON Facebook!');
    msgSupport.parent('addLayer');
  }

  createLayerType(icon, kind, id, state, touchStarted){
    let newLayerType = createDiv('<i class="fas  ' + icon + '" style="font-size: 12px;"></i> ' + kind + ' Layer is ' + state);
    newLayerType.id(id);
    newLayerType.style('color', 'white');
    newLayerType.parent('layersContainer');
    newLayerType.touchStarted(touchStarted);
  }

  //////////////////////////////////////////
  // SET TOOLS COLUMN
  //////////////////////////////////////////

  setToolsContainer(){
    toolClass.createNewTool('fa-pen', 'Pencil', 'pencilBtn', toolClass.selectPencilTool);
    toolClass.createNewTool('fa-paint-brush', 'Brush', 'brushBtn', toolClass.selectBrushTool);
    toolClass.createNewTool('fa-pencil-alt', 'Rough', 'roughBtn', toolClass.selectRoughTool);
    toolClass.createNewTool('fa-eraser', 'Eraser', 'eraserBtn', toolClass.selectEraserTool);
  	let separator = createDiv('   —   ');
  	separator.parent(toolsContainer);
  	separator.style('display', 'inline-block');
  	separator.style('color', 'white');
  	separator.style('text-align', 'center');
  	separator.style('margin', '0 0 16px');
    // toolClass.createNewTool('fa-pen', 'Line', 'lineBtn', toolClass.selectLineTool);

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

  	toolClass.createNewTool('fa-adjust', 'BG', 'toggleBGBtn', toolClass.toggleBGBtn);
  	toolClass.createNewTool('fa-camera', 'Snap', 'snapshotBtn', toolClass.selectSnapShotTool);

  	let toggleFriendBtn = createButton('<i class="fas fa-user-friends" style="font-size: 20px;"></i><br>Friend');
    toggleFriendBtn.id('toggleFriendBtn');
    toggleFriendBtn.class('toolBtn');
    toggleFriendBtn.parent('toolsContainer');
    toggleFriendBtn.touchStarted(function() {
  		showForeign = !showForeign;
  		redraw();

    });
  }

  //////////////////////////////////////////
  // canvas UI
  //////////////////////////////////////////

  watchFrameCount(){
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
  };

  setFPSControl(){
    let fpsplus = select('#fpsp');
    fpsplus.touchStarted(function() {
      fps += 1;
      if(rotoComponentIsActive && videoFile){
        videoTrimmer.frameRate += 1;

        atFrameRateFloatVideo = Math.round(map(getVideoFloat, 0, 999, 1, fps));
        totalVideoFrames = Math.floor(videoEl.duration) * fps + atFrameRateFloatVideo;

      }
      // recorder.settings.framerate = fps;
      redraw();
    });
    let fpsminus = select('#fpsm');
    fpsminus.touchStarted(function() {
      fps -= 1;
      if(rotoComponentIsActive && videoFile){
        videoTrimmer.frameRate -= 1;
        atFrameRateFloatVideo = Math.round(map(getVideoFloat, 0, 999, 1, fps));
        totalVideoFrames = Math.floor(videoEl.duration) * fps + atFrameRateFloatVideo;
      }
      // recorder.settings.framerate = fps;
      redraw();
    });
  };

  watchFPSControl(){
    let displayFPS = select('#displayFPS');
    displayFPS.html(fps + ' fps');
  }

  setLoopControl(){
    let displayLoop = select('#displayLoop');
    displayLoop.touchStarted(toggleLoop);
    displayLoop.style('cursor', 'pointer');
  };

  watchLoopControl(){
    let displayLoop = select('#displayLoop');
    if (loopTm == true) {
      displayLoop.html('<span class="badge">loop</span>');
    } else {
      displayLoop.html('<span class="badge">noLoop</span>');
    }
  }

  setChainControl(){
    let displayChain = select('#displayChain');
    displayChain.touchStarted(toggleChain);
    displayChain.style('cursor', 'pointer');
    displayChain.style('margin-right', '20px');
  };

  watchLayerChainControl(){
    let displayChain = select('#displayChain');
    if (layersAreChained == true) {
      displayChain.html('<span class="badge">chained</span>');
    } else {
      displayChain.html('<span class="badge">unchained</span>');
    }
  }


    setChainSoundControl(){
        if(soundComponentIsActive == true){
          let displayChainSound = select('#displayChainSound');
          displayChainSound.touchStarted(toggleChainSound);
          displayChainSound.style('cursor', 'pointer');
          displayChainSound.style('margin-right', '20px');
        }

    };

    watchLayerChainSoundControl(){
      if(soundComponentIsActive == true){
        let displayChainSound = select('#displayChainSound');
        if (soundIsChained == true) {
          displayChainSound.html('<span class="badge">sound</span>');
        } else {
          displayChainSound.html('<span class="badge">noSound</span>');
        }
      }

    }




  //////////////////////////////////////////
  // Little Buttons controlling onion frames
  //////////////////////////////////////////

  setOnionControls(){
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
  }

  toggleStateLoopOnion(){
    if (stateLoopOnion == true) {
      $("#looponionBtn").removeClass("hideOnion");
    } else {
      $("#looponionBtn").addClass("hideOnion");
    };
  };

  toggleStatePostOnion(){
    if (statePostOnion == true) {
      $("#postonionBtn").removeClass("hideOnion");
    } else {
      $("#postonionBtn").addClass("hideOnion");
    };
  };

  toggleStatePreOnion(){
    if (statePreOnion == true) {
      $("#preonionBtn").removeClass("hideOnion");
    } else {
      $("#preonionBtn").addClass("hideOnion");
    };
  }

  ///////////////////////////////////////////////////////////
  // Little Buttons controlling onion frames from layer types
  ///////////////////////////////////////////////////////////

  setLayerOnionControls(){
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
  }

  toggleStateOnionPencil(){
    if (stateOnionPencil == true) {
      $("#toggleOnionPencilBtn").addClass("hideOnion");
    } else {
      $("#toggleOnionPencilBtn").removeClass("hideOnion");
    };
  };

  toggleStateOnionRough(){
    if (stateOnionRough == true) {
      $("#toggleOnionRoughBtn").addClass("hideOnion");
    } else {
      $("#toggleOnionRoughBtn").removeClass("hideOnion");
    };
  };

  toggleStateOnionBrush(){
    if (stateOnionBrush == true) {
      $("#toggleOnionBrushBtn").addClass("hideOnion");
    } else {
      $("#toggleOnionBrushBtn").removeClass("hideOnion");
    };
  }

  //////////////////////////////////////////
  // UI Button to toggle layers types
  //////////////////////////////////////////

  toggleShowRoughs(){
    if (showRoughs == true) {
      $("#roughIsOFF").addClass("hide");
      $("#roughIsON").removeClass("hide");
    } else {
      $("#roughIsOFF").removeClass("hide");
      $("#roughIsON").addClass("hide");
    }
  };

  toggleShowDrawingLayer(){
    if (showDrawingLayer == true) {
      $("#drawingIsOFF").addClass("hide");
      $("#drawingIsON").removeClass("hide");
    } else {
      $("#drawingIsOFF").removeClass("hide");
      $("#drawingIsON").addClass("hide");
    }
  };

  toggleShowBrushLayer(){
    if (showBrushLayer == true) {
      $("#brushIsOFF").addClass("hide");
      $("#brushIsON").removeClass("hide");
    } else {
      $("#brushIsOFF").removeClass("hide");
      $("#brushIsON").addClass("hide");
    }
  };

  //////////////////////////////////////////
  // Darkmode is changing cursor color on Canvas
  //////////////////////////////////////////

  toggleDarkmodeCursorBehavior(){
    if (brushing == true) {
      if (darkmode == true) {
        $("#magma-canvas").addClass("cursorBrushDM");
        $("#magma-canvas").removeClass("cursorBrush");
      } else {
        $("#magma-canvas").addClass("cursorBrush");
        $("#magma-canvas").removeClass("cursorBrushDM");
      }

    } else if (roughing == true || (roughing == true && brushing == false)) {
      if (darkmode == true) {
        $("#magma-canvas").addClass("cursorRoughDM");
        $("#magma-canvas").removeClass("cursorBrushDM");
      } else {
        $("#magma-canvas").addClass("cursorRough");
        $("#magma-canvas").removeClass("cursorBrush");
        $("#magma-canvas").removeClass("cursorBrushDM");
      }

    } else {
      if (darkmode == true) {
        $("#magma-canvas").addClass("cursorPencilDM");
        $("#magma-canvas").removeClass("cursorBrushDM");
        $("#magma-canvas").removeClass("cursorRoughDM");
        $("#magma-canvas").removeClass("cursorBrush");
        $("#magma-canvas").removeClass("cursorRough");
      } else {
        $("#magma-canvas").addClass("cursorPencil");
        $("#magma-canvas").removeClass("cursorBrush");
        $("#magma-canvas").removeClass("cursorRough");
        $("#magma-canvas").removeClass("cursorBrushDM");
        $("#magma-canvas").removeClass("cursorRoughDM");
        $("#magma-canvas").removeClass("cursorPencilDM");
      }
    }

    if (erasing == false || (erasing == false && brushing == false && roughing == false)) {
      if (darkmode == true) {
        $("#magma-canvas").removeClass("cursorEraserDM");
        $("#magma-canvas").removeClass("cursorEraser");
      } else {
        $("#magma-canvas").removeClass("cursorEraser");
        $("#magma-canvas").removeClass("cursorEraserDM");
      }
    }
    if (erasing == true) {
      if (darkmode == true) {
        $("#magma-canvas").addClass("cursorEraserDM");
        $("#magma-canvas").removeClass("cursorEraser");
      } else {
        $("#magma-canvas").addClass("cursorEraser");
        $("#magma-canvas").removeClass("cursorEraserDM");
      }
    }
  };

  toggleLayerPlay(sentLayerKey){
    console.log("try to play layer nb: " + sentLayerKey);
    let index = layersArray.findIndex(i => i.folderKey == sentLayerKey);

    if (layersArray[index].isPlaying == true){
      layersArray[index].isPlaying = false;
      clearInterval(layersArray[index].interval); //nommer cette variable dynamiquement
    } else if (layersArray[index].isPlaying == false){
      layersArray[index].isPlaying = true;
      let newInterval = setInterval("playClass.playOne('"+sentLayerKey+"')", 1000 / fps);
      layersArray[index].interval = newInterval;
    }

    scktClass.safeRedraw();
  };

  toggleFolkShow(sentLayerKey){
    console.log("try to show hide layer nb: " + sentLayerKey);
    let index = slots.findIndex(i => i.db == sentLayerKey);
    let folk = folks.findIndex(j => j.folk == slots[index].user);

    if(folks[folk] != undefined){
      if(folks[folk].display == 'hidden'){
        folks[folk].display = 'not hidden';
      } else if (folks[folk].display == 'not hidden'){
        folks[folk].display = 'hidden';
      } else if (folks[folk].display == undefined){
        folks[folk].display = 'not hidden';
      }
    }

    scktClass.safeRedraw();
  };

  toggleLayerTransparency(sentLayerKey){

    console.log("try to change transparency on layer nb: " + sentLayerKey);
    let index = layersArray.findIndex(i => i.folderKey == sentLayerKey);
    if (layersArray[index].transparency == 'on'){
      layersArray[index].transparency = 'off';

    } else if (layersArray[index].transparency == 'off'){
      layersArray[index].transparency = 'on';

    } else if (layersArray[index].transparency == undefined){
      layersArray[index].transparency = 'off';

    }

    scktClass.safeRedraw();

  };

  toggleLayerColor(sentLayerKey){


    console.log("try to change color display for layer nb: " + sentLayerKey);
    let index = layersArray.findIndex(i => i.folderKey == sentLayerKey);
    if (layersArray[index].colored == 'on'){
      layersArray[index].colored = 'off';

    } else if (layersArray[index].colored == 'off'){
      layersArray[index].colored = 'on';

    } else if (layersArray[index].colored == undefined){
      layersArray[index].colored = 'on';

    }

    scktClass.safeRedraw();
  };

  watchUIinDraw(){
    // HANDLE UI CHANGES //

    uiClass.watchFrameCount();
    uiClass.toggleStateLoopOnion();
    uiClass.toggleStatePostOnion();
    uiClass.toggleStatePreOnion();
    uiClass.watchFPSControl();
    uiClass.watchLoopControl();
    uiClass.watchLayerChainControl();

    if(soundComponentIsActive == true){
      uiClass.watchLayerChainSoundControl();
    }


    //

    uiClass.toggleShowRoughs();
    uiClass.toggleShowDrawingLayer();
    uiClass.toggleShowBrushLayer();
    uiClass.toggleStateOnionPencil();
    uiClass.toggleStateOnionRough();
    uiClass.toggleStateOnionBrush();

    uiClass.toggleDarkmodeCursorBehavior();
  }



}
