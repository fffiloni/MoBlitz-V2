let drawing = roughs = painting = [];
let duoDrawings = duoPrivateDrawings = [];
let predrawing = preroughs = prepainting = [];
let postdrawing = postroughs = postpainting = [];
let guidePath = guidelines = [];

class Tracer {
  traceGuidelines(){

      if (showGuidelines) {
        for (let i = 0; i < guidelines.length; i++) {
          let oneline = guidelines[i];
          graphicGuides.stroke(189, 225, 255);
          graphicGuides.strokeWeight(1);
          graphicGuides.line(oneline.x1, oneline.y1, oneline.x2, oneline.y2);
        }
      }
      //Shows Guidelines if there any data in guidePath array
      if (guidePath.length !== 0) {
        for (let o = 0; o < guidePath.length; o++) {
          let guide = guidePath[o];
          for (let i = 0; i < guide.length; i++) {
            let gpath = guide[i];
            graphicGuides.stroke('rgba(210, 210, 255, 1)');
            for (let j = 0; j < gpath.length; j++) {
              graphicGuides.strokeCap(ROUND);
              if (gpath[j].strk !== undefined) {
                graphicGuides.strokeWeight(gpath[j].strk);
              } else {
                graphicGuides.strokeWeight(2);
              }
              graphicGuides.beginShape();
              graphicGuides.noFill();
              graphicGuides.curveVertex(gpath[j].x1, gpath[j].y1);
              graphicGuides.curveVertex(gpath[j].x2, gpath[j].y2);
              graphicGuides.curveVertex(gpath[j].x3, gpath[j].y3);
              graphicGuides.curveVertex(gpath[j].x4, gpath[j].y4);
              graphicGuides.endShape();
            }
          }
        }
      }

  };

  traceFixedParts(){
     //Shows Fixed if there any data in guidePath array
      if (fixedParts.length !== 0) {
        for (let o = 0; o < fixedParts.length; o++) {
          let fixed = fixedParts[o];
          for (let i = 0; i < fixed.length; i++) {
            let fpath = fixed[i];

            graphicFixed.stroke('rgba(0, 0, 0, 0.5)');
            // beginShape();
            for (let j = 0; j < fpath.length; j++) {
              graphicFixed.strokeCap(ROUND);

              //takes colors data form each point in database
              if (fpath[j].strk !== undefined) {

                if (fpath[j].pressure !== undefined) {
                  if (fpath[j].strk == 1) {
                    graphicFixed.strokeWeight(map(fpath[j].pressure, 0, 1, 0, 2));
                  } else if (fpath[j].pressure === undefined) {
                    graphicFixed.strokeWeight(2);
                  } else {
                    graphicFixed.strokeWeight(map(fpath[j].pressure, 0, 1, 0, fpath[j].strk + 1));
                  }

                }


              } else {
                graphicFixed.strokeWeight(2);
              }
              graphicFixed.stroke(fpath[j].csR, fpath[j].csV, fpath[j].csB, 100);
              // line(gpath[j].x1, gpath[j].y1, gpath[j].x2, gpath[j].y2);
              graphicFixed.beginShape();
              graphicFixed.noFill();
              graphicFixed.curveVertex(fpath[j].x1, fpath[j].y1);
              graphicFixed.curveVertex(fpath[j].x2, fpath[j].y2);
              graphicFixed.curveVertex(fpath[j].x3, fpath[j].y3);
              graphicFixed.curveVertex(fpath[j].x4, fpath[j].y4);
              graphicFixed.endShape();
            }
            // endShape();
          }
        }
      }
  };

