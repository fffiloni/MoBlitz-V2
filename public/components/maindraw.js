let px, py, ppx, ppy, sx, sy;
let fex, fey; // erasePoint from friend
let ableToDraw = true;
let isDrawing = false;
let showRoughs = showDrawingLayer = showBrushLayer = true;
let erasing = false;
let eraserUsed = false;
let safetyEraser = true;
let brushing = roughing = makingLine = false;
let penciling = true;

let showGuidelines = true;
let autoUpdate = false;
let friendIsErasing = false;
let pressure, lastPressure, lastStroke, getStrokeValue, strkVal, tempPressure;
let loopActivated = false;
let backupDrawings = [];
let backupPaintings = [];
let frameHasBeenSaved = false;
let backupUpdatedDrawings = [];
let backupUpdatedPaintings = [];
let frameHasBeenUpdated = false;
let backupUpdate = [];

let paintGraphicStock = [];
let bgdroppedState = 0;


class HowToDraw{

  //*PRESSURE LIBRARY
  initializePressureSensor(){
    $('#magma-canvas').pressure({

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
  };

  //1. Put the pen on canvas
  startPath(){
    //Make sure screen is not scrolling while drawing within some navigators
    $('body').addClass('block-scrolling');
    //reinitialize the current drawing in case we slip on nearest frame
    frameHasBeenSaved = false;
    frameHasBeenUpdated = false;
    //Activate virginframe if not selected while we are on frame #0
    if (timelinePos == 0) { framesClass.goVirgin() };

    //Initialize first point
    px = sx = ppx = mouseX;
    py = sy = ppy = mouseY;

    if (ableToDraw) {
      //console.log("——");
      //console.log("You started a new path!");
      isDrawing = true;
      loopActivated = true;
      loop();
  		socket.emit('iamdrawing');

      if (!erasing) {
        currentPath = [];
        //Are we using the brush tool ?
        if (brushing) {
          if (showBrushLayer == true) {
            painting.push(currentPath);
            if(onVirginFrame == true){
              backupPaintings.push(currentPath);
            } else {
              backupUpdatedPaintings.push(currentPath);

              let check = backupUpdate.findIndex(i => i.key == keyToUpdate);
              if(check == -1){
                let backupData = {
                  key: keyToUpdate,
                  beenUpdated: 'not yet',
                  content: {backupPaintings: backupUpdatedPaintings}
                };
                backupUpdate.push(backupData);
              } else {
                backupUpdate[check].content.backupPaintings = backupUpdatedPaintings;
              }

            }
            currentPath.splice(0, 1);
          } else {
            return;
          }

        } //Are we using the rough tool ?
          else if (roughing) {
          if (showRoughs == true) {
            roughs.push(currentPath);
            currentPath.splice(0, 1);
          } else {
            return;
          }

        } else if (makingLine) {

          let firstPoint = { x: mouseX, y: mouseY };
          console.log(firstPoint)
          lineTracing = [];
          lineTracing.push(firstPoint);

          // redraw();

        } else {
          //Else we are using the regular pen tool
          if (showDrawingLayer == true) {
            drawing.push(currentPath);
            if(onVirginFrame == true){
              backupDrawings.push(currentPath);
            } else {

              backupUpdatedDrawings.push(currentPath);

              let check = backupUpdate.findIndex(i => i.key == keyToUpdate);
              if(check == -1){
                let backupData = {
                  key: keyToUpdate,
                  beenUpdated: 'not yet',
                  content: {backupDrawings: backupUpdatedDrawings}
                };
                backupUpdate.push(backupData);
              } else {
                backupUpdate[check].content.backupDrawings = backupUpdatedDrawings;
              }

            }

            if(folks.length > 0){
              if(playing == false){
                socket.emit('startToDuo', yourID);
              }
            }

            currentPath.splice(0, 1);
          } else {
            return;
          }

        }
      }
      //console.log("A new array of points is pushed in 'drawing'");
      //console.log(currentPath);
    }
  };

  //2. ACTUALLY DRAWING BEHAVIOR | Pen is doing pen thing
  traceCurrentPath(){
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
          if(folks.length > 0){
            let dataToSend = {
              folkID: yourID,
              point:point
            }
            if(playing == false){
              socket.emit('sendPoint', dataToSend);
            }
          }

        }
      } else {
        //erase
        if (brushing) {
          tracerClass.eraserPainting();
        } else if (roughing) {
          tracerClass.eraserRoughs();
        } else {
          tracerClass.eraserDrawings();
          if(folks.length > 0){
            let erasePoint = {px: px, py: py};
            let dataToSend = {
              folkID : yourID,
              point: erasePoint
            }
            socket.emit('eraseFriend', dataToSend);
          }
        }
      }
      sx = ppx;
      sy = ppy;
      ppx = px;
      ppy = py;
      px = mouseX;
      py = mouseY;
      //console.log("Pushing points in the 'currentPath' array.");
      // let name = document.getElementById('animatorName').value;
      // if (name === ""){name = yourID;}
      let name = yourID;
      let posX = mouseX;
      let posY = mouseY;
    }
  };


  //3. Release the pen from canvas
  safeEndPath(){

      //Here we check for breaking cases, due to pen accidents
      if (currentPath.length === 0) {
        console.log("OUPS | SLOW DOWN JOLLY JUMPER!");
        ableToDraw = false;

        //We create a safetyPoint to fill the void
        let safetyPoint = {
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
          pressure: 0,
          strk: 0
        }

        currentPath.push(safetyPoint);
        drawClass.endPath();
        //Then user can continue to draw
        ableToDraw = true;

      }
      else if (currentPath.length === 1) {
        //console.log("OUPS | SLOW DOWN JOLLY JUMPER!");
        ableToDraw = false;
        let safetyPoint = currentPath[0];
        currentPath.push(safetyPoint);
        drawClass.endPath();
        if (brushing) {
          painting.pop();
          if(onVirginFrame == true){
            backupPaintings.pop();
          } else {
            backupUpdatedPaintings.pop();
            if(backupUpdatedPaintings.length + backupUpdatedDrawings.length == 0){
              $("#" + keyToUpdate).removeClass("needupdate");
            }
          }
        } else if (roughing) {
          roughs.pop();
        } else {
          drawing.pop();
          if(onVirginFrame == true){
            backupDrawings.pop();
          } else {
            backupUpdatedDrawings.pop();
            if(backupUpdatedPaintings.length + backupUpdatedDrawings.length == 0){
              $("#" + keyToUpdate).removeClass("needupdate");
            }
          }

        }
        ableToDraw = true;

      }
      else {

        //If everything OK, we close the path


        // let point = {
        //   type: typeOfTool,
        //   x1: sx,
        //   y1: sy,
        //   x2: ppx,
        //   y2: ppy,
        //   x3: px,
        //   y3: py,
        //   x4: px,
        //   y4: py,
        //   csR: csR,
        //   csV: csV,
        //   csB: csB,
        //   pressure: pressure,
        //   strk: sliderStroke.value()
        // }
        //
        // currentPath.push(point);

        ableToDraw = false;
        drawClass.endPath();
        ableToDraw = true;
      }
      // redraw();

  };

  //4. Last step before full ending path
  endPath(){

    isDrawing = false;
    noLoop();
    loopActivated = false;
    redraw();
    $('body').removeClass('block-scrolling');

  	socket.emit('iamnotdrawing');
    if(folks.length > 0){
      if(playing == false){
        let positionBack = {
          folkID: yourID,
          position: {x: -1, y: -1}
        };
        socket.emit('endToDuo', positionBack);
      }
    }


    if(autoUpdate == true){
      framesClass.updateFrame();
    } else {
      redraw();
    }
  };

  //5. UNDO LAST PATH
  undoLastPath() {
    if (brushing == true) {
      painting.pop();
      if(onVirginFrame == true){
        backupPaintings.pop();
      } else {
        backupUpdatedPaintings.pop();
      }
    } else if (roughing == true) {
      roughs.pop();
    } else if (makingLine == true) {
      guidelines.pop();
    } else if (penciling == true) {
      drawing.pop();
      if(onVirginFrame == true){
        backupDrawings.pop();
      } else {
        backupUpdatedDrawings.pop();
      }
      if(folks.length > 0){
        socket.emit('undoForeign');
      }
    }
    //console.log("——");
    //console.log("You deleted the last path in 'drawing'.");
    //console.log("So, there is " + drawing.length + " paths in 'drawing' now.");
    redraw();
  };

  // * HOW DIFFERENT DRAWING DATA ARE BEING SHOWN ON CANVAS //

  tracePreAndPost(){
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
  };

  traceFRONTLayerWithAll(){
    if ( isDrawing == true ){

      if ( showDrawingLayer == true ){

        if ( penciling == true ){

          graphicFRONT.clear();
          tracerClass.traceDrawings();

        }

      }

      if ( showRoughs == true ){

        if ( roughing == true ){

          graphicRough.clear();
          tracerClass.traceRoughs();

        }

      }

      if ( showRoughs == true ){

        if ( brushing == true ){

          if (onVirginFrame == false){
            let findpaintkey = paintGraphicStock.findIndex(k => k.key == keyToUpdate);
            paintGraphicStock[findpaintkey].graphic.clear();
          } else {
            graphicBrush.clear();
          }


          tracerClass.tracePainting();

        }

      }

    } else if ( isDrawing == false ){

      // ADDONS //

      // graphicKeyPoses.clear();
      // graphicFixed.clear();
      // tracerClass.traceFixedParts();
      // tracerClass.traceKeyPoses();

      // TRACING ONIONS POST AND PREVIOUS FOR EACH TOOL //

      graphicOnion.clear();
      drawClass.tracePreAndPost();

      // TRACE TOOLS LAYER CONTENT
      if (showBrushLayer) {
        if(onVirginFrame == false){

          if(paintGraphicStock.length != 0){

            let findpaintkey = paintGraphicStock.findIndex(k => k.key == keyToUpdate);
            if(findpaintkey != -1){
              if(paintGraphicStock[findpaintkey].alreadydrown == 'no'){
                paintGraphicStock[findpaintkey].alreadydrown = 'yes';
                paintGraphicStock[findpaintkey].graphic.clear();
                tracerClass.tracePainting();
              } else {
                if (playing == false){
                  if(countPathNew != countPathOld){
                    paintGraphicStock[findpaintkey].graphic.clear();
                    tracerClass.tracePainting();

                  }

                }

              }
            }

          }
        } else {
          graphicBrush.clear();
          tracerClass.tracePainting();
        }

      } else {
          let findpaintkey = paintGraphicStock.findIndex(k => k.key == keyToUpdate);
          if(findpaintkey != -1){
            paintGraphicStock[findpaintkey].graphic.clear();
            paintGraphicStock[findpaintkey].alreadydrown = 'no';
          }
            graphicBrush.clear();
      }

      if (showRoughs == true) {
        graphicRough.clear();
        tracerClass.traceRoughs();
      } else {
        graphicRough.clear();
      }

      if (showDrawingLayer == true) {
        graphicFRONT.clear();
        tracerClass.traceDrawings();
      } else {
        graphicFRONT.clear();
      }


    }
  }

  // * HOW WE HANDLE DIFFERENT GRAPHIC CANVAS PARTS //

  loadAllGraphics(){
    //image(graphicBG, 0, 0);

    if (bgdropped) {


        //image(bgdropped, 20, 20, width-40, height-40);

        image(graphicBG, 0, 0);
        push();
        // if(toggledDropState != bgdroppedState){
          //imageMode(CENTER)
          if(bgdroppedState == 0){
            graphicBGDrop.image(bgdropped, 20, 20, width-40, height-40);

          } else if(bgdroppedState == 1) {
            graphicBGDrop.image(bgdropped, 20, 20, width-40, height-40);
            graphicBGDrop.fill('rgba(255,255,255, 0.2)');
            graphicBGDrop.rect(0,0,width, height);

          } else if(bgdroppedState == 2) {
            graphicBGDrop.image(bgdropped, 20, 20, width-40, height-40);
            graphicBGDrop.fill('rgba(255,255,255, 0.5)');
          graphicBGDrop.rect(0,0,width, height);

        } else if(bgdroppedState == 3) {
            graphicBGDrop.image(bgdropped, 20, 20, width-40, height-40);
            graphicBGDrop.fill('rgba(255,255,255, 0.8)');
            graphicBGDrop.rect(0,0,width, height);

          }

        //}

        image(graphicBGDrop, 0, 0);
        pop();



    } else {
      image(graphicBG, 0, 0);
    }

    if(rotoComponentIsActive == true){
      if(videoFile){
        videoFile.size(canvas.width, canvas.height);
        //console.log(videoEl.currentTime);
        // if(videoFile){
      	// 	videoEl.currentTime = map(trimSlider.value(), 0, videoEl.duration*1000, 0, videoEl.duration);
      	// 	console.log(videoEl.currentTime);
        //
      	// }

        push();
        // if(toggledDropState != bgdroppedState){

          if(bgdroppedState == 0){
            graphicForVideo.image(videoFile, 0, 0);

          } else if(bgdroppedState == 1) {
            graphicForVideo.image(videoFile, 0, 0);
            graphicForVideo.fill('rgba(255,255,255, 0.2)');
            graphicForVideo.rect(0,0,width, height);

          } else if(bgdroppedState == 2) {
            graphicForVideo.image(videoFile, 0, 0);
            graphicForVideo.fill('rgba(255,255,255, 0.5)');
            graphicForVideo.rect(0,0,width, height);

        } else if(bgdroppedState == 3) {
            graphicForVideo.image(videoFile, 0, 0);
            graphicForVideo.fill('rgba(255,255,255, 0.8)');
            graphicForVideo.rect(0,0,width, height);

          }

        //}



        pop();
      }
    }

if(rotoComponentIsActive == true){
  image(graphicForVideo, 0, 0);
}

    image(graphicExport, 0, 0);
  	image(graphicDUO, 0, 0);
  	image(graphicPrivateDUO, 0, 0);
    image(graphicFixed, 0, 0);
    image(graphicKeyPoses, 0, 0);
    image(graphicGuides, 0, 0);
    image(graphicOnion, 0, 0);

    if(onVirginFrame == false){
      let findpaintkey = paintGraphicStock.findIndex(k => k.key == keyToUpdate);
      if(waitForLoopBack == false){
        if(findpaintkey != -1){
          image(paintGraphicStock[findpaintkey].graphic, 0, 0);
        }
      } else {
        image(graphicBrush, 0, 0);
      }

    } else {
      image(graphicBrush, 0, 0);
    }

    image(graphicRough, 0, 0);
    image(graphicFRONT, 0, 0);
  };

}
