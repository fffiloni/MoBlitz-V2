class KeyBoard{

  setKeyboardShortcuts(){
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
  				//socket.emit('toutou');
          undoLastPath();
  				console.log("undo")
          //socket.emit('undoForeign');
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
  };

  
}