  traceKeyPoses(){
    //Shows keyPoses if there any data in keyPoses array
    if (keyPoses.length !== 0 || keyPoses.length !== undefined) {
      for (let ko = 0; ko < keyPoses.length; ko++) {
        let konion = keyPoses[ko];
        console.log(konion);
        if (konion.length !== 0 || konion.length !== undefined) {
          for (let i = 0; i < konion.length; i++) {
            let kopath = konion[i];
            console.log(kopath);

            if (kopath.length !== 0 || kopath.length !== undefined) {
              for (let j = 0; j < kopath.length; j++) {

                let d = dist(kopath[j].x1, kopath[j].y1, kopath[j].x4, kopath[j].y4);
                if (kopath[j].pressure !== undefined) {
                  var opacity = map(kopath[j].pressure, 0, 1, 40, 255);
                  var cStroke = map(kopath[j].pressure, 0, 1, 1, 3);
                } else if (d <= cnvWidth / 6) {
                  var opacity = map(d, 0, cnvWidth / 4, 180, 60);
                } else {
                  var opacity = 70;
                }

                graphicKeyPoses.strokeCap(SQUARE);
                graphicKeyPoses.curveTightness(0);

                //takes colors data form each point in database
                if (kopath[j].strk !== undefined) {
                  graphicKeyPoses.strokeWeight(cStroke);
                } else {
                  graphicKeyPoses.strokeWeight(1 + d / 100);
                }

                let calcOPCT = opacity - 80;
                if (calcOPCT <= 20) {
                  graphicKeyPoses.stroke(113 - 50, 57 - 50, 125 - 50, 40);
                } else if (calcOPCT >= 220) {
                  graphicKeyPoses.stroke(113 - 50, 57 - 50, 125 - 50, 180);
                } else {
                  graphicKeyPoses.stroke(113 - 50, 57 - 50, 125 - 50, calcOPCT);
                };
                graphicKeyPoses.beginShape();
                graphicKeyPoses.noFill();
                graphicKeyPoses.curveVertex(kopath[j].x1, kopath[j].y1);
                graphicKeyPoses.curveVertex(kopath[j].x2, kopath[j].y2);
                graphicKeyPoses.curveVertex(kopath[j].x3, kopath[j].y3);
                graphicKeyPoses.curveVertex(kopath[j].x4, kopath[j].y4);
                graphicKeyPoses.endShape();
              }
            }
          }
        }
      }
    }
  };

  tracePrePainting(){
    //Shows OnionLayer if there any data in predrawing array
    if (prepainting.length !== 0 || prepainting.length !== undefined) {
      for (let o = 0; o < prepainting.length; o++) {
        let onion = prepainting[o];
        if (onion.length !== 0 || onion.length !== undefined) {
          for (let i = 0; i < onion.length; i++) {
            let opath = onion[i];

            graphicOnion.stroke(200);
            // beginShape();
            if (opath.length !== 0 || opath.length !== undefined) {
              for (let j = 0; j < opath.length; j++) {
                graphicOnion.strokeCap(ROUND);
                if (opath[j].strk !== undefined) {
                  graphicOnion.strokeWeight(opath[j].strk);
                } else {
                  graphicOnion.strokeWeight(2);
                }
                graphicOnion.line(opath[j].x1, opath[j].y1, opath[j].x2, opath[j].y2);
                graphicOnion.line(opath[j].x3, opath[j].y3, opath[j].x4, opath[j].y4);
                // beginShape();
                // curveVertex(opath[j].x1, opath[j].y1);
                // curveVertex(opath[j].x2, opath[j].y2);
                // curveVertex(opath[j].x3, opath[j].y3);
                // curveVertex(opath[j].x4, opath[j].y4);
                // endShape();
              }
            }
            // endShape();
          }
        }
      }
    }
  };

