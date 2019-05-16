class Frames {


  saveDrawing() {
    let blank_data = [
      [{
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
        x3: 0,
        y3: 0,
        x4: 0,
        y4: 0,
        csR: 0,
        csV: 0,
        csB: 0,
        pressure: 0
      }]
    ];
    console.log("——");
    console.log("We just fired 'saveDrawing'!");
    //We clear the listing of drawings
    let elts = selectAll('.listing');
    for (let i = 0; i < elts.length; i++) {
      elts[i].remove();
    }

    let ref = database.ref(currentDB);
    let data;

    if (drawing[0] == null && painting[0] == null && roughs[0] == null) {
      console.log("No data found, so we set default value to avoid breaking.");
      data = {
        name: "Sylvain",
        drawing: blank_data,
        painting: blank_data,
        roughs: blank_data
      }
    } else if (painting[0] == null && roughs[0] != null && drawing[0] != null) {
      console.log("No painting found, so we set default value to avoid breaking.");
      data = {
        name: "Sylvain",
        drawing: drawing,
        painting: blank_data,
        roughs: roughs
      }
    } else if (drawing[0] == null && roughs[0] != null && painting[0] != null) {
      console.log("No drawing found, so we set default value to avoid breaking.");
      data = {
        name: "Sylvain",
        drawing: blank_data,
        painting: painting,
        roughs: roughs
      }
    } else if (roughs[0] == null && drawing[0] != null && painting[0] != null) {
      console.log("No drawing nor painting found, so we set default value to avoid breaking.");
      data = {
        name: "Sylvain",
        drawing: drawing,
        painting: painting,
        roughs: blank_data
      }
    } else if (roughs[0] == null && drawing[0] == null && painting[0] != null) {
      console.log("No drawing nor roughs found, so we set default value to avoid breaking.");
      data = {
        name: "Sylvain",
        drawing: blank_data,
        painting: painting,
        roughs: blank_data
      }
    } else if (roughs[0] == null && painting[0] == null && drawing[0] != null) {
      console.log("No painting nor roughs found, so we set default value to avoid breaking.");
      data = {
        name: "Sylvain",
        drawing: drawing,
        painting: blank_data,
        roughs: blank_data
      }
    } else if (drawing[0] == null && painting[0] == null && roughs[0] != null) {
      console.log("No drawing nor painting found, so we set default value to avoid breaking.");
      data = {
        name: "Sylvain",
        drawing: blank_data,
        painting: blank_data,
        roughs: roughs
      }
    } else {
      console.log("Data OK | Setting data to be sent in DB.");
      data = {
        name: "Sylvain",
        drawing: drawing,
        painting: painting,
        roughs: roughs
      }
    }

    console.log("We push data in the DB.");
    storeKeys.splice(0, 1);
    let result = ref.push(data);
    console.log("We update the local storeKeys array.");
    storeKeys[0].push(result.key);
    storeKeys[0].splice(storeKeys[0].length - 1, 1);
    console.log("Let's see the content of 'storeKeys':");
    console.log(storeKeys);

    //When everything is saved in DB, we clear all the arrays

    predrawing = [];
    prepainting = [];
    preroughs = [];
    drawing = [];
    painting = [];
    roughs = [];
    //We put the timeline's cursors on the right spot
    timelinePos = storeKeys[0].length - 1;
    onionKey = storeKeys[0].length - 2;
    console.log("Timeline Position: " + timelinePos + " | Onion Position: " + onionKey);

    framesClass.clearOnion();
    ////console.log("spotted clearOnion");

    console.log("Success! Your new frame has been saved!");

    consoleClass.newMessage('Frame has been saved! <br>Back on track for the next one !', 'console', 0, 'feedback');

    framesClass.clearDrawing();
    redraw();

  };

  clearDrawing() {
    //console.log("——");
    //console.log("We just fired 'clearDrawing'!");
    keyToUpdate = null;
    onVirginFrame = true;
    ableDelete = false;
    ableInsert = false;
    ableUpdate = false;
    $(".listing").removeClass("activedraw");
    $(".current").addClass("activelast");
    $(".changeBtn").addClass("disableAllBtn");

    //dataReady = [];
    drawing = [];
    socket.emit('clearForeign');
    painting = [];
    roughs = [];
    //console.log("Now, drawing array is very empty.");
    //console.log("We will next load the last drawing as an onion layer...");
    framesClass.clearOnion();
    timelinePos = storeKeys[0].length;
    onionPos = storeKeys[0].length - 1;
    postOnionPos = storeKeys[0].length + 1;
    document.getElementById('onionkey').value = storeKeys[0][onionPos];
    document.getElementById('postonionkey').value = storeKeys[0][postOnionPos];
    framesClass.showOnion();
    //console.log("Pad has been cleared. Back on track for next frame.");
    // selectPencilTool();
    redraw();
  };

  showDrawing(key) {
    this.key = key;

    onVirginFrame = false;
    $("#updateButton").removeClass("disableAllBtn");
    //console.log("——");
    //console.log("We just fired 'showDrawing'!");
    if (key instanceof MouseEvent) {
      var key = this.id();
      //console.log("The key is instance of MouseEvent");
      //console.log("Key: " + key);

      let calcNbAfter = (storeKeys[0].length - 1) - (storeKeys[0].indexOf(key));
      //console.log("Nb of frames after the displayed one: " + calcNbAfter);
      frameAfter = [];
      drawingsToKeep = [];
      for (let i = storeKeys[0].indexOf(key) + 1; i < storeKeys[0].length; i++) {
        frameAfter.push(storeKeys[0][i]);
      }
      //console.log("Keys of frames remaining after: ");
      //console.log(frameAfter);
      $(".changeBtn").removeClass("disableAllBtn");
      ableDelete = true;
      ableUpdate = true;
      if (timelinePos != storeKeys[0].length - 1) {
        ableInsert = true;
      } else if (onVirginFrame) {
        ableInsert = false;
      }
    }

    // waitDB = true;
    let ref = database.ref(currentDB + key);
    //console.log("——");
    //console.log("We try to fire 'oneDrawing'.");
    ref.once('value', oneDrawing, dbTalkClass.errData);

    function oneDrawing(data) {
      if (!waitDB) {
        //console.log("It's OK, we don't have to wait for DB (waitDB is " + waitDB + ")");
        //console.log("oneDrawing success!");
        let dbdrawing = data.val();
        drawing = dbdrawing.drawing;
        painting = dbdrawing.painting;
        roughs = dbdrawing.roughs;
        keyToUpdate = key;
        if (dbdrawing.nearPrevKey){
          previousKeyfromInsert = dbdrawing.nearPrevKey;
        }
        //console.log("Key displayed: " + key);
        //console.log("Key to update loaded: " + keyToUpdate);
        //console.log("Let see the content of drawing array: ")
        //console.log(drawing);
        $(".current").removeClass("activelast");
        $(".listing").removeClass("activedraw");
        $("#" + previouskey).removeClass("braceFrame");
        $("#" + nextkey).removeClass("braceFrame");
        $("#" + key).addClass("activedraw");

        framesClass.clearOnion();
        //console.log("Onion Cleared");
        //console.log("Now updating TL and Onion positions...");

        //console.log("nb elements in drawing: " + drawing.length);
        nbdrawingloaded = drawing.length;
        nbdrawingupdated = drawing.length;
        if (painting != undefined && roughs != undefined) {
          //console.log("nb elements in painting: " + painting.length);
          nbpaintingloaded = painting.length;
          nbpaintingupdated = painting.length;
          //console.log("nb elements in roughs: " + roughs.length);
          nbroughsloaded = roughs.length;
          nbroughsupdated = roughs.length;
        }

        eraserUsed = false;
        timelinePos = storeKeys[0].indexOf(key);
        onionPos = timelinePos - 1;
        postOnionPos = timelinePos + 1;
        document.getElementById('onionkey').value = storeKeys[0][onionPos];
        document.getElementById('postonionkey').value = storeKeys[0][postOnionPos];
        //console.log('Index in storeKeys: ' + storeKeys[0].indexOf(key) + ' | Timeline Position: ' +  timelinePos + ' | Onion Position: ' + onionPos);
      } else {
        console.log("We wait for gotData ...");
      }

    }
    redraw();
  }

  newInsertFrame(){
    if (ableInsert == true) {
      if (0 != frameAfter.length) {

        waitDB = true;
        let elts = selectAll('.listing');
        for (let i = 0; i < elts.length; i++) {
          elts[i].remove();
        }

        let ref = database.ref(currentDB);
        let blank_data = [
          [{
            x1: 0, y1: 0, x2: 0, y2: 0, x3: 0, y3: 0, x4: 0, y4: 0, csR: 0, csV: 0, csB: 0, pressure: 0
          }]
        ];
        let data;
        data = {
          name: "Sylvain",
          drawing: blank_data,
          painting: blank_data,
          roughs: blank_data,
          nearPrevKey: keyToUpdate
        }

        let ref2 = database.ref(currentDB + keyToUpdate);
        // ref2.once('value', storeChildKey, dbTalkClass.errData);

        // function storeChildKey(data) {
          // if (!waitDB) {
            //console.log("It's OK, we don't have to wait for DB (waitDB is " + waitDB + ")");
            //console.log("oneOnion success!");

            // }}

            //console.log("We push data in the DB.");
            // storeKeys.splice(0, 1);
            let result = ref.push(data);
            insertedKey = result.key;


            ref2.once('value', function(data) {
              let dbData = data.val();
              if(dbData.childKeys){
                let childKeysArray = dbData.childKeys;
                // console.log(childKeysArray)
                childKeysArray.push(insertedKey)
                // console.log(childKeysArray)
                ref2.update({childKeys: childKeysArray})
              } else {
                ref2.update(
                  {childKeys: [insertedKey]}
                );
              }
            });
            // storeKeys[0].push(result.key);
            // storeKeys[0].splice(storeKeys[0].length - 1, 1);
            //Lignes audessus pas besoin car déjà fait dans gotData
            //console.log("We update the local storeKeys array.");

            //When everything is saved in DB, we clear all the arrays

            predrawing = [];
            prepainting = [];
            preroughs = [];
            drawing = [];
            painting = [];
            roughs = [];
            //We put the timeline's cursors on the right spot
            timelinePos = storeKeys[0].length - 1;
            onionKey = storeKeys[0].length - 2;
            //console.log("Timeline Position: " + timelinePos + " | Onion Position: " + onionKey );

            framesClass.clearOnion();
            ////console.log("spotted clearOnion");
            //console.log("Success! Your new frame has been inserted!");
            consoleClass.newMessage('You inserted an empty frame.', 'console', 0, 'feedback');

            framesClass.showDrawing(insertedKey);
            previouskey = storeKeys[0][storeKeys[0].indexOf(insertedKey) + 1];
            nextkey = storeKeys[0][storeKeys[0].indexOf(insertedKey) - 1];
            $("#" + previouskey).addClass("braceFrame");
            $("#" + nextkey).addClass("braceFrame");
            this.showOnion();
      }
    }
  };


  duplicateFrame(){
    if(ableDuplicate == true){

      waitDB = true;
      let elts = selectAll('.listing');
      for (let i = 0; i < elts.length; i++) {
        elts[i].remove();
      }

      let ref = database.ref(currentDB);
      let blank_data = [
        [{
          x1: 0, y1: 0, x2: 0, y2: 0, x3: 0, y3: 0, x4: 0, y4: 0, csR: 0, csV: 0, csB: 0, pressure: 0
        }]
      ];

      let data;

      if (drawing[0] == null && painting[0] == null && roughs[0] == null) {
        console.log("No data found, so we set default value to avoid breaking.");
        data = {
          name: "Sylvain",
          drawing: blank_data,
          painting: blank_data,
          roughs: blank_data,
          nearPrevKey: keyToUpdate
        }
      } else if (painting[0] == null && roughs[0] != null && drawing[0] != null) {
        console.log("No painting found, so we set default value to avoid breaking.");
        data = {
          name: "Sylvain",
          drawing: drawing,
          painting: blank_data,
          roughs: roughs,
          nearPrevKey: keyToUpdate
        }
      } else if (drawing[0] == null && roughs[0] != null && painting[0] != null) {
        console.log("No drawing found, so we set default value to avoid breaking.");
        data = {
          name: "Sylvain",
          drawing: blank_data,
          painting: painting,
          roughs: roughs,
          nearPrevKey: keyToUpdate
        }
      } else if (roughs[0] == null && drawing[0] != null && painting[0] != null) {
        console.log("No drawing nor painting found, so we set default value to avoid breaking.");
        data = {
          name: "Sylvain",
          drawing: drawing,
          painting: painting,
          roughs: blank_data,
          nearPrevKey: keyToUpdate
        }
      } else if (roughs[0] == null && drawing[0] == null && painting[0] != null) {
        console.log("No drawing nor roughs found, so we set default value to avoid breaking.");
        data = {
          name: "Sylvain",
          drawing: blank_data,
          painting: painting,
          roughs: blank_data,
          nearPrevKey: keyToUpdate
        }
      } else if (roughs[0] == null && painting[0] == null && drawing[0] != null) {
        console.log("No painting nor roughs found, so we set default value to avoid breaking.");
        data = {
          name: "Sylvain",
          drawing: drawing,
          painting: blank_data,
          roughs: blank_data,
          nearPrevKey: keyToUpdate
        }
      } else if (drawing[0] == null && painting[0] == null && roughs[0] != null) {
        console.log("No drawing nor painting found, so we set default value to avoid breaking.");
        data = {
          name: "Sylvain",
          drawing: blank_data,
          painting: blank_data,
          roughs: roughs,
          nearPrevKey: keyToUpdate
        }
      } else {
        console.log("Data OK | Setting data to be sent in DB.");
        data = {
          name: "Sylvain",
          drawing: drawing,
          painting: painting,
          roughs: roughs,
          nearPrevKey: keyToUpdate
        }
      }

      //console.log("We push data in the DB.");
      // storeKeys.splice(0, 1);
      let ref2 = database.ref(currentDB + keyToUpdate);

      let result = ref.push(data);
      insertedKey = result.key;

      ref2.once('value', function(data) {
        let dbData = data.val();
        if(dbData.childKeys){
          let childKeysArray = dbData.childKeys;
          console.log(childKeysArray)
          childKeysArray.push(insertedKey)
          console.log(childKeysArray)
          ref2.update({childKeys: childKeysArray})
        } else {
          ref2.update(
            {childKeys: [insertedKey]}
          );
        }
      });
      // storeKeys[0].push(result.key);
      // storeKeys[0].splice(storeKeys[0].length - 1, 1);
      //Lignes audessus pas besoin car déjà fait dans gotData
      //console.log("We update the local storeKeys array.");

      //When everything is saved in DB, we clear all the arrays

      predrawing = [];
      prepainting = [];
      preroughs = [];
      drawing = [];
      painting = [];
      roughs = [];
      //We put the timeline's cursors on the right spot
      timelinePos = storeKeys[0].length - 1;
      onionKey = storeKeys[0].length - 2;
      //console.log("Timeline Position: " + timelinePos + " | Onion Position: " + onionKey );

      framesClass.clearOnion();
      ////console.log("spotted clearOnion");
      //console.log("Success! Your new frame has been inserted!");
      consoleClass.newMessage('You duplicated a frame.', 'console', 0, 'feedback');

      framesClass.showDrawing(insertedKey);
      nextkey = storeKeys[0][storeKeys[0].indexOf(insertedKey) + 1];
      previouskey = storeKeys[0][storeKeys[0].indexOf(insertedKey)];
      $("#" + previouskey).addClass("braceFrame");
      // $("#" + nextkey).addClass("braceFrame");
      this.showOnion();
    }
  };


  // insertFrame() {
  //   if (ableInsert == true) {
  //     if (0 != frameAfter.length) {
  //       for (let frm of frameAfter) {
  //         //console.log("there is" + frm)
  //         let ref = database.ref(currentDB + frm);
  //         //console.log("We try to fire 'oneDrawing'.");
  //         ref.once('value', storeKept, dbTalkClass.errData);
  //
  //         function storeKept(data) {
  //           let dbdrawing = data.val();
  //
  //           // drawingsToKeep.push(dbdrawing.drawing);
  //           // paintingsToKeep.push(dbdrawing.painting);
  //           // roughsToKeep.push(dbdrawing.roughs);
  //           let keepAllData = {
  //             name: 'Sylvain',
  //             drawing: dbdrawing.drawing,
  //             painting: dbdrawing.painting,
  //             roughs: dbdrawing.roughs
  //           }
  //           dataToKeep.push(keepAllData);
  //         }
  //       }
  //       //console.log(drawingsToKeep);
  //
  //       //Note: Here we delete frame after, as we kept the data
  //       // setTimeout( function(){
  //
  //       for (let rmfrm of frameAfter) {
  //         let elts = selectAll('.listing');
  //         for (let i = 0; i < elts.length; i++) {
  //           elts[i].remove();
  //         }
  //         //console.log("——");
  //         //console.log("Deleting frame is not allowed");
  //
  //         let keyToDelete = rmfrm;
  //         //console.log("We want to delete " + keyToDelete);
  //         //console.log("TimelinePos: " + timelinePos);
  //         //console.log("OnionPos: " + onionPos);
  //         //console.log("SO we make safety operations ...");
  //         timelinePos -= 1;
  //         onionPos -= 1;
  //         postOnionPos - 1;
  //         document.getElementById('onionkey').value = storeKeys[0][onionPos];
  //         document.getElementById('postonionkey').value = storeKeys[0][postOnionPos];
  //
  //         //console.log("New TimelinePos: " + timelinePos);
  //         //console.log("New OnionPos: " + onionPos);
  //         waitDB = true;
  //         let delRef = database.ref(currentDB + keyToDelete);
  //         delRef.remove();
  //
  //         let indexKeyToSplice = storeKeys[0].indexOf(keyToDelete);
  //         storeKeys[0].splice(indexKeyToSplice, 1);
  //         storeKeys.splice(1, 1);
  //         //console.log("SUCCESS! THE FRAME HAS BEEN DELETED!");
  //         //console.log("We now display the previous one in the TL...");
  //         // showDrawing(storeKeys[0][timelinePos]);
  //         //clearOnion();
  //
  //       }
  //       // }, 200);
  //
  //       //Note: here we insert a blank frame
  //       // setTimeout(function(){
  //       waitDB = true;
  //       let elts = selectAll('.listing');
  //       for (let i = 0; i < elts.length; i++) {
  //         elts[i].remove();
  //       }
  //
  //       let ref = database.ref(currentDB);
  //       let blank_data = [
  //         [{
  //           x1: 0,
  //           y1: 0,
  //           x2: 0,
  //           y2: 0,
  //           x3: 0,
  //           y3: 0,
  //           x4: 0,
  //           y4: 0,
  //           csR: 0,
  //           csV: 0,
  //           csB: 0,
  //           pressure: 0
  //         }]
  //       ];
  //       let data;
  //       data = {
  //         name: "Sylvain",
  //         drawing: blank_data,
  //         painting: blank_data,
  //         roughs: blank_data
  //       }
  //
  //       //console.log("We push data in the DB.");
  //       storeKeys.splice(0, 1);
  //       let result = ref.push(data);
  //       insertedKey = result.key;
  //       storeKeys[0].push(result.key);
  //       storeKeys[0].splice(storeKeys[0].length - 1, 1);
  //       //console.log("We update the local storeKeys array.");
  //
  //       //When everything is saved in DB, we clear all the arrays
  //
  //       predrawing = [];
  //       prepainting = [];
  //       preroughs = [];
  //       drawing = [];
  //       painting = [];
  //       roughs = [];
  //       //We put the timeline's cursors on the right spot
  //       timelinePos = storeKeys[0].length - 1;
  //       onionKey = storeKeys[0].length - 2;
  //       //console.log("Timeline Position: " + timelinePos + " | Onion Position: " + onionKey );
  //
  //       framesClass.clearOnion();
  //       ////console.log("spotted clearOnion");
  //       //console.log("Success! Your new frame has been inserted!");
  //       consoleClass.newMessage('You inserted an empty frame.', 'console', 0, 'feedback');
  //
  //
  //       // }, 200);
  //
  //
  //       // setTimeout(function(){
  //       waitDB = true;
  //       //Note: Here we repush data after process
  //       for (let kept of dataToKeep) {
  //         let elts = selectAll('.listing');
  //         for (let i = 0; i < elts.length; i++) {
  //           elts[i].remove();
  //         }
  //
  //         let ref = database.ref(currentDB);
  //         let data;
  //         data = {
  //           name: "Sylvain",
  //           drawing: kept.drawing,
  //           painting: kept.painting,
  //           roughs: kept.roughs
  //         }
  //
  //         //console.log("We push data in the DB.");
  //         storeKeys.splice(0, 1);
  //         let result = ref.push(data);
  //         storeKeys[0].push(result.key);
  //         storeKeys[0].splice(storeKeys[0].length - 1, 1);
  //         //console.log("We update the local storeKeys array.");
  //
  //         // When everything is saved in DB, we clear all the arrays
  //
  //         predrawing = [];
  //         prepainting = [];
  //         preroughs = [];
  //         drawing = [];
  //         painting = [];
  //         roughs = [];
  //         //We put the timeline's cursors on the right spot
  //         timelinePos = storeKeys[0].length - 1;
  //         onionKey = storeKeys[0].length - 2;
  //
  //         this.clearDrawing();
  //         this.showDrawing(insertedKey);
  //
  //
  //         let calcNbAfter = (storeKeys[0].length - 1) - (storeKeys[0].indexOf(insertedKey));
  //         //console.log("Nb of frames after the displayed one: " + calcNbAfter);
  //         frameAfter = [];
  //         dataToKeep = [];
  //         for (let i = storeKeys[0].indexOf(insertedKey) + 1; i < storeKeys[0].length; i++) {
  //           frameAfter.push(storeKeys[0][i]);
  //         }
  //         //console.log("frameAfter: " + frameAfter);
  //         //console.log("Timeline Position: " + timelinePos + " | Onion Position: " + onionKey );
  //
  //         // clearOnion();
  //         ////console.log("spotted clearOnion");
  //         framesClass.showDrawing(insertedKey);
  //         previouskey = storeKeys[0][storeKeys[0].indexOf(insertedKey) + 1];
  //         nextkey = storeKeys[0][storeKeys[0].indexOf(insertedKey) - 1];
  //         $("#" + previouskey).addClass("braceFrame");
  //         $("#" + nextkey).addClass("braceFrame");
  //         this.showOnion();
  //
  //
  //       }
  //       // }, 200);
  //     }
  //     redraw();
  //   }
  // };

  showOnion() {
    //console.log("——");
    //console.log("We just fired 'showOnion'!");

    let key = document.getElementById('onionkey').value;
    let postkey = document.getElementById('postonionkey').value;

    let ref = database.ref(currentDB + key);
    ref.on('value', oneOnion, dbTalkClass.errData);



    function oneOnion(data) {
      if (!waitDB) {
        //console.log("It's OK, we don't have to wait for DB (waitDB is " + waitDB + ")");
        //console.log("oneOnion success!");
        let dbonion = data.val();
        if (dbonion !== null) {
          predrawing.push(dbonion.drawing);
          prepainting.push(dbonion.painting);
          preroughs.push(dbonion.roughs);
        }
      } else {
        //console.log("We wait for DB info before showing OnionSkin.");
      }
      redraw();
    }

    if (onVirginFrame == true) {
      postkey = storeKeys[0][1];
      let ref2 = database.ref(currentDB + postkey);
      ref2.on('value', twoOnion, dbTalkClass.errData);
    } else {
      let ref2 = database.ref(currentDB + postkey);
      ref2.on('value', twoOnion, dbTalkClass.errData);
    }

    let ref2 = database.ref(currentDB + postkey);
    ref2.on('value', twoOnion, dbTalkClass.errData);

    function twoOnion(data) {
      if (!waitDB) {
        //console.log("It's OK, we don't have to wait for DB (waitDB is " + waitDB + ")");
        //console.log("oneOnion success!");
        let dbpostonion = data.val();
        if (dbpostonion !== null) {
          postdrawing.push(dbpostonion.drawing);
          postpainting.push(dbpostonion.painting);
          postroughs.push(dbpostonion.roughs);
        }

      } else {
        //console.log("We wait for DB info before showing OnionSkin.");
      }
      redraw();
    }

    $("#showOnion").addClass("hide");
    $("#clearOnion").removeClass("hide");
    onionDisplayed = true;
    redraw();
  };

  clearOnion() {
    onionDisplayed = false;
    prepainting = [];
    predrawing = [];
    preroughs = [];

    postpainting = [];
    postdrawing = [];
    postroughs = [];

    $("#clearOnion").addClass("hide");
    $("#showOnion").removeClass("hide");
    redraw();
  };


  deleteFrame() {


    if (ableDelete == true) {
      console.log("——");
      // console.log("Deleting frame is not allowed");
      if (keyToUpdate !== null && timelinePos !== 0) {
        let elts = selectAll('.listing');
        for (let i = 0; i < elts.length; i++) {
          elts[i].remove();
        }
        let keyToDelete = keyToUpdate;
        // console.log("We want to delete " + keyToDelete);
        // console.log("TimelinePos: " + timelinePos);
        // console.log("OnionPos: " + onionPos);
        // console.log("SO we make safety operations ...");
        timelinePos = storeKeys[0].indexOf(keyToUpdate) - 1;
        onionPos = timelinePos - 1;
        document.getElementById('onionkey').value = storeKeys[0][onionPos];
        postOnionPos = timelinePos + 1;
        document.getElementById('postonionkey').value = storeKeys[0][postOnionPos];


        // console.log("New TimelinePos: " + timelinePos);
        // console.log("New OnionPos: " + onionPos);
        // console.log("New post OnionPos: " + postOnionPos);

        let delRef = database.ref(currentDB + keyToDelete);
        delRef.once('value', makeSafetyTransfer);

        function makeSafetyTransfer(data){
          let keyData = data.val();
          // console.log(keyData);
          //NOTE : on s'occupe ici des clefs parents
          if (keyData.nearPrevKey){
            // console.log("j'ai un parent: " + keyData.nearPrevKey);

            let spliceRef = database.ref(currentDB + keyData.nearPrevKey);
            spliceRef.once('value', weUpdateChildKeys);

            function weUpdateChildKeys(data2){
              let keyParentData = data2.val();
              let keyParentArray = keyParentData.childKeys;
              let finder = keyToDelete;
              // console.log("voilà le tableau avec les enfants de mon parent " + keyParentData.childKeys + " index de la clef enfant la dedans: ");
              // console.log(keyParentData.childKeys.indexOf(finder));
              keyParentArray.splice(keyParentData.childKeys.indexOf(finder), 1);
              // console.log(keyParentArray);
              spliceRef.update({childKeys: keyParentArray}); //A REACTIVER APRES
            }
          } else {
            // console.log("je n'ai pas de parent");
          }
          //NOTE : on s'occupe ici des clefs enfants
          if (keyData.childKeys){
            // console.log("j'ai des enfants: " + keyData.childKeys);
            let findPrevKey = storeKeys[0][storeKeys[0].indexOf(keyToDelete) - 1];
            // console.log(findPrevKey);

            let transferRef = database.ref(currentDB + findPrevKey);
            transferRef.once('value', weDispatch);

            function weDispatch(){
              transferRef.update({childKeys: keyData.childKeys})
              for (let child of keyData.childKeys ){
                // console.log(child);
                let updateChildRef = database.ref(currentDB + child);
                updateChildRef.update({nearPrevKey: findPrevKey});
              }
            }

          } else {
            // console.log("je n'ai pas d'enfants ");
          }
        }

        // setTimeout(function(){
          delRef.remove();
          console.log("SUCCESS! THE FRAME HAS BEEN DELETED!");

          consoleClass.newMessage('You deleted a frame.', 'console', 0, 'feedback');

          console.log("We now display the previous one in the TL...");
          framesClass.showDrawing(storeKeys[0][timelinePos])
        // }, 200);


        //clearOnion();
      } else {
        //console.log("You need to load a frame, before deleting.");
        console.log("Deleting frame is not allowed");
      }
      redraw();
    }
  };

  updateFrame() {

    let blank_data = [
      [{
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
        x3: 0,
        y3: 0,
        x4: 0,
        y4: 0,
        csR: 0,
        csV: 0,
        csB: 0,
        pressure: 0
      }]
    ];
    if (keyToUpdate === null || keyToUpdate === undefined || timelinePos == 0) { //do nothing
    } else {

      $("#" + keyToUpdate).removeClass("activedraw");
      $("#" + keyToUpdate).addClass("isupdatingdraw");
      setTimeout(function(){

        //console.log("——");
        //console.log("We just updated the frame key: " + keyToUpdate);
        // waitDB = true;

        let updRef = database.ref(currentDB + keyToUpdate);

        updRef.once('value', keepToCompare, dbTalkClass.errData);

        function keepToCompare(dbdata) {

          console.log('je clique update');
          let data;
          if (drawing[0] == null && painting[0] == null && roughs[0] == null) {
            //console.log("No data found, so we set default value to avoid breaking.");
            data = {
              name: "Sylvain",
              drawing: blank_data,
              painting: blank_data,
              roughs: blank_data
            }
          } else if (painting[0] == null && roughs[0] != null && drawing[0] != null) {
            //console.log("No painting found, so we set default value to avoid breaking.");
            data = {
              name: "Sylvain",
              drawing: drawing,
              painting: blank_data,
              roughs: roughs
            }
          } else if (drawing[0] == null && roughs[0] != null && painting[0] != null) {
            //console.log("No drawing found, so we set default value to avoid breaking.");
            data = {
              name: "Sylvain",
              drawing: blank_data,
              painting: painting,
              roughs: roughs
            }
          } else if (roughs[0] == null && drawing[0] != null && painting[0] != null) {
            //console.log("No drawing found, so we set default value to avoid breaking.");
            data = {
              name: "Sylvain",
              drawing: drawing,
              painting: painting,
              roughs: blank_data
            }
          } else if (roughs[0] == null && drawing[0] == null && painting[0] != null) {
            //console.log("No drawing found, so we set default value to avoid breaking.");
            data = {
              name: "Sylvain",
              drawing: blank_data,
              painting: painting,
              roughs: blank_data
            }
          } else if (roughs[0] == null && painting[0] == null && drawing[0] != null) {
            //console.log("No drawing found, so we set default value to avoid breaking.");
            data = {
              name: "Sylvain",
              drawing: drawing,
              painting: blank_data,
              roughs: blank_data
            }
          } else if (drawing[0] == null && painting[0] == null && roughs[0] != null) {
            //console.log("No drawing found, so we set default value to avoid breaking.");
            data = {
              name: "Sylvain",
              drawing: blank_data,
              painting: blank_data,
              roughs: roughs
            }
          } else {
            //console.log("Data OK | Setting data to be sent in DB.");
            data = {
              name: "Sylvain",
              drawing: drawing,
              painting: painting,
              roughs: roughs
            }
          }

          let dbdrawing = dbdata.val();
          comparedrawing = dbdrawing.drawing;
          comparepainting = dbdrawing.painting;
          compareroughs = dbdrawing.roughs;

          // //console.log(updRef);
          if (comparedrawing.length != drawing.length || eraserUsed == true || comparepainting.length != painting.length || compareroughs.length != roughs.length) {
            let elts = selectAll('.listing');
            for (let i = 0; i < elts.length; i++) {
              elts[i].remove();
            }
            //console.log("Setting new data ...");

            updRef.update(data);
            //console.log("Now trying to fire oneDrawing ?");
            // storeKeys.splice(0, 1);
            eraserUsed = false;
            $("#updateButton").addClass("disableBtn");
            //$("#" + keyToUpdate).removeClass("isupdatingdraw");
            $("#" + keyToUpdate).addClass("updateddraw");
            setTimeout(function() {
              $("#" + keyToUpdate).removeClass("updateddraw");
              framesClass.showDrawing(keyToUpdate);
            }, 300);

            consoleClass.newMessage('You updated the frame.', 'console', 0, 'feedback', 'white');

            // selectPencilTool()

          } else {
            return;
            // showDrawing(keyToUpdate);
          }
        }
      }, 200);
    }
    redraw();
  };

}
