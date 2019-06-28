let waitSafeDelete = false;
let countPathOld, countPathNew;
let calcNbAfter;
let ableDelete = ableInsert = ableUpdate = ableDuplicate = false;

let insertedKey;
let previousKeyfromInsert = null;

let blank_data = [
  [{
    x1: 0, y1: 0, x2: 0, y2: 0, x3: 0, y3: 0, x4: 0, y4: 0, csR: 0, csV: 0, csB: 0, pressure: 0
  }]
];



class Frames {

  cleanUp() {
    predrawing = [];
    prepainting = [];
    preroughs = [];
    drawing = [];
    painting = [];
    roughs = [];
  }

  cleanTimelineElements(){
    //We clear the listing of drawings
    let elts = selectAll('.listing');
    for (let i = 0; i < elts.length; i++) {
      elts[i].remove();
    }
  }

  saveDrawing() {
    if(playing == false){

      waitDB = true;
      // waitFriendDB = true;

      console.log("——");
      console.log("We just fired 'saveDrawing'!");

      //We clear the listing of drawings
      framesClass.cleanTimelineElements();

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
      framesClass.cleanUp();

      //We put the timeline's cursors on the right spot
      timelinePos = storeKeys[0].length - 1;
      onionKey = storeKeys[0].length - 2;
      console.log("Timeline Position: " + timelinePos + " | Onion Position: " + onionKey);

      framesClass.clearOnion();

      console.log("Success! Your new frame has been saved!");
      consoleClass.newMessage('Frame has been saved! <br>Back on track for the next one !', 'console', 0, 'feedback');
      frameHasBeenSaved = true;
      framesClass.goVirgin();
      redraw();
    }
  };

  goVirgin() {
    //console.log("——");
    //console.log("We just fired 'clearDrawing'!");
    keyToUpdate = null;
    onVirginFrame = true;
    ableDelete = ableInsert = ableUpdate = false;
    $(".listing").removeClass("activedraw");
    $(".current").addClass("activelast");
    $(".changeBtn").addClass("disableAllBtn");

    //dataReady = [];
    framesClass.cleanUp();
    if(frameHasBeenSaved == true){
      backupDrawings = [];
      backupPaintings = [];
    } else {
      drawing = backupDrawings;
      painting = backupPaintings;
    }
    //console.log("Now, drawing array is very empty.");
    //console.log("We will next load the last drawing as an onion layer...");
    framesClass.clearOnion();
    timelinePos = storeKeys[0].length;
    // timelinePos = 0;
    onionPos = storeKeys[0].length - 1;
    postOnionPos = storeKeys[0].length + 1;
    document.getElementById('onionkey').value = storeKeys[0][onionPos];
    document.getElementById('postonionkey').value = storeKeys[0][postOnionPos];
    framesClass.showOnion();
    //console.log("Pad has been cleared. Back on track for next frame.");
    // selectPencilTool();
    redraw();
    if(folks.length > 0){
      let data ={
        folkID: yourID,
        layerID: currentLayerKey
      }
      socket.emit('clearForeign', data);
    }
  };

  clearPad() {
    if(onVirginFrame == true){
      backupDrawings = [];
      backupPaintings = [];
      framesClass.cleanUp();
    } else {
      backupDrawings = [];
      backupPaintings = [];
    }

    //dataReady = [];

    //console.log("Now, drawing array is very empty.");
    //console.log("We will next load the last drawing as an onion layer...");
    framesClass.clearOnion();
    // timelinePos = storeKeys[0].length;
    // onionPos = storeKeys[0].length - 1;
    // postOnionPos = storeKeys[0].length + 1;
    // document.getElementById('onionkey').value = storeKeys[0][onionPos];
    // document.getElementById('postonionkey').value = storeKeys[0][postOnionPos];
    framesClass.showOnion();
    //console.log("Pad has been cleared. Back on track for next frame.");
    // selectPencilTool();
    redraw();
    socket.emit('clearForeign', yourID);
  };