  tracePreRoughs(){
    //Shows OnionLayer if there any data in predrawing array
    if (preroughs.length !== 0 || preroughs.length !== undefined) {
      for (let o = 0; o < preroughs.length; o++) {
        let onion = preroughs[o];
        if (onion.length !== 0 || onion.length !== undefined) {
          for (let i = 0; i < onion.length; i++) {
            let opath = onion[i];


            if (opath.length !== 0 || opath.length !== undefined) {
              for (let j = 0; j < opath.length; j++) {
                let d = dist(opath[j].x1, opath[j].y1, opath[j].x4, opath[j].y4);
                if (opath[j].pressure !== undefined) {
                  var opacity = map(opath[j].pressure, 0, 1, 40, 255);
                  var cStroke = map(opath[j].pressure, 0, 1, 1, 3);
                } else if (d <= cnvWidth / 6) {
                  var opacity = map(d, 0, cnvWidth / 4, 180, 60);
                } else {
                  var opacity = 70;
                }

                graphicOnion.strokeCap(SQUARE);

                graphicOnion.curveTightness(0);
                //takes colors data form each point in database
                if (opath[j].strk !== undefined) {
                  graphicOnion.strokeWeight(cStroke);
                } else {
                  graphicOnion.strokeWeight(1 + d / 100);
                }


                let calcOPCT = opacity - 80;
                if (calcOPCT <= 20) {
                  graphicOnion.stroke(186 - 50, 62 - 50, 51 - 50, 40);
                } else if (calcOPCT >= 220) {
                  graphicOnion.stroke(186 - 50, 62 - 50, 51 - 50, 180);
                } else {
                  graphicOnion.stroke(186 - 50, 62 - 50, 51 - 50, calcOPCT);
                };
                graphicOnion.beginShape();
                graphicOnion.noFill();
                graphicOnion.curveVertex(opath[j].x1, opath[j].y1);
                graphicOnion.curveVertex(opath[j].x2, opath[j].y2);
                graphicOnion.curveVertex(opath[j].x3, opath[j].y3);
                graphicOnion.curveVertex(opath[j].x4, opath[j].y4);
                graphicOnion.endShape();
              }
            }
          }
        }
      }
    }
  };

  tracePostRoughs(){
    //Shows OnionLayer if there any data in predrawing array
    if (postroughs.length !== 0 || postroughs.length !== undefined) {
      for (let o = 0; o < postroughs.length; o++) {
        let onion = postroughs[o];
        if (onion.length !== 0 || onion.length !== undefined) {
          for (let i = 0; i < onion.length; i++) {
            let opath = onion[i];


            if (opath.length !== 0 || opath.length !== undefined) {
              for (let j = 0; j < opath.length; j++) {
                let d = dist(opath[j].x1, opath[j].y1, opath[j].x4, opath[j].y4);
                if (opath[j].pressure !== undefined) {
                  var opacity = map(opath[j].pressure, 0, 1, 40, 255);
                  var cStroke = map(opath[j].pressure, 0, 1, 1, 3);
                } else if (d <= cnvWidth / 6) {
                  var opacity = map(d, 0, cnvWidth / 4, 180, 60);
                } else {
                  var opacity = 70;
                }

                graphicOnion.strokeCap(SQUARE);

                graphicOnion.curveTightness(0);
                //takes colors data form each point in database
                if (opath[j].strk !== undefined) {
                  // strokeWeight(path[j].strk + d/100);
                  graphicOnion.strokeWeight(cStroke);
                } else {
                  graphicOnion.strokeWeight(1 + d / 100);
                }
                if ((onVirginFrame == true && stateLoopOnion == true) ||
                  (onVirginFrame == true && stateLoopOnion == true && statePostOnion == false && timelinePos != storeKeys[0].length - 1) ||
                  (timelinePos == storeKeys[0].length - 1 && stateLoopOnion == true && onVirginFrame == false) ||
                  (timelinePos != storeKeys[0].length - 1 && stateLoopOnion == true && onVirginFrame == true) ||
                  (timelinePos != storeKeys[0].length - 1 && stateLoopOnion == true && onVirginFrame == false) ||
                  (timelinePos != storeKeys[0].length - 1 && stateLoopOnion == false && onVirginFrame == false)
                ) {
                  let calcOPCT = opacity - 80;
                  if (calcOPCT <= 20) {
                    graphicOnion.stroke(79 - 50, 202 - 50, 105 - 50, 40);
                  } else if (calcOPCT >= 220) {
                    graphicOnion.stroke(79 - 50, 202 - 50, 105 - 50, 180);
                  } else {
                    graphicOnion.stroke(79 - 50, 202 - 50, 105 - 50, calcOPCT);
                  };
                  graphicOnion.beginShape();
                  graphicOnion.noFill();
                  graphicOnion.curveVertex(opath[j].x1, opath[j].y1);
                  graphicOnion.curveVertex(opath[j].x2, opath[j].y2);
                  graphicOnion.curveVertex(opath[j].x3, opath[j].y3);
                  graphicOnion.curveVertex(opath[j].x4, opath[j].y4);
                  graphicOnion.endShape();
                }
              }
            }
          }
        }
      }
    }
  };

