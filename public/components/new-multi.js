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

      graphicBrush.clear();
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
    graphicBrush.clear();
    tracerClass.tracePainting();
  }

  if (showRoughs) {
    graphicRough.clear();
    tracerClass.traceRoughs();
  }

  if (showDrawingLayer) {
    graphicFRONT.clear();
    tracerClass.traceDrawings();
  }


}
