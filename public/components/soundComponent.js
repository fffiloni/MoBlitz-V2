
let soundcanvas;
let mySound;
let soundBtn;
let soundPlaying = false;
let mic, soundrecorder, soundFile, recordBtn, playRecBtn;
let soundrecording = false;
let playingrecorded = false;
let mouseOnCanvas = false;
let textDisplayText = 0;
let currentCue = 0;
let linePos, trimLinePos, cuePos = 0;
let getFloat, atFrameRateFloat;
let trimming = false;
let roundedCueText;

let lipsync = [];
let currentLipPath = [];
let isDrawingLipSync = false;
let graphicLIPSYNC;
let l_sx, l_sy, l_ppx, l_ppy, l_px, l_py;
let soundIsChained = false;
let totalSoundFrames = 0;
let tmSound;

let letterTisDown = false;
let myp5 = new p5(( s ) => {



s.setup = () => {
  s.pixelDensity(1)
  let soundContainer = createDiv('');
  soundContainer.id('soundContainer');
  soundContainer.style("max-width", cnvWidth);
  soundContainer.html('<span style="color: white;">LipSync Experimental | </span>');
  soundContainer.parent('sounds');
  soundcanvas = s.createCanvas(cnvWidth, 40);
  soundcanvas.id("soundCanvas");
  soundcanvas.parent('sounds');
  soundcanvas.style("border-radius", "4px");
  soundcanvas.drop(gotSound);
  graphicLIPSYNC = s.createGraphics(cnvWidth, 40);
  //soundBtn = createButton("toggle play / pause");
  //soundBtn.mousePressed(togglePlaySound);
  recordBtn = s.createButton("toggle record");
  recordBtn.mousePressed(fireRecord);
  recordBtn.parent('soundContainer');
  playRecBtn = s.createButton("toggle play ");
  playRecBtn.mousePressed(playRecord);
  playRecBtn.parent('soundContainer');




  clearLipBtn = s.createButton("clear lip");
  clearLipBtn.mousePressed(()=>{
    lipsync = [];
  });
  clearLipBtn.parent('soundContainer');

  videoSeekBtnL = createButton("< seek roto");
  videoSeekBtnL.touchStarted(seekFrameLeft);
  videoSeekBtnL.parent('soundContainer');

  videoSeekBtnR = createButton("seek roto >");
  videoSeekBtnR.touchStarted(seekFrameRight);
  videoSeekBtnR.parent('soundContainer');

  

  let checkSoundCanvas = document.getElementById("soundCanvas");
  checkSoundCanvas.addEventListener("mouseover", function(){
    // console.log("mouse is on canvas");
    mouseOnCanvas = true;
  });
  checkSoundCanvas.addEventListener("mouseout", function(){
    // console.log("mouse leave canvas");
    mouseOnCanvas = false;
  });

  soundcanvas.mousePressed(() => {
    if(keyIsDown(84)){
      //
    } else {
      startLipPath();
    }

  });

  soundcanvas.mouseReleased(() => {
    console.log("mouse released");
    if(keyIsDown(84)){
      trimming = false;
    } else {
      endLipPath();
    }
  });

  mic = new p5.AudioIn();
  mic.start();
  soundrecorder = new p5.SoundRecorder();
  soundrecorder.setInput(mic);
  soundFile = new p5.SoundFile();
  // s.noLoop();
}

s.mouseDragged = () => {
  if(mouseOnCanvas == true){
    // trimming = true;
    if(mouseIsPressed && mouseOnCanvas && letterTisDown == true){

      trimSound();

    }
  }
}

s.keyPressed = () => {
  return false;
}

s.draw = () => {

  if(soundrecording == true){
    s.background("red");
    s.text("recording... ", 14, 14);
  } else {
    s.background(220);
  }




  if(isDrawingLipSync){

    traceLipPath();
    graphicLIPSYNC.clear();
    //Shows the current BACKUP drawing if there any data in drawing array
    for (let i = 0; i < lipsync.length; i++) {
      let path = lipsync[i];
      if (lipsync[i].length != 0) {
        // beginShape();

        for (let j = 0; j < path.length; j++) {

          graphicLIPSYNC.stroke(84, 182, 233);
          graphicLIPSYNC.beginShape();
          graphicLIPSYNC.noFill();
          graphicLIPSYNC.curveVertex(path[j].x1, path[j].y1);
          graphicLIPSYNC.curveVertex(path[j].x2, path[j].y2);
          graphicLIPSYNC.curveVertex(path[j].x3, path[j].y3);
          graphicLIPSYNC.curveVertex(path[j].x4, path[j].y4);
          graphicLIPSYNC.endShape();
        }
      }
    }
  }

  s.image(graphicLIPSYNC, 0, 0, soundcanvas.width, soundcanvas.height);



  if(mouseIsPressed && mouseOnCanvas && letterTisDown == true){
    trimming = true;
  }





  soundFile.onended(function(){
    playingrecorded = false;
    // console.log("onended");
  });

  if(soundFile.buffer != null){



    if(soundFile._playing == true && mouseIsPressed == false){

      // convert float number to frame rate (fps) for current time
      let currentGetFloat = (soundFile.currentTime() % 1).toFixed(2).substring(2);
      let currentAtFrameRateFloat = Math.round(s.map(currentGetFloat, 0, 99, 1, fps));

      // update time displaying on sound canvas
      roundedCueText = Math.floor(soundFile.currentTime()) + "." + currentAtFrameRateFloat + " / " + Math.floor(soundFile.duration()) + "." + atFrameRateFloat;
      s.text(roundedCueText, 14, 14);

      // determinate position for cue line display on canvas sound
      linePos = Math.round(s.map(soundFile.currentTime(), 0, soundFile.duration(), 0, s.width));

      s.push();
        s.stroke("red");
        s.strokeWeight(2);
        s.line(linePos, 0, linePos, s.height);
      s.pop();

      if(playing == true){
        timelinePos = Math.floor(soundFile.currentTime()) * fps + currentAtFrameRateFloat;
        playClass.playWithSound(timelinePos);

      }



    } else if(soundFile._paused == true && mouseIsPressed == false) {
      //soundFile is paused

      let currentGetFloat = (soundFile.pauseTime % 1).toFixed(2).substring(2);
      let currentAtFrameRateFloat = Math.round(s.map(currentGetFloat, 0, 99, 1, fps));

      roundedCueText = Math.floor(soundFile.pauseTime) + "." + currentAtFrameRateFloat + " / " + Math.floor(soundFile.duration()) + "." + atFrameRateFloat;

      s.text(roundedCueText, 14, 14);

      linePos = Math.round(s.map(soundFile.pauseTime, 0, soundFile.duration(),0, s.width));
      s.push();
        s.stroke("blue");
        s.strokeWeight(2);
        s.line(linePos, 0, linePos, s.height);
      s.pop();

    } else if (trimming == true && mouseIsPressed && mouseOnCanvas == true){
      let currentGetFloat = (cuePos % 1).toFixed(2).substring(2);
      let currentAtFrameRateFloat = Math.round(s.map(currentGetFloat, 0, 99, 1, fps));
      trimLinePos = Math.round(s.map(cuePos, 0, soundFile.duration(),0, s.width));
      roundedCueText = Math.floor(cuePos) + "." + currentAtFrameRateFloat + " / " + Math.floor(soundFile.duration()) + "." + atFrameRateFloat;
      s.text(roundedCueText, 14, 14);
      s.push();
        s.stroke("green");
        s.strokeWeight(2);
        s.line(trimLinePos, 0, trimLinePos, s.height);
      s.pop();
    } else if (soundFile._paused == false && soundFile._playing == false){
      let currentGetFloat = (cuePos % 1).toFixed(2).substring(2);
      let currentAtFrameRateFloat = Math.round(s.map(currentGetFloat, 0, 99, 1, fps));
      roundedCueText = Math.floor(cuePos) + "." + currentAtFrameRateFloat + " / " + Math.floor(soundFile.duration()) + "." + atFrameRateFloat;
      s.text(roundedCueText, 14, 14);
      s.push();
        s.stroke("green");
        s.strokeWeight(2);
        s.line(trimLinePos, 0, trimLinePos, s.height);
      s.pop();
    }
  }
}



function trimSound(){

  if(soundFile.buffer !== null){

    s.redraw();

    cuePos = s.map(s.mouseX, 0, s.width, 0, soundFile.duration());
    let currentGetFloat = (cuePos % 1).toFixed(2).substring(2);
    let currentAtFrameRateFloat = Math.round(s.map(currentGetFloat, 0, 99, 1, fps));

    timelinePos = Math.floor(cuePos) * fps + currentAtFrameRateFloat;
    console.log(timelinePos);
    soundFile.setLoop(false);
    soundFile.jump(cuePos, 0.1);

    playClass.keyShowWithSound(timelinePos);
  }

}

function gotSound(file){
  //console.log(file);
  soundFile = loadSound(file);
}



function fireRecord(){
  if (soundrecording == false && mic.enabled) {
    soundrecording = true;
    soundrecorder.record(soundFile);
  } else if (soundrecording == true){
    soundrecording = false;
    soundrecorder.stop();
    textDisplay = 0;
    // convert float number to frame rate (fps) for total duration
    getFloat = (soundFile.duration() % 1).toFixed(2).substring(2);
    atFrameRateFloat = Math.round(s.map(getFloat, 0, 99, 1, fps));

    totalSoundFrames = Math.floor(soundFile.duration()) * fps + atFrameRateFloat;
    //mySound = soundFile;
  }
  // s.redraw();
}

function playRecord(){
  if(soundFile.buffer != null){
    if(soundFile._playing == false){
      soundFile.play();
      // s.loop();
    } else {
      // currentCue = soundFile.currentTime();
      soundFile.pause();
      // s.noLoop();
      // s.redraw();
      console.log(soundFile.pauseTime);
      console.log(soundFile);

    }
  }

}

function startLipPath(){
  // s.loop();
  l_px = l_sx = l_ppx = s.mouseX;
  l_py = l_sy = l_ppy = s.mouseY;
  isDrawingLipSync = true;
  lipsync.push(currentLipPath);
  currentLipPath.splice(0, 1);
}

function traceLipPath(){
  if(isDrawingLipSync == true){
    let lipPoint = {
      x1: l_sx,
      y1: l_sy,
      x2: l_ppx,
      y2: l_ppy,
      x3: l_px,
      y3: l_py,
      x4: s.mouseX,
      y4: s.mouseY,
    }

    currentLipPath.push(lipPoint);

    l_sx = l_ppx;
    l_sy = l_ppy;
    l_ppx = l_px;
    l_ppy = l_py;
    l_px = s.mouseX;
    l_py = s.mouseY;


  }
}

function endLipPath(){

  isDrawingLipSync = false;
  currentLipPath = [];
  // s.noLoop();
}




}); // END P5 INSTANCE 'S'