  tracePreOnion(){
    //Shows OnionLayer if there any data in predrawing array
    if (predrawing.length !== 0 || predrawing.length !== undefined) {
      for (let o = 0; o < predrawing.length; o++) {
        let onion = predrawing[o];
        for (let i = 0; i < onion.length; i++) {
          let opath = onion[i];
          graphicOnion.strokeCap(SQUARE);
          graphicOnion.stroke(186, 62, 51, 80);
          // beginShape();
          for (let j = 0; j < opath.length; j++) {
            //takes colors data form each point in database
            if (opath[j].strk !== undefined) {

              if (opath[j].pressure !== undefined) {
                if (opath[j].strk == 1) {
                  graphicOnion.strokeWeight(map(opath[j].pressure, 0, 1, 0, 2));
                } else if (opath[j].pressure === undefined) {
                  graphicOnion.strokeWeight(2);
                } else {
                  graphicOnion.strokeWeight(map(opath[j].pressure, 0, 1, 0, opath[j].strk + 1));
                }
              }
            } else {
              graphicOnion.strokeWeight(2);
            }
            graphicOnion.beginShape();
            graphicOnion.noFill();
            graphicOnion.curveVertex(opath[j].x1, opath[j].y1);
            graphicOnion.curveVertex(opath[j].x2, opath[j].y2);
            graphicOnion.curveVertex(opath[j].x3, opath[j].y3);
            graphicOnion.curveVertex(opath[j].x4, opath[j].y4);
            graphicOnion.endShape();
          }
        }
      }
    }
  };

  tracePostOnion(){
    //Shows OnionLayer if there any data in predrawing array
    if (postdrawing.length !== 0) {
      for (let o = 0; o < postdrawing.length; o++) {
        let onion = postdrawing[o];
        if (onion !== undefined) {
          for (let i = 0; i < onion.length; i++) {
            let opath = onion[i];
            graphicOnion.strokeCap(SQUARE);
            if (onVirginFrame == true) {
              graphicOnion.stroke(234, 162, 39, 80);
            } else {
              graphicOnion.stroke(79, 202, 105, 80);
            }
            for (let j = 0; j < opath.length; j++) {
              graphicOnion.strokeCap(SQUARE);
              //takes colors data form each point in database
              if (opath[j].strk !== undefined) {

                if (opath[j].pressure !== undefined) {
                  if (opath[j].strk == 1) {
                    graphicOnion.strokeWeight(map(opath[j].pressure, 0, 1, 0, 2));
                  } else if (opath[j].pressure === undefined) {
                    graphicOnion.strokeWeight(2);
                  } else {
                    graphicOnion.strokeWeight(map(opath[j].pressure, 0, 1, 0, opath[j].strk + 1));
                  }
                }
              } else {
                graphicOnion.strokeWeight(2);
              }
              if ((onVirginFrame == true && stateLoopOnion == true) ||
                (timelinePos == storeKeys[0].length - 1 && stateLoopOnion == true && onVirginFrame == false) ||
                (timelinePos != storeKeys[0].length - 1 && stateLoopOnion == true && onVirginFrame == true) ||
                (timelinePos != storeKeys[0].length - 1 && stateLoopOnion == true && onVirginFrame == false) ||
                (timelinePos != storeKeys[0].length - 1 && stateLoopOnion == false && onVirginFrame == false)
              ) {
                graphicOnion.beginShape();
                graphicOnion.noFill();
                graphicOnion.curveVertex(opath[j].x1, opath[j].y1);
                graphicOnion.curveVertex(opath[j].x2, opath[j].y2);
                graphicOnion.curveVertex(opath[j].x3, opath[j].y3);
                graphicOnion.curveVertex(opath[j].x4, opath[j].y4);
                graphicOnion.endShape();
              }
            }
          }
        }
      }
    }
  };

  tracePainting(){
    if (painting.length !== 0) {
      //Shows the current Paintings if there any data in drawing array
      for (let i = 0; i < painting.length; i++) {
        let path = painting[i];
        if (painting[i].length != 0) {
          lastPressure = path[path.length - 1].pressure;
          for (let j = 0; j < path.length; j++) {
            if (path[j].type == 'paint') {
              graphicBrush.strokeCap(ROUND);
              //takes colors data form each point in database
              if (path[j].strk !== undefined) {
                graphicBrush.strokeWeight(path[j].strk);
              } else {
                graphicBrush.strokeWeight(2);
              }
              graphicBrush.stroke(path[j].csR, path[j].csV, path[j].csB);
              graphicBrush.line(path[j].x1, path[j].y1, path[j].x2, path[j].y2);
              graphicBrush.line(path[j].x3, path[j].y3, path[j].x4, path[j].y4);
            }
          }
        }
      }
    }
  };

  traceRoughs(){
    if (roughs.length !== 0) {
      //Shows the current Paintings if there any data in drawing array
      for (let i = 0; i < roughs.length; i++) {
        let path = roughs[i];
        if (roughs[i].length != 0) {


          lastPressure = path[path.length - 1].pressure;
          for (let j = 0; j < path.length; j++) {
            if (path[j].type == 'rough') {
              let d = dist(path[j].x1, path[j].y1, path[j].x4, path[j].y4) / 2;

              if (path[j].pressure !== undefined) {
                var opacity = map(path[j].pressure, 0, 1, 40, 255);
                var cStroke = map(path[j].pressure, 0, 1, 1, 3);
              } else if (d <= cnvWidth / 6) {
                var opacity = map(d, 0, cnvWidth / 4, 180, 60);
              } else {
                var opacity = 70;
              }

              graphicRough.strokeCap(SQUARE);

              graphicRough.curveTightness(0);
              //takes colors data form each point in database
              if (path[j].strk !== undefined) {
                // strokeWeight(path[j].strk + d/100);
                graphicRough.strokeWeight(cStroke);
              } else {
                graphicRough.strokeWeight(1 + d / 100);
              }

              graphicRough.stroke(path[j].csR, path[j].csV, path[j].csB, opacity);

              graphicRough.beginShape();
              graphicRough.noFill();
              graphicRough.curveVertex(path[j].x1, path[j].y1);
              graphicRough.curveVertex(path[j].x2, path[j].y2);
              graphicRough.curveVertex(path[j].x3, path[j].y3);
              graphicRough.curveVertex(path[j].x4, path[j].y4);
              graphicRough.endShape();
            }
          }
        }
      }
    }
  };

  traceDrawings(){
    //Shows the current drawing if there any data in drawing array
    for (let i = 0; i < drawing.length; i++) {
      let path = drawing[i];
      if (drawing[i].length != 0) {
        // beginShape();
        lastStroke = path[path.length - 1].pressure;
        for (let j = 0; j < path.length; j++) {

          if (path[j].type == 'trait') {

            graphicFRONT.strokeCap(ROUND);
            //takes colors data form each point in database
            if (path[j].strk !== undefined) {

              if (path[j].pressure !== undefined) {
                if (path[j].strk == 1) {
                  graphicFRONT.strokeWeight(map(path[j].pressure, 0, 1, 0, 2));
                } else if (path[j].pressure === undefined) {
                  graphicFRONT.strokeWeight(2);
                } else {
                  graphicFRONT.strokeWeight(map(path[j].pressure, 0, 1, 0, path[j].strk + 1));
                }
              }
            } else {
              graphicFRONT.strokeWeight(2);
            }
            graphicFRONT.stroke(path[j].csR, path[j].csV, path[j].csB);
            graphicFRONT.beginShape();
            graphicFRONT.noFill();
            graphicFRONT.curveVertex(path[j].x1, path[j].y1);
            graphicFRONT.curveVertex(path[j].x2, path[j].y2);
            graphicFRONT.curveVertex(path[j].x3, path[j].y3);
            graphicFRONT.curveVertex(path[j].x4, path[j].y4);
            graphicFRONT.endShape();
          }
        }
      }

    }
  };

