let waitDB = false;
let waitFriendDB = false;

let currentEnsemble = null;
let storeEnsembles = [];

let storeProjects = [[]];
let maxProjects = 3;

let currentDB = 'drawings/';
let refDB;
let tempKeys;
let friendTempKeys;
let storeKeys = [];
let storeKeysFriend = [];

let newdbKeys = [];
let storeSketches = [];

let slots = [];
let currentLayerKey = undefined;
let friendLayerKey = undefined;
let friendDB;
let refFriend;

let nbPeopleInRoom = 0;

let layersArray = [];
let referencesArray = [];


class DBTalk {

  connectDB(){
    socket.emit('connectDB');
    let rmbtn = document.getElementById('connectFirst');
    rmbtn.remove();
    // consoleClass.newMessage('You started a new Session! Enjoy! Bim!', 'console');
    $("#startSession").addClass("hide");
    toolClass.selectPencilTool();

  	let slotsButton = createDiv('');
  	slotsButton.id('slotsButton');
  	slotsButton.parent('chooseSlotContent');
  }

  move(arr, old_index, new_index) {
    while (old_index < 0) {
        old_index += arr.length;
    }
    while (new_index < 0) {
        new_index += arr.length;
    }
    if (new_index >= arr.length) {
        var k = new_index - arr.length;
        while ((k--) + 1) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr;
  }

  gotData(data) {

    if(waitSafeDelete == false){
      waitFriendDB = true;
      console.log("—— gotData fired.");
      $("#substitute").remove();
      ableDelete = false;
      waitDB = true;
      let elts = selectAll('.listing');
      for (let i = 0; i < elts.length; i++) {
        elts[i].remove();
      }

      console.log("We have new data from Database!");
      waitDB = false;

      let drawings = data.val();
      let keys = Object.keys(drawings);
      // console.log("keys from db: " + keys);

      return orderKeys(keys).then(displayKeys(tempKeys));

      // ASYNC FUNCTIONS FOR ORDERING AND DISPLAYING KEYFRAMES IN RIGTH ORDER
      // 1. ORDERING
      async function orderKeys (keys){
        console.log("async function orderKeys");
        waitSafeDelete = true;
        tempKeys = keys;

        for (let k of tempKeys){
          let ref = database.ref(currentDB + k);
          ref.once('value', moveKey, dbTalkClass.errData);

          function moveKey(data){
            let dbdrawing = data.val();

            if (dbdrawing.nearPrevKey != null){
              let wichkey = keys.indexOf(dbdrawing.nearPrevKey);
              console.log("j'ai trouvé une clefs d'insertion!: " + wichkey);

              let movingKey = keys.indexOf(k);
              let arrivalKey = wichkey + 1;
              dbTalkClass.move(tempKeys, movingKey, arrivalKey);

              movingKey = null;
              arrivalKey = null;
            } else {
              //do as usual
            }

          };
        };
      };

      // 2. DISPLAYING
      async function displayKeys(tempKeys){
        console.log("async function displayKeys");
        waitSafeDelete = false;
        storeKeys.push(tempKeys);
        if (storeKeys.length > 1) {
          storeKeys.splice(0, 1)
        };
        tempKeys = null;
        posKey = storeKeys[0][timelinePos];
        onionPos = storeKeys[0].length - 1;
        document.getElementById('onionkey').value = keys[onionPos];
        countFrames = storeKeys[0].length;
        if (countFrames == maxDraw) {
          maxIsReached = true;
        } else {
          maxIsReached = false;
        }

        //We load the list of drawings from DB
        for (let i = 0; i < storeKeys[0].length; i++) {
          let key = storeKeys[0][i];

          let span = createElement('span');
          span.id(key);
          let ahref = createA('javascript:', '');
          ahref.class('listing');
          ahref.id(key);

          ahref.mouseOver(showAnim);
          ahref.touchStarted(framesClass.showDrawing);


          span.parent(ahref);
          ahref.parent('drawinglist');
        }
        let spancurrent = createElement('span');
        spancurrent.class('listing current');
        spancurrent.parent('drawinglist');
        spancurrent.touchStarted(framesClass.goVirgin);

        ableDelete = true;
        waitFriendDB = false;
      };

    } else {
      console.log("wait for safety delete")
    }

  }


  errData() {
    ////console.log(err);
  }


  createNewEnsemble() {
    $("#loadingDiv").addClass("hide");
    let ref = database.ref('/');

    let newEnsemble = {
      ensemble: 'newEnsemble'
    };
    //console.log("We push data in the DB.");
    let result = ref.push(newEnsemble);
    //console.log("New DB created with this key: " + result.key);
    currentEnsemble = result.key;
    console.log('Key Ensemble: ' + currentEnsemble);

    socket.emit('join custom', result.key);
  }

  //Note: function pour amorcer la creéation de nouvelles db
  createNewDB() {

    if (((newdbKeys.length) + (storeProjects[0].length - 1)) >= maxProjects || newdbKeys.length == maxProjects) {
      consoleClass.newMessage("<p>——</p>You reached the max number of projects allowed.", 'console', 0, 'feedback');
    } else if (newdbKeys.length == 0 || newdbKeys.length < maxProjects) {
      //console.log("——");
      //console.log("We just fired 'createNewDB'!");
      let ref = database.ref('/' + currentEnsemble);
      let data = {
        name: "Sylvain",
        drawing: blank_data,
        painting: blank_data,
        roughs: blank_data
      }
      let blank_key = data;
      let drawings = {
        "-1blank_key": data
      };
      let newDB = {
        dbname: 'newDB',
        drawings: drawings
      }

      //console.log("We push data in the DB.");
      let result = ref.push(newDB);

      newdbKeys.push(result.key);
      let thisDB = newdbKeys[newdbKeys.indexOf(result.key)].toString();

      let slotData = {db: thisDB, status: 'free'};
      slots.push(slotData);
    }

  } //Closing createNewDB function

  loadOneOfDBs(dbkey) {

    layersArray.forEach(function(layerToClean){
      layerToClean.folderDrawings = [];
      layerToClean.currentDisplayKey = null;

    });
    redraw();

    $("#substitute").removeClass("hide");
    console.log("Je charge loadOneOfDBs");

    let testDBKEY = currentEnsemble + '/' + dbkey + "/drawings/";
    let index = slots.findIndex(i => i.db == dbkey);

    if (currentDB == testDBKEY) {
      console.log('same db key');
    } else {
        console.log('not same');

        if(referencesArray.length != 0){
          referencesArray.forEach(function(reference){
            let ref = reference.refToOff;
            ref.off();
          });
          referencesArray = [];
        }

        return partOneSwitch().then(partTwoSwitch());

        async function partOneSwitch(){
          console.log("fired Part One switch");
          $("#chooseSlot").addClass("hide");
          $(".project-folder").removeClass("currentFolder");
          $("#" + dbkey).addClass("currentFolder");

          framesClass.cleanTimelineElements();
          storeKeys = [];

          // //console.log(storeKeys.length);
          currentDB = currentEnsemble + '/' + dbkey + '/drawings/';

          waitDB = true;
          refDB = database.ref(currentDB);
          refDB.on('value', dbTalkClass.gotData, dbTalkClass.errData);
          consoleClass.newMessage("You switched slot", 'console', 0, 'feedback');
          timelinePos = 0;
        }

        async function partTwoSwitch(){
          console.log("fired Part Two switch");

          currentLayerKey = dbkey;

          layersArray.forEach(function(layer, index){

            $("#" + layer.folderKey + '-tl').remove();

            let someoneTL = createDiv('');
            someoneTL.id(layer.folderKey + '-tl');
            someoneTL.class(layer.folderKey);
            someoneTL.parent('someoneslist');

            let someoneDB = currentEnsemble + '/' + layer.folderKey + '/drawings/';
            let refSomeone = database.ref(someoneDB);

            let data = {
              layerKey: layer.folderKey,
              refToOff: refSomeone
            }

            referencesArray.push(data);

            refSomeone.on('value', function(data){

              let elts = selectAll('.listing-some-' + layer.folderKey);
              for (let i = 0; i < elts.length; i++) {
                elts[i].remove();
              }

              // console.log(data);
              console.log("someone number " + index + " has new data to show");

              let someoneTempKeys;

              let drawings = data.val();
              let keys = Object.keys(drawings);
              //console.log(keys);


              return orderSomeoneKeys(keys).then(displaySomeoneKeys(someoneTempKeys));

              // ASYNC FUNCTIONS FOR ORDERING AND DISPLAYING KEYFRAMES IN RIGTH ORDER
              // 1. ORDERING
              async function orderSomeoneKeys (keys){
                console.log("async function someone orderKeys");
                waitSafeDelete = true;
                someoneTempKeys = keys;

                for (let k of someoneTempKeys){
                  let ref = database.ref(someoneDB + k);
                  ref.once('value', moveSomeoneKey, dbTalkClass.errData);

                  function moveSomeoneKey(data){
                    let dbdrawing = data.val();

                    if (dbdrawing.nearPrevKey != null){
                      let wichkey = keys.indexOf(dbdrawing.nearPrevKey);
                      console.log("j'ai trouvé une clefs d'insertion!: " + wichkey);

                      let movingKey = keys.indexOf(k);
                      let arrivalKey = wichkey + 1;
                      dbTalkClass.move(someoneTempKeys, movingKey, arrivalKey);

                      movingKey = null;
                      arrivalKey = null;
                    } else {
                      //do as usual
                    }

                  };
                };
              };

              // 2. DISPLAYING
              async function displaySomeoneKeys(someoneTempKeys){
                console.log("async function someone displayKeys");
                waitSafeDelete = false;
                // if(someoneTempKeys.length == 1){
                //
                // }
                layer.storeKeysFolder = someoneTempKeys;
                // layer.currentDisplayKey = null;

                // socket.emit('initialOtherLayers', someone)
                // console.log(layer.folderKey + ' ' + layer.storeKeysFolder);
                for (let i = 1; i < someoneTempKeys.length; i++) {
                  let key = someoneTempKeys[i];

                  let span = createElement('span');
                  span.id(key);
                  let ahref = createA('javascript:', '');
                  ahref.class('listing-some-' + layer.folderKey);
                  ahref.id(key);
                  ahref.touchStarted(function(){
                    if(layer.currentDisplayKey == key){
                      layer.currentDisplayKey = null;
                      // console.log("same key man");
                      layer.folderDrawings = [];
                      $("#" + key).removeClass("private-activedraw-friend");
                      redraw();
                    } else {
                      layer.currentDisplayKey = key;
                      console.log(layer.currentDisplayKey);
                      let ref = database.ref(someoneDB + key);
                      ref.once('value', onePrivateSomeone, dbTalkClass.errData);
                      function onePrivateSomeone(data){
                        let dbdrawing = data.val();
                        layer.folderDrawings = dbdrawing.drawing;
                        $(".listing-some-" + layer.folderKey).removeClass("private-activedraw-friend");

                        $("#" + key).addClass("private-activedraw-friend");
                        redraw();
                      }
                    }
                  });
                  ahref.mouseOver(function(){
                    // if (key instanceof MouseEvent) {
                    //   let key = this.id();

                      if (optionPressed || ctrlFkeyPressed) {
                        if(layer.currentDisplayKey == key){
                          layer.currentDisplayKey = null;
                          // console.log("same key man");
                          layer.folderDrawings = [];
                          $("#" + key).removeClass("private-activedraw-friend");
                          redraw();
                        } else {
                          layer.currentDisplayKey = key;
                          console.log(layer.currentDisplayKey);
                          let ref = database.ref(someoneDB + key);
                          ref.once('value', onePrivateSomeone, dbTalkClass.errData);
                          function onePrivateSomeone(data){
                            let dbdrawing = data.val();
                            layer.folderDrawings = dbdrawing.drawing;
                            $(".listing-some-" + layer.folderKey).removeClass("private-activedraw-friend");

                            $("#" + key).addClass("private-activedraw-friend");
                            redraw();
                          }
                        }
                      }
                    // }
                  });
                  span.parent(ahref);
                  ahref.parent(someoneTL);

                  if(layer.currentDisplayKey != null){
                    $("#" + layer.currentDisplayKey).addClass("private-activedraw-friend");
                  }


                }
                if(layer.folderKey == currentLayerKey){
                  $("#" + layer.folderKey + '-tl').remove();
                }
                if(layer.storeKeysFolder.length == 1){
                  let sublayer = createElement('span');
                  sublayer.class('someone-empty');
                  sublayer.parent(someoneTL);
                }

              };
          });
        });
      }
    }
  }



  loadParamDB(dbkey) {

    //console.log('not same');
    framesClass.cleanTimelineElements();
    storeKeys = [];
    // //console.log(storeKeys.length);
    currentEnsemble = dbkey;
    // let msgK = createP("<p>——</p>You joined an existing permanent session.");
    let msgK = createP("<p>——</p>Share this link with a friend !");
    let perma = createA('?id=' + dbkey, dbkey);
    msgK.id('gotEnsemblemsg');
    msgK.parent('console');
    perma.addClass('permalink');
    perma.parent('gotEnsemblemsg');
    msgK.addClass('msgFixed');
    consoleClass.updateScroll();

    dbTalkClass.getEnsembleDBs();

    let keyLink = createA('?id=' + dbkey, '<i class="fas fa-key"></i>');
    keyLink.parent('keyEnsemble');
    keyLink.style('color', '#f2dd00')



  }


  cleanMBDB() {
    let ref = database.ref('/');
    ref.once('value', dbTalkClass.gotDataToClean2, dbTalkClass.errData);
  }

  gotDataToClean2(data) {

    let ensemblesKeys = data.val();
    let keys = Object.keys(ensemblesKeys);
    storeEnsembles.push(keys);
    //console.log(storeSketches);
    for (let i = 0; i < storeEnsembles[0].length - 1; i++) {
      //console.log(storeSketches[0][i] + ' : sketch removed.');
      let delRef = database.ref('/' + storeEnsembles[0][i]);
      delRef.remove();
    }
  }


  cleanDB() {
    let ref = database.ref('/' + currentEnsemble);
    ref.once('value', dbTalkClass.gotDataToClean, dbTalkClass.errData);
  }

  gotDataToClean(data) {

    let sketches = data.val();
    let keys = Object.keys(sketches);
    storeSketches.push(keys);
    //console.log(storeSketches);
    for (let i = 0; i < storeSketches[0].length - 1; i++) {
      //console.log(storeSketches[0][i] + ' : sketch removed.');
      let delRef = database.ref('/' + currentEnsemble + '/' + storeSketches[0][i]);
      delRef.remove();
    }
  }

  getEnsembleDBs() {
    let ref = database.ref('/' + currentEnsemble);
    ref.once('value', dbTalkClass.gotDBsToShow, dbTalkClass.errData);
  }

  gotDBsToShow(data) {
    console.log("fired GotDBToShow");
    $("#loadingDiv").addClass("hide");
    storeProjects = [];
    slots = [];

    let projects = data.val();
    let keys = Object.keys(projects);
    storeProjects.splice(0, 1);
    storeProjects.push(keys);


    for (let i = 0; i < storeProjects[0].length - 1; i++) {

      let slotData = {db: storeProjects[0][i], status: 'free'};
      slots.push(slotData);

      //Load folder for different layers/sequences
      consoleClass.newMessage("<button class=\"project-folder\" id=\"" + storeProjects[0][i] + "\" ontouchstart=\"dbTalkClass.OfDBs('" + storeProjects[0][i] + "')\" onclick=\"dbTalkClass.loadOneOfDBs('" + storeProjects[0][i] + "')\"><i class=\"fas fa-user-circle\"></i></button>", 'folder-container');

      let createSlotButton = createDiv("<button class=\"start-slot-choice " + storeProjects[0][i] + "\" ontouchstart=\"dbTalkClass.OfDBs('" + storeProjects[0][i] + "')\" onclick=\"dbTalkClass.loadOneOfDBs('" + storeProjects[0][i] + "')\"><i class=\"fas fa-user-circle\"></i></button>");
      createSlotButton.parent(slotsButton);

      // * TEST MULTI - On prepare un tableau pour display les differents folders/layers
      let oneLayer = {
        folderKey: storeProjects[0][i],
        storeKeysFolder: [],
        folderDrawings: []
      };
      layersArray.push(oneLayer);

    }
  }
}
