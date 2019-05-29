let canvas, cnvWidth, cnvHeight , expWidthF , expHeightF , expTopF , expLeftF, expWidthSq, expHeightSq, expTopSq, expLeftSq, expWidthSc, expHeightSc, expTopSc, expLeftSc;

let graphicBG, graphicFixed, graphicKeyPoses, graphicGuides, graphicOnion, graphicBrush, graphicRough, graphicFRONT, graphicDUO, graphicPrivateDUO;

class MagmaCanvas{

  ////////////////////////
  // INITIALIZATION
  ////////////////////////

  setMagmaCanvas(){

    if (device.mobile() == true) {
      cnvWidth = 405;
    } else if (device.tablet() == true) {
      cnvWidth = 800;
    } else {
      cnvWidth = 1000;
    }

    //console.log('device.tablet() === %s', device.tablet())

    cnvHeight = cnvWidth * 0.5625;

    canvas = createCanvas(cnvWidth, cnvHeight);
    canvas.parent('canvascontainer');
    pixelDensity(1);
    frameRate(24);
    noLoop();

    let formatTopWindow = document.getElementById('topwindow');
    formatTopWindow.style.width = "cnvWidth";
    let formatDrawingList = document.getElementById('drawinglist');
    formatDrawingList.style.width = "cnvWidth";

    $('#defaultCanvas0').bind('contextmenu', function(e) {
      return false;
    });

    canvas.touchStarted(drawClass.startPath);
    canvas.touchEnded(drawClass.safeEndPath);

  };

  // Note: pour jouer avec des background
  //   let getHeight = Math.round(bg.height /5);
  //   let getWidth = Math.round(bg.width /5);
  //
  // console.log(getHeight + ' / ' + getWidth);
  //   cnvWidth = getWidth;
  //   cnvHeight = getHeight;

  initializeExportFormat(){
    //FULL EXPORT
    expWidthF = cnvWidth - 40;
    expHeightF = cnvHeight - 40;
    expTopF = 20;
    expLeftF = 20;

    //SQUARE EXPORT
    expWidthSq = cnvHeight - 40;
    expHeightSq = cnvHeight - 40;
    expTopSq = 20;
    expLeftSq = 20 + ((cnvWidth - cnvHeight) / 2);

    //SCOPE EXPORT
    expWidthSc = cnvWidth - 40;
    expHeightSc = (cnvHeight / 6) * 4;
    expTopSc = (cnvHeight / 6);
    expLeftSc = 20;
  };

  initializeGraphics(){
    graphicBG = createGraphics(cnvWidth, cnvHeight);
    graphicBG.background(setBG);

    graphicFixed = createGraphics(cnvWidth, cnvHeight);
    graphicKeyPoses = createGraphics(cnvWidth, cnvHeight);
    graphicGuides = createGraphics(cnvWidth, cnvHeight);
    graphicOnion = createGraphics(cnvWidth, cnvHeight);
    graphicBrush = createGraphics(cnvWidth, cnvHeight);
    graphicRough = createGraphics(cnvWidth, cnvHeight);
    graphicFRONT = createGraphics(cnvWidth, cnvHeight);
  	graphicDUO = createGraphics(cnvWidth, cnvHeight);
    graphicPrivateDUO = createGraphics(cnvWidth, cnvHeight);
  };

  ////////////////////////
  // COVERED CANVAS
  ////////////////////////