  eraserPainting(){
    for (let i = 0; i < painting.length; i++) {
      let path = painting[i];
      for (let j = 0; j < path.length; j++) {
        let d1 = int(dist(path[j]["x1"], path[j]["y1"], px, py));
        let d2 = int(dist(path[j]["x2"], path[j]["y2"], px, py));

        if (d1 <= sliderStroke.value() || d2 <= sliderStroke.value()) {
          if (path.length != 0) {
            path.splice(path.indexOf(path[j]), 1);
          }

          if (path.length == 0) {
            painting.splice(painting.indexOf(path), 1)
          }

          eraserUsed = true;
        }
      }
    }
  };

  eraserRoughs(){
    for (let i = 0; i < roughs.length; i++) {
      let path = roughs[i];
      for (let j = 0; j < path.length; j++) {
        let d1 = int(dist(path[j]["x1"], path[j]["y1"], px, py));
        let d2 = int(dist(path[j]["x2"], path[j]["y2"], px, py));

        if (d1 <= sliderStroke.value() || d2 <= sliderStroke.value()) {
          if (path.length != 0) {
            path.splice(path.indexOf(path[j]), 1);
          }

          if (path.length == 0) {
            roughs.splice(roughs.indexOf(path), 1)
          }

          eraserUsed = true;
        }
      }
    }
  };

  eraserDrawings(){
    for (let i = 0; i < drawing.length; i++) {
      let path = drawing[i];
      for (let j = 0; j < path.length; j++) {
        let d1 = int(dist(path[j]["x1"], path[j]["y1"], px, py));
        let d2 = int(dist(path[j]["x2"], path[j]["y2"], px, py));

        if (d1 <= sliderStroke.value() || d2 <= sliderStroke.value()) {
          if (path.length != 0) {
            path.splice(path.indexOf(path[j]), 1);
          }

          if (path.length == 0) {
            drawing.splice(drawing.indexOf(path), 1)
          }

          eraserUsed = true;
        }
      }
    }
  };

  eraserFriends(){
    for (let i = 0; i < duoDrawings.length; i++) {
      let path = duoDrawings[i];
      for (let j = 0; j < path.length; j++) {
        let d1 = int(dist(path[j]["x1"], path[j]["y1"], fex, fey));
        let d2 = int(dist(path[j]["x2"], path[j]["y2"], fex, fey));

        if (d1 <= sliderStroke.value() || d2 <= sliderStroke.value()) {
          if (path.length != 0) {
            path.splice(path.indexOf(path[j]), 1);
          }

          if (path.length == 0) {
            duoDrawings.splice(duoDrawings.indexOf(path), 1)
          }

          // eraserUsed = true;
        }
      }
    }
  };

  traceDUO(){
    folks.forEach(function(folk){
      //Shows the current drawing if there any data in drawing array
      for (let i = 0; i < folk.drawings.length; i++) {
        let path = folk.drawings[i];
        if (folk.drawings[i].length != 0) {
          // beginShape();
          lastStroke = path[path.length - 1].pressure;
          for (let j = 0; j < path.length; j++) {

            if (path[j].type == 'trait') {

              graphicDUO.strokeCap(SQUARE);
              //takes colors data form each point in database
              if (path[j].strk !== undefined) {

                if (path[j].pressure !== undefined) {
                  if (path[j].strk == 1) {
                    graphicDUO.strokeWeight(map(path[j].pressure, 0, 1, 0, 2));
                  } else if (path[j].pressure === undefined) {
                    graphicDUO.strokeWeight(2);
                  } else {
                    graphicDUO.strokeWeight(map(path[j].pressure, 0, 1, 0, path[j].strk + 1));
                  }
                }
              } else {
                graphicDUO.strokeWeight(2);
              }
              graphicDUO.stroke(path[j].csR, path[j].csV, path[j].csB, 80);
              graphicDUO.beginShape();
              graphicDUO.noFill();
              graphicDUO.curveVertex(path[j].x1, path[j].y1);
              graphicDUO.curveVertex(path[j].x2, path[j].y2);
              graphicDUO.curveVertex(path[j].x3, path[j].y3);
              graphicDUO.curveVertex(path[j].x4, path[j].y4);
              graphicDUO.endShape();
            }
          }
        }
      }
    });
  };

