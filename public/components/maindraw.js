let px, py, ppx, ppy, sx, sy;
let fex, fey; // erasePoint from friend
let ableToDraw = true;
let isDrawing = false;
let autoUpdate = false;
let friendIsErasing = false;


class HowToDraw{

  //*PRESSURE LIBRARY
  initializePressureSensor(){
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
  					socket.emit('startToDuo');
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
  				socket.emit('sendPoint', point);
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


  //3. Release th pen from canvas
  safeEndPath(){
    //Here we check for breaking cases, due to pen accidents
    if (currentPath.length === 0) {
      //console.log("OUPS | SLOW DOWN JOLLY JUMPER!");
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

}