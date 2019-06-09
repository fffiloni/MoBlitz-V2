let waitDB = false;
let waitFriendDB = false;

let currentEnsemble = null;
let storeEnsembles = [];

let storeProjects = [[]];
let maxProjects = 2;

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

      function move(arr, old_index, new_index) {
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
              move(tempKeys, movingKey, arrivalKey);

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

  gotFriendData(data) {
    if(waitFriendDB != true){
      if(waitSafeDelete == false){
        console.log("—— gotFriendData fired.");

        ableDelete = false;
        waitFriendDB = true;
        let elts = selectAll('.listing-friend');
        for (let i = 0; i < elts.length; i++) {
          elts[i].remove();
        }

        console.log("We have new data from Friend Database!");
        waitFriendDB = false;

        //console.log("We updated the timeline (listing).");
        let drawings = data.val();
        let keys = Object.keys(drawings);
        // console.log("keys from db: " + keys);

        function move(arr, old_index, new_index) {
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
        return orderFriendKeys(keys).then(displayFriendKeys(friendTempKeys));

        async function orderFriendKeys (keys){
          console.log("async function friend orderKeys");
          waitSafeDelete = true;
          friendTempKeys = keys;
          for (let k of friendTempKeys){
            let ref = database.ref(friendDB + k);
            ref.once('value', moveFriendKey, dbTalkClass.errData);

            function moveFriendKey(data){

              let dbdrawing = data.val();

              if (dbdrawing.nearPrevKey != null){
                let wichkey = keys.indexOf(dbdrawing.nearPrevKey);

                console.log("j'ai trouvé une clefs d'insertion!: "+ wichkey);
                // let calculateDiff = key.indexOf(k) - wichkey;
                let movingKey = keys.indexOf(k);
                let arrivalKey = wichkey + 1;
                move(friendTempKeys, movingKey, arrivalKey);
                // console.log("tempKeys array: " + tempKeys)
                movingKey = null;
                arrivalKey = null;
              } else {
                //do as usual
              }

            };
          };
        };


        async function displayFriendKeys(friendTempKeys){
          console.log("async function friend displayKeys");
          waitSafeDelete = false;
          storeKeysFriend.push(friendTempKeys);
          if (storeKeysFriend.length > 1) {
            storeKeysFriend.splice(0, 1)
          };

          friendTempKeys = null;

          for (let i = 0; i < storeKeysFriend[0].length; i++) {
            let key = storeKeysFriend[0][i];
            console.log("CREATING SPAN FOR FRAMES FRIENDS");
            let span = createElement('span');
            span.id(key);
            let ahref = createA('javascript:', '');
            ahref.class('listing-friend');
            ahref.id(key);

              ahref.mouseOver(showPrivateAnimFriend);


            ahref.touchStarted(framesClass.showPrivateDrawingFriend);

            span.parent(ahref);
            ahref.parent('drawinglist-friend');
          }

          ableDelete = true;

        };
      } else {
        console.log("wait for safety delete")
      }

    } else {

      console.log(" waitFriendDB is TRUE, we have to wait ")}

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
      // //console.log("New DB created with this key: " + result.key);
      // currentDB = currentEnsemble + '/' + result.key + '/drawings/';
      // storeKeys = [];
      // //console.log("We tried to create a new DB Branche");
      // let ref2 = database.ref(currentDB);
      // ref2.on('value', dbTalkClass.gotData, dbTalkClass.errData);

      newdbKeys.push(result.key);
      let thisDB = newdbKeys[newdbKeys.indexOf(result.key)].toString();


    //   // /// SLOTS ///
    //
    //   if(currentLayerKey != undefined){
    //     let indexOld = slots.findIndex(i => i.db == currentLayerKey);
    //     slots[indexOld].status = "free";
    //     slots[indexOld].user = undefined;
    //   };
    //
    //   currentLayerKey = result.key;
    //
    //   let slotStatus = {
    //     db: result.key,
    //     status: 'free',
    //     user: undefined
    //   };
    //   slots.push(slotStatus);
    //
    //
    }

  } //Closing createNewDB function

  loadOneOfDBs(dbkey) {


    $("#substitute").removeClass("hide");
    console.log("Je charge loadOneOfDBs");

    let testDBKEY = currentEnsemble + '/' + dbkey + "/drawings/";
    let index = slots.findIndex(i => i.db == dbkey);

    if (currentDB == testDBKEY) {
      console.log('same db key');
    } else {
        console.log('not same');
        if(slots[index].status === 'not free'){
          console.log("slots is occupied, you can't join this layer");
          consoleClass.newMessage("This slot is already occupied, choose a white one.", 'console', 0, 'feedback');
        } else {
            // CLOSING PREVIOUS CALLBACK REFERENCE FOR FIREBASE
            if(refFriend != undefined){
              refFriend.off('value', dbTalkClass.gotFriendData);
            }

            if(refDB != undefined){
              refDB.off('value', dbTalkClass.gotData);
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


              /// slots update status ////

              if(currentLayerKey != undefined){
                let indexOld = slots.findIndex(i => i.db == currentLayerKey);
                slots[indexOld].status = "free";
                slots[indexOld].user = undefined;
              };

              currentLayerKey = dbkey;
              slots[index].status = "not free";
              slots[index].user = yourID;

              slots.forEach(function(slot, index){
                console.log(slot.db + " : " + slot.status + " | user: " + slot.user)

                if(slot.db !== currentLayerKey){
                  friendLayerKey = slot.db;
                  console.log("Friend layer is: " + friendLayerKey)
                  storeKeysFriend = [];
                  friendDB = currentEnsemble + '/' + friendLayerKey + '/drawings/';

                  // waitFriendDB = false;
                  refFriend = database.ref(friendDB);

                  refFriend.on('value', dbTalkClass.gotFriendData, dbTalkClass.errData);

                } else {
                  console.log("Your layer is: " + slot.db)
                }
              });

              socket.emit('update slots array abroad', slots);
            }

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
    if (nbPeopleInRoom == 1){
      slots = [];
    }
    let projects = data.val();
    let keys = Object.keys(projects);
    storeProjects.splice(0, 1);
    storeProjects.push(keys);
    //console.log(storeProjects);
    for (let i = 0; i < storeProjects[0].length - 1; i++) {

      //Load folder for different layers/sequences
      consoleClass.newMessage("<button class=\"project-folder\" id=\"" + storeProjects[0][i] + "\" ontouchstart=\"dbTalkClass.OfDBs('" + storeProjects[0][i] + "')\" onclick=\"dbTalkClass.loadOneOfDBs('" + storeProjects[0][i] + "')\"><i class=\"fas fa-user-circle\"></i></button>", 'folder-container');

      let createSlotButton = createDiv("<button class=\"start-slot-choice " + storeProjects[0][i] + "\" ontouchstart=\"dbTalkClass.OfDBs('" + storeProjects[0][i] + "')\" onclick=\"dbTalkClass.loadOneOfDBs('" + storeProjects[0][i] + "')\"><i class=\"fas fa-user-circle\"></i></button>");
      createSlotButton.parent(slotsButton);

      if(nbPeopleInRoom == 1){
        // if we are alone
        let slotData = {db: storeProjects[0][i], status: 'free'};
        slots.push(slotData);
        // dbTalkClass.loadOneOfDBs(slotData.db);
        console.log("test")
      } else if (nbPeopleInRoom > 1){
        // if we are NOT alone
        let index = slots.findIndex(finder => finder.db == storeProjects[0][i]);

        if (slots[index].status === 'not free'){
            $("#" + storeProjects[0][i]).addClass("occupiedFolder");
            $("." + storeProjects[0][i]).addClass("occupiedFolder");
        } else {
          $("#" + storeProjects[0][i]).removeClass("occupiedFolder");
        }
        // dbTalkClass.loadOneOfDBs(slots[1].db);
      }


    }
    console.log("Slots available: ");
    slots.forEach(function(slot, index){
      console.log(slot.db + " : " + slot.status + " | user: " + slot.user)
    })


  }
}