  tracePrivateDUO(){
    layersArray.forEach(function(multi){
      //Shows the current drawing if there any data in drawing array
      let multiDraw = multi.folderDrawings;

      for (let i = 0; i < multiDraw.length; i++) {
        let path = multiDraw[i];
        if (multiDraw[i].length != 0) {
          // beginShape();
          lastStroke = path[path.length - 1].pressure;
          for (let j = 0; j < path.length; j++) {

            if (path[j].type == 'trait') {

              graphicPrivateDUO.strokeCap(SQUARE);
              //takes colors data form each point in database
              if (path[j].strk !== undefined) {

                if (path[j].pressure !== undefined) {
                  if (path[j].strk == 1) {
                    graphicPrivateDUO.strokeWeight(map(path[j].pressure, 0, 1, 0, 2));
                  } else if (path[j].pressure === undefined) {
                    graphicPrivateDUO.strokeWeight(2);
                  } else {
                    graphicPrivateDUO.strokeWeight(map(path[j].pressure, 0, 1, 0, path[j].strk + 1));
                  }
                }
              } else {
                graphicDUO.strokeWeight(2);
              }
              graphicPrivateDUO.stroke(path[j].csR, path[j].csV, path[j].csB, 80);
              graphicPrivateDUO.beginShape();
              graphicPrivateDUO.noFill();
              graphicPrivateDUO.curveVertex(path[j].x1, path[j].y1);
              graphicPrivateDUO.curveVertex(path[j].x2, path[j].y2);
              graphicPrivateDUO.curveVertex(path[j].x3, path[j].y3);
              graphicPrivateDUO.curveVertex(path[j].x4, path[j].y4);
              graphicPrivateDUO.endShape();
            }
          }
        }

      }
    });

  };

  //Outils caché
  //   if (roughs.length !== 0){
  //     //Shows the current FEATHERS if there any data in drawing array
  //     // à n'utiliser qque sans dernier endpath points pour avoir de belles boucles
  //     for (let i = 0; i < roughs.length; i++){
  //       let path = roughs[i];
  //       if(roughs[i].length != 0){
  //
  //         for (let j = 0; j < path.length; j++){
  //           if(path[j].type == 'rough'){
  //             let d = dist(path[j].x1, path[j].y1,path[j].x4, path[j].y4);
  //
  //
  //             if(path[j].pressure !== undefined){
  //               var opacity = map(path[j].pressure,0, 1, 0, 255);
  //             } else if(d <= cnvWidth/6){
  //               var opacity = map(d, 0, cnvWidth/4, 180, 60);
  //             } else {
  //               var opacity = 70;
  //             }
  //
  //             strokeCap(SQUARE);
  //
  //             curveTightness(0);
  //             // strokeJoin(ROUND);
  //             fill(path[j].csR, path[j].csV, path[j].csB);
  //             beginShape();
  //
  //             //takes colors data form each point in database
  //             if(path[j].strk !== undefined){
  //               strokeWeight(path[j].strk + d/100);
  //             } else {
  //               strokeWeight(1+ d/100);
  //             }
  //             //fill(path[j].csR, path[j].csV, path[j].csB, 80);
  //             stroke(path[j].csR, path[j].csV, path[j].csB, opacity);
  //             // curve(path[j].x1, path[j].y1, path[j].x2, path[j].y2, path[j].x3, path[j].y3, path[j].x4, path[j].y4);
  //             curveVertex(path[j].x1, path[j].y1);
  //             curveVertex(path[j].x2, path[j].y2);
  //             curveVertex(path[j].x3, path[j].y3);
  //             curveVertex(path[j].x4, path[j].y4);
  //             //line(path[j].x1, path[j].y1, path[j].x2, path[j].y2);
  //             // vertex(path[j].x2, path[j].y2);
  //             endShape(CLOSE);
  //           }
  //         }
  //       }
  //     }
  //   }
}
