let optionPressed = ctrlPressed = ctrlGkeyPressed = ctrlFkeyPressed = false;

class KeyBoard{

  setKeyboardShortcuts(){
    document.addEventListener('keyup', e => {
      const keyName = event.key;
      if (keyName === 't') {
        letterTisDown = false;
      }
    });
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

      if (keyName === 't') {
        letterTisDown = true;
      }
      if (keyName === 'k') {
        makeThisFixed();
      }
      if (keyName === 'i') {
        framesClass.newInsertFrame();
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
        toolClass.selectBrushTool();
      }
      if (keyName === 'l') {
        toolClass.selectLineTool();
      }
      if (keyName === 'e') {
        if (!ctrlPressed) {
          toolClass.selectEraserTool();
        }
      }
      if (keyName === 'v') {
        toolClass.selectPencilTool();
      }
      if (keyName === 'x') {
        framesClass.clearPad();
      }
      if (keyName === 'r') {
        toolClass.selectRoughTool();
      }

      if (keyName === 'ArrowLeft') {
        if(onVirginFrame == true){
    			timelinePos = storeKeys[0].length - 1;
    			onionPos = timelinePos - 1;
    			postOnionPos = 1;
    			posKey = storeKeys[0][timelinePos];
    			playClass.keyShowing();
    			framesClass.clearOnion();
    			framesClass.showOnion();

    		} else {

    			//console.log("——");
    			//console.log("Move left | Go backward.");
    			timelinePos -= 1;
    			if (timelinePos < 1) {
    				timelinePos = storeKeys[0].length;
    				framesClass.goVirgin();
    				onionPos = timelinePos - 1;
    				if (stateLoopOnion == true) {
    					postOnionPos = 1;
    				}
    			}
    			else if (timelinePos == 1) {
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
    			if(onVirginFrame == true){

    			} else {
    				playClass.keyShowing();
    			}

    			framesClass.clearOnion();
    			framesClass.showOnion();
        }
      }

      if (keyName === 'ArrowRight') {
        if(onVirginFrame == true){
   			 timelinePos = 1;
   			 onionPos = storeKeys[0].length - 1;
   			 postOnionPos = 2;
   			 posKey = storeKeys[0][timelinePos];
   			 playClass.keyShowing();
   			 framesClass.clearOnion();
   			 framesClass.showOnion();
   		 } else {

   			 //console.log("——");
   			 //console.log("Move right | Go forward.");
   			 timelinePos += 1;
   			 if (timelinePos == storeKeys[0].length ) {
   				 timelinePos = storeKeys[0].length;
   				 framesClass.goVirgin();
   				 if (stateLoopOnion == true) {
   					 onionPos = storeKeys[0].length - 1;
   				 }
   				 postOnionPos = 1;
   			 }
   			 else if (timelinePos > storeKeys[0].length ) {
   				 timelinePos = 1;

   				 if (stateLoopOnion == true) {
   					 onionPos = storeKeys[0].length - 1;
   				 }
   				 postOnionPos = 2;
   			 }
   			 else if (timelinePos == storeKeys[0].length - 1) {
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
   			 if(onVirginFrame == true){

   			 } else {
   				 playClass.keyShowing();
   			 }
   			 framesClass.clearOnion();
   			 framesClass.showOnion();
   		 }
      }

      if (keyName === 'ArrowUp') {

        if (sliderStroke.value() != 50) {
          sliderStroke.value(sliderStroke.value() + 1);
          strkVal = sliderStroke.value();
          getStrokeValue.html(strkVal);
          redraw();
        }

      }

      if (keyName === 'ArrowDown') {

        if (sliderStroke.value() != 1) {
          sliderStroke.value(sliderStroke.value() - 1);
          strkVal = sliderStroke.value();
          getStrokeValue.html(strkVal);
          redraw();
        }
      }

      if (keyName === " "){
          playClass.togglePlay();
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
          if(mouseOnCanvas){
            lipsync.pop();
          } else {

            //socket.emit('toutou');
            drawClass.undoLastPath();
            console.log("undo")
            //socket.emit('undoForeign');
          }
        }
        if (keyName === 'd') {
          framesClass.duplicateFrame();
        }
        if (keyName === 'h') {
          keyBoardClass.triggerHelp();
        }
        if (keyName === 'e') {
          framesClass.deleteFrame();
        }
      }
    }, false);
  };

  // WATCH EVENTS IN DRAW FUNCTION //
  watchKeyboardDown(){
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
  };

  triggerHelp(){
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
    consoleClass.updateScroll();
  };
}
