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
let lineTracing = [];
let showGuidelines = true;
let autoUpdate = false;
let friendIsErasing = false;


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
    //Activate virginframe if not selected while we are on frame #0
    if (timelinePos == 0) { framesClass.goVirgin() };

    //Initialize first point
    px = sx = ppx = mouseX;
    py = sy = ppy = mouseY;

    if (ableToDraw) {
      //console.log("——");
      //console.log("You started a new path!");
      isDrawing = true;
  		socket.emit('iamdrawing');

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

          let firstPoint = { x: mouseX, y: mouseY };
          lineTracing = [];
          lineTracing.push(firstPoint);
          redraw();

        } else {

          if (showDrawingLayer == true) {
            drawing.push(currentPath);
  					socket.emit('startToDuo', yourID);
            currentPath.splice(0, 1);
          } else {
            return;
          }

        }
        // nbdrawingupdated += 1;
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
          let dataToSend = {
            folkID: yourID,
            point:point
          }
  				socket.emit('sendPoint', dataToSend);
        }
      } else {
        //erase
        if (brushing) {
          tracerClass.eraserPainting();
        } else if (roughing) {
          tracerClass.eraserRoughs();
        } else {
          tracerClass.eraserDrawings();
          let erasePoint = {px: px, py: py};
          socket.emit('eraseFriend', erasePoint);
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

    } else if (currentPath.length === 1) {
      //console.log("OUPS | SLOW DOWN JOLLY JUMPER!");
      ableToDraw = false;
      let safetyPoint = currentPath[0];
      currentPath.push(safetyPoint);
      drawClass.endPath();
      if (brushing) {
        painting.pop();
      } else if (roughing) {
        roughs.pop();
      } else {
        drawing.pop();
      }
      ableToDraw = true;

    } else {
      //If everything OK, we close the path
      ableToDraw = false;
      drawClass.endPath();
      ableToDraw = true;
    }
    redraw();
  };

  //4. Last step before full ending path
  endPath(){
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
  	socket.emit('iamnotdrawing');

    socket.emit('endToDuo');

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

  // * HOW WE HANDLE DIFFERENT GRAPHIC CANVAS PARTS //

  loadAllGraphics(){
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
  };

}