  showDrawing(key) {

    backupUpdatedDrawings = [];
    backupUpdatedPaintings = [];

    this.key = key;

    countPathNew = null;
    countPathOld = null;

    onVirginFrame = false;
    $("#updateButton").removeClass("disableAllBtn");
    //console.log("——");
    //console.log("We just fired 'showDrawing'!");
    if (key instanceof MouseEvent) {
      var key = this.id();
      // consoleClass.newMessage(key, 'console', 0, 'feedback');
      //console.log("The key is instance of MouseEvent");
      //console.log("Key: " + key);

      calcNbAfter = (storeKeys[0].length - 1) - (storeKeys[0].indexOf(key));
      //console.log("Nb of frames after the displayed one: " + calcNbAfter);

      $(".changeBtn").removeClass("disableAllBtn");
      ableDelete = true;
      ableUpdate = true;
      if (timelinePos != storeKeys[0].length - 1) {
        ableInsert = true;
      } else if (onVirginFrame) {
        ableInsert = false;
      }
    }

    if(folks.length > 0){
      // envoie aux sockets signal
      let data = {
        folkID: yourID,
        layerID: currentLayerKey,
        keyDisplayed: key
      }
      // let layerID = currentLayerKey;
      socket.emit('iamchangingkey', data);
    }


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
        // socket.emit('showForeign', key);
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

        countPathOld = drawing.length + painting.length + roughs.length;

        let check = backupUpdate.findIndex(i => i.key == keyToUpdate);
        if(check != -1){
          if(backupUpdate[check].content.backupDrawings != undefined){

            backupUpdate[check].content.backupDrawings.forEach((newpath, index) => {

              drawing.push(newpath);
              if(newpath.length != 0){
                backupUpdatedDrawings.push(newpath);
              } else {
                backupUpdate[check].content.backupDrawings.splice(index, 1);
              }


            });
          }
          if(backupUpdate[check].content.backupPaintings != undefined){

            backupUpdate[check].content.backupPaintings.forEach((newpath) => {

              painting.push(newpath);
              if(newpath.length != 0){
                backupUpdatedPaintings.push(newpath);
              } else {
                backupUpdate[check].content.backupPaintings.splice(index, 1);
              }

            });
          }
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
    if(playing == false){

      if (ableInsert == true) {

        if (calcNbAfter != 0) {

          waitDB = true;
          // waitFriendDB = true;

          let ref = database.ref(currentDB);

          let data = {
            name: "Sylvain",
            drawing: blank_data,
            painting: blank_data,
            roughs: blank_data,
            nearPrevKey: keyToUpdate
          };
          console.log("Pushing new frame");
          let result = ref.push(data, function(){
            console.log("We push the new inserted frames, virgin");
            insertedKey = result.key;

            let ref2 = database.ref(currentDB + keyToUpdate);
            ref2.once('value', function(data) {
              console.log("Updating childkeys");
              let dbData = data.val();
              if(dbData.childKeys){
                let childKeysArray = dbData.childKeys;
                // console.log(childKeysArray)
                childKeysArray.push(insertedKey)
                // console.log(childKeysArray)
                ref2.update({childKeys: childKeysArray}, terminado);
              } else {
                ref2.update(
                  {childKeys: [insertedKey]}, terminado);
                }
              });

            });


            function terminado(){
              //When everything is saved in DB, we clear all the arrays
              framesClass.cleanUp();

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
              framesClass.showOnion();
            }


          }
        }
    }
  };


  duplicateFrame(){
    if(playing == false){

      if(ableDuplicate == true){

        // waitDB = true;
        // waitFriendDB = true;

        let ref = database.ref(currentDB);

        let data = {
          name: "Sylvain",
          drawing: drawing,
          painting: painting,
          roughs: roughs,
          nearPrevKey: keyToUpdate
        };

        console.log("We push data in the DB.");
        let result = ref.push(data);
        insertedKey = result.key;

        let ref2 = database.ref(currentDB + keyToUpdate);
        ref2.once('value', function(data) {
          console.log("We update childkeys.");
          let dbData = data.val();
          if(dbData.childKeys){
            let childKeysArray = dbData.childKeys;
            console.log(childKeysArray)
            childKeysArray.push(insertedKey)
            console.log(childKeysArray)
            ref2.update({childKeys: childKeysArray}, terminado2)
          } else {
            ref2.update(
              {childKeys: [insertedKey]}, terminado2
            );
          }
        });

        function terminado2(){
          //When everything is saved in DB, we clear all the arrays
          framesClass.cleanUp();
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
          framesClass.showOnion();
        };


      }
    }
  };

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
    if(playing == false){

      // waitFriendDB = true;
      if (ableDelete == true) {

        console.log("——");
        console.log("Init Deleting operations ...");

        if (keyToUpdate !== null && timelinePos !== 0) {

          let keyToDelete = keyToUpdate;
          timelinePos = storeKeys[0].indexOf(keyToUpdate) - 1;
          onionPos = timelinePos - 1;
          document.getElementById('onionkey').value = storeKeys[0][onionPos];
          postOnionPos = timelinePos + 1;
          document.getElementById('postonionkey').value = storeKeys[0][postOnionPos];


          let delRef = database.ref(currentDB + keyToDelete);
          delRef.once('value', makeSafetyTransfer);

          function makeSafetyTransfer(data){
            waitSafeDelete = true; //Prevent gotData
            let keyData = data.val();
            checkParent(keyData)
            .then(checkChildren(keyData))
            .then(finalDeleteOperations());
          };

          async function checkParent(keyData){
            // NOTE : on s'occupe ici des clefs parents
            console.log("1. check for parent ?")
            if (keyData.nearPrevKey){
              console.log("frame has a parent: " + keyData.nearPrevKey);

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
                console.log("Deleting childkey in old parent");

                spliceRef.update({childKeys: keyParentArray}, function(){
                  // console.log("try to do not fire got data")
                }); //A REACTIVER APRES
              }
            } else {
              console.log("Frame do not have parent");
            }
          };

          async function checkChildren(keyData){
            //NOTE : on s'occupe ici des clefs enfants
            console.log("2. check for children ?");
            if (keyData.childKeys){
              console.log("frame has children: " + keyData.childKeys);
              let findPrevKey = storeKeys[0][storeKeys[0].indexOf(keyToDelete) - 1];
              console.log("assign a new parent: " + findPrevKey);

              let transferRef = database.ref(currentDB + findPrevKey);
              transferRef.once('value', weDispatch);

              function weDispatch(data3){
                console.log("fonction dispatch, Updating new parent childkeys");
                let newParentData = data3.val();
                if (newParentData.childKeys != null){
                  console.log("new parent has children already");
                  let newParentArray = newParentData.childKeys;
                  for (let child of keyData.childKeys ){
                    newParentArray.push(child);
                  };
                  transferRef.update({childKeys: newParentArray}, () => {
                    console.log("new parent adopted new children")
                  });
                }
                else {
                  console.log("new parent is not a parent yet");
                  transferRef.update({childKeys: keyData.childKeys}, () => {
                    console.log("new parent adopted its first children")
                  });
                }

                for (let child of keyData.childKeys ){
                  // console.log(child);
                  let updateChildRef = database.ref(currentDB + child);
                  console.log("Updating new parent for children");
                  updateChildRef.update({nearPrevKey: findPrevKey}, function(){
                    // console.log("try to do not fire got data")
                  });
                }
              }

            } else {
              console.log("je n'ai pas d'enfants ");
            }
          };

          async function finalDeleteOperations() {
            waitSafeDelete = false; // Allow gotData
            console.log("J'ai fini de checker");
            console.log("FInally deleting");
            waitSafeDelete = false;
            delRef.remove();
            console.log("SUCCESS! THE FRAME HAS BEEN DELETED!");

            consoleClass.newMessage('You deleted a frame.', 'console', 0, 'feedback');
            let findpaintkey = paintGraphicStock.findIndex(k => k.key == keyToUpdate);
            paintGraphicStock.splice(findpaintkey, 1);
            console.log("We now display the previous one in the TL...");
            framesClass.showDrawing(storeKeys[0][timelinePos]);

          }


        } else {
          //console.log("You need to load a frame, before deleting.");
          console.log("Deleting frame is not allowed");
        }

        redraw();

      }
    }
  };

  updateFrame() {
    if(playing == false){

      if (keyToUpdate === null || keyToUpdate === undefined || timelinePos == 0) { //do nothing
      } else {

        countPathNew = drawing.length + painting.length + roughs.length;

        if(countPathNew != countPathOld || eraserUsed == true){
          $("#" + keyToUpdate).removeClass("activedraw");
          $("#" + keyToUpdate).addClass("isupdatingdraw");
          // setTimeout(function(){

            //console.log("——");
            //console.log("We just updated the frame key: " + keyToUpdate);

            let updRef = database.ref(currentDB + keyToUpdate);

            console.log('je clique update');
            let data;
            if (countPathNew < 3){
              data = {
                name: "Sylvain",
                drawing: blank_data,
                painting: blank_data,
                roughs: blank_data
              };
            } else {
              data = {
                name: "Sylvain",
                drawing: drawing,
                painting: painting,
                roughs: roughs
              };
            }


            updRef.update(data);
            //console.log("Now trying to fire oneDrawing ?");
            // storeKeys.splice(0, 1);
            eraserUsed = false;
            countPathNew = null;
            countPathOld = null;
            let check = backupUpdate.findIndex(i => i.key == keyToUpdate);
            if(check != 1){
              backupUpdate.splice(check, 1);
            }
            backupUpdatedDrawings = [];
            backupUpdatedPaintings = [];
            $("#updateButton").addClass("disableBtn");
            $("#" + keyToUpdate).removeClass("isupdatingdraw");
            $("#" + keyToUpdate).addClass("updateddraw");
            // setTimeout(function() {
              $("#" + keyToUpdate).removeClass("updateddraw");
              framesClass.showDrawing(keyToUpdate);
            // }, 100);
            $("#" + keyToUpdate).removeClass("needupdate");
            consoleClass.newMessage('You updated the frame.', 'console', 0, 'feedback', 'white');
          // }, 200);
        }


      }
      redraw();
    }

  };

  buttonsBehaviorOnFrameChanges(){
    if (maxIsReached == false) {
      $(".frameReady").removeClass("hideImportant");
      $(".saveButton").removeClass("hideImportant");
    } else {
      $(".frameReady").addClass("hideImportant");
      $(".saveButton").addClass("hideImportant");
    }

    if (calcNbAfter == 0) {
      $("#insertButton").addClass("disableBtn");
      ableInsert = false;
    } else {
      $("#insertButton").removeClass("disableBtn");
      ableInsert = true;
    }

    if (timelinePos == 0 || timelinePos == undefined){
      $("#duplicateButton").addClass("disableBtn");
      ableDuplicate = false;
    } else {
      $("#duplicateButton").removeClass("disableBtn");
      ableDuplicate = true;
    }

    if (countPathOld != countPathNew) {
      $("#saveButton").addClass("secondarySave");
      $("#updateButton").removeClass("disableBtn");
      ableUpdate = true;

    } else if (countPathNew == null) {

      $("#updateButton").removeClass("disableBtn");
      ableUpdate = true;
    } else {
      $("#saveButton").removeClass("secondarySave");
      $("#updateButton").addClass("disableBtn");
      ableUpdate = false;
    }

    if (eraserUsed == true) {
      $("#saveButton").addClass("secondarySave");
      $("#updateButton").removeClass("disableBtn");
    }

    if (onVirginFrame) {
      $("#saveButton").removeClass("secondarySave");
      // nbdrawingloaded = null;
      // nbdrawingupdated = null;
      ableInsert = false;
      ableDuplicate = false;
    }

    let check = backupUpdate.findIndex(i => i.key == keyToUpdate);
    if(check != -1){
      if(backupUpdate[check].content.backupDrawings != undefined){

        if(backupUpdate[check].content.backupDrawings.length != 0){
          $("#" + keyToUpdate).addClass("needupdate");
        }
      }
      if(backupUpdate[check].content.backupPaintings != undefined){

        if(backupUpdate[check].content.backupPaintings.length != 0){
          $("#" + keyToUpdate).addClass("needupdate");
        }
      }

      // if(backupUpdate[check].backupPaintings != undefined && backupUpdate[check].backupDrawings != undefined){
      //   if(backupUpdate[check].backupPaintings.length + backupUpdate[check].backupDrawings.length == 0){
      //     $("#" + keyToUpdate).removeClass("needupdate");
      //   }
      // }


    }

  };

}
