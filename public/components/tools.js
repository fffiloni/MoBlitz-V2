class Tools {
  createNewTool(icon, kind, id, touchStarted) {
    this.icon = icon;
    this.kind = kind;
    this.id = id;
    this.touchStarted = touchStarted;
    let newTool = createButton('<i class="fas ' + this.icon + '" style="font-size: 20px;"></i><br>' + kind);
    newTool.id(this.id);
    newTool.class('toolBtn');
    newTool.parent('toolsContainer');
    newTool.touchStarted(touchStarted)
  };

  selectPencilTool() {
    typeOfTool = 'trait';
    sliderStroke.value('3');
    strkVal = sliderStroke.value();
    getStrokeValue.html(strkVal);
    erasing = brushing = roughing = makingLine = false;
    penciling = true;
    setR = 0;
    sliderR.value(setR);
    setV = 0;
    sliderV.value(setV);
    setB = 0;
    sliderV.value(setV);
    //console.log("Eraser selected: " + erasing );
    $("#eraserBtn").removeClass("selectedEraser");
    $("#brushBtn").removeClass("selectedTool");
    $("#roughBtn").removeClass("selectedTool");
    $("#lineBtn").removeClass("selectedTool");
    $("#pencilBtn").addClass("selectedTool");

    consoleClass.newMessage('You are drawing on the front layer.', 'console', 0, 'feedback');
    redraw();
  };

  selectBrushTool() {
    typeOfTool = 'paint';
    sliderStroke.value('20');
    strkVal = sliderStroke.value();
    getStrokeValue.html(strkVal);
    erasing = roughing = makingLine = penciling = false;
    brushing = true;

    //console.log("Brush selected: " + brushing );
    $("#eraserBtn").removeClass("selectedEraser");
    $("#pencilBtn").removeClass("selectedTool");
    $("#roughBtn").removeClass("selectedTool");
    $("#lineBtn").removeClass("selectedTool");
    $("#brushBtn").addClass("selectedTool");

    consoleClass.newMessage('You are painting on the brush layer.', 'console', 0, 'feedback');
    redraw();
  };

  selectRoughTool() {
    typeOfTool = 'rough';
    sliderStroke.value('1');
    strkVal = sliderStroke.value();
    getStrokeValue.html(strkVal);
    erasing = brushing = penciling = makingLine = false;
    roughing = true;
    setR = 111;
    sliderR.value(setR);
    setV = 185;
    sliderV.value(setV);
    setB = 228;
    sliderB.value(setB);
    //console.log("Rough selected: " + roughing );
    $("#eraserBtn").removeClass("selectedEraser");
    $("#pencilBtn").removeClass("selectedTool");
    $("#brushBtn").removeClass("selectedTool");
    $("#lineBtn").removeClass("selectedTool");
    $("#roughBtn").addClass("selectedTool");

    consoleClass.newMessage('You are roughing on the rough layer.', 'console', 0, 'feedback');
    redraw();

  };

  selectLineTool() {
    if (ctrlGkeyPressed == false) {
      typeOfTool = 'line';
      sliderStroke.value('1');
      strkVal = sliderStroke.value();
      getStrokeValue.html(strkVal);
      erasing = brushing = penciling = roughing = false;
      makingLine = true;
      setR = 111;
      sliderR.value(setR);
      setV = 185;
      sliderV.value(setV);
      setB = 228;
      sliderB.value(setB);
      //console.log("Line Tracer selected: " + makingLine );
      $("#eraserBtn").removeClass("selectedEraser");
      $("#pencilBtn").removeClass("selectedTool");
      $("#brushBtn").removeClass("selectedTool");
      $("#roughBtn").removeClass("selectedTool");
      $("#lineBtn").addClass("selectedTool");

      consoleClass.newMessage('You are tracing straigth guidelines.', 'console', 0, 'feedback');
      updateScroll();
    } else if (ctrlGkeyPressed == true) {
      showGuidelines = !showGuidelines;
    }
    redraw();

  };

  selectSnapShotTool(){
    showSafetyLines = false;
    redraw();
    setTimeout(function() {
      save('snapshop-moblitz.jpg');
      showSafetyLines = true;
      redraw();
    }, 500);
  };

  toggleBGBtn(){
    if (darkmode == false) {
      setBG = 'rgb(37, 32, 39)';
      darkmode = !darkmode;
    } else {

      setBG = 'rgb(255, 255, 248)';
      darkmode = !darkmode;
    }
    redraw();
  }
}