  loadCoveredCanvas(){
    let chooseSlot = createDiv('');
    chooseSlot.id('chooseSlot');
    chooseSlot.parent('canvascontainer')
    chooseSlot.style('width', cnvWidth + 'px');
    chooseSlot.style('height', cnvHeight + 40 + 'px');

    let chooseSlotContent = createDiv('PLEASE CHOOSE A SEAT');
    chooseSlotContent.id('chooseSlotContent');
    chooseSlotContent.parent('chooseSlot');

    let loadingDiv = createDiv('');
    loadingDiv.id('loadingDiv');
    loadingDiv.parent('canvascontainer')
    loadingDiv.style('width', cnvWidth + 'px');
    loadingDiv.style('height', cnvHeight + 40 + 'px');

    let loadingContent = createDiv('We\'re loading your projects');
    loadingContent.id('loadingContent');
    loadingContent.parent('loadingDiv');

    let startDiv = createDiv('');
    startDiv.id('startSession');
    startDiv.parent('canvascontainer')
    startDiv.style('width', cnvWidth + 'px');
    startDiv.style('height', cnvHeight + 40 + 'px');

    let startContent = createDiv('');
    startContent.id('startContent');
    startContent.parent('startSession');



    socket.on('hello', () => {
      var params = getURLParams();
      // console.log(params);
      if (params.id) {
        socket.emit('join custom', params.id);
        let startButton = createButton('<i class="fas fa-power-off" style="font-size: 60px;"></i><br><br>Connect to Session<br>' + params.id);
        startButton.id('startButton');
        startButton.parent('startContent');
        startButton.touchStarted(connectDB);
      } else {
        let startButton = createButton('<i class="fas fa-power-off" style="font-size: 60px;"></i><br><br>Start Session');
        startButton.id('startButton');
        startButton.parent('startContent');
        startButton.touchStarted(connectDB);
      }
      let elts = selectAll('.feedback');
      for (let i = 0; i < elts.length; i++) {
        elts[i].remove();
      }
      consoleClass.newMessage('All system ready to rock!', 'console', 'connectFirst');
    });
  };

  safetyLinesBehavior(){
    if (showSafetyLines == true) {
      graphicBG.strokeWeight(0.5);
      //safetyborder square
      if (darkmode == true) {
        graphicBG.stroke(50);
      } else {
        graphicBG.stroke(230);
      }

      if (btnSquareOver) {
        graphicBG.stroke(0, 0, 255);
      }
      graphicBG.line(20 + ((cnvWidth - cnvHeight) / 2), 20, 20 + ((cnvWidth - cnvHeight) / 2), cnvHeight - 20); // gauche vertical
      graphicBG.line(canvas.width - 20 - ((cnvWidth - cnvHeight) / 2), 20, canvas.width - 20 - ((cnvWidth - cnvHeight) / 2), cnvHeight - 20); // droite vertical

      //safetyborder scope
      if (darkmode == true) {
        graphicBG.stroke(50);
      } else {
        graphicBG.stroke(230);
      }
      if (btnScopeOver) {
        graphicBG.stroke(0, 0, 255);
      }
      graphicBG.line(20, (cnvHeight - expHeightSc) / 2, cnvWidth - 20, (cnvHeight - expHeightSc) / 2); // haut horizontal
      graphicBG.line(20, cnvHeight - expTopSc, cnvWidth - 20, cnvHeight - expTopSc); //bas horizontal
      if (darkmode == true) {
        graphicBG.stroke(70);
      } else {
        graphicBG.stroke(180);
      }
      //cross line(x1,y1,x2,y2)
      graphicBG.line(cnvWidth / 2, 20, cnvWidth / 2, cnvHeight - 20);
      graphicBG.line(20, cnvHeight / 2, cnvWidth - 20, cnvHeight / 2);
      //safetyborder full
      if (darkmode == true) {
        graphicBG.stroke(50);
      } else {
        graphicBG.stroke(150);
      }
      if (btnFullOver) {
        graphicBG.stroke(0, 0, 255);
      }
      graphicBG.line(20, 20, canvas.width - 20, 20);
      graphicBG.line(20, canvas.height - 20, canvas.width - 20, canvas.height - 20);
      graphicBG.line(20, 20, 20, canvas.height - 20);
      graphicBG.line(canvas.width - 20, 20, canvas.width - 20, canvas.height - 20);
    }
  }
}
