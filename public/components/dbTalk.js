class DBTalk {

  gotData(data) {

    console.log("—— gotData fired.");
    $("#substitute").remove();
    waitDB = true;
    let elts = selectAll('.listing');
    for (let i = 0; i < elts.length; i++) {
      elts[i].remove();
    }

    console.log("We have new data from Database!");
    waitDB = false;

    //console.log("We updated the timeline (listing).");
    let drawings = data.val();
    let keys = Object.keys(drawings);
    // console.log("keys from db: " + keys);
    let tempKeys = keys;

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

    for (let k of keys){
      let ref = database.ref(currentDB + k);
      ref.once('value', moveKey, dbTalkClass.errData);

      function moveKey(data){

        let dbdrawing = data.val();
        if (dbdrawing.nearPrevKey){
          let wichkey = keys.indexOf(dbdrawing.nearPrevKey);
          // let wichkey = dbdrawing.nearPrevKey;
          // console.log("j'ai trouvé une clefs d'insertion!: "+ wichkey);
          // let calculateDiff = key.indexOf(k) - wichkey;
          let movingKey = keys.indexOf(k);
          let arrivalKey = wichkey + 1;
          move(tempKeys, movingKey, arrivalKey);
          // console.log("tempKeys array: " + tempKeys)
          movingKey = null;
          arrivalKey = null;
        } else {
          //do as usual
        }
      }
    }

    storeKeys.push(tempKeys);
    if (storeKeys.length > 1) {
      storeKeys.splice(0, 1)
    };

    //on va utiliser insertedKey et keyToUpdate pour déplacer les clefs dimages insérées


    // //console.log("Let's see the content of 'storeKeys':");
    // //console.log(storeKeys);

    posKey = storeKeys[0][timelinePos];
    onionPos = storeKeys[0].length - 1;
    document.getElementById('onionkey').value = keys[onionPos];
    countFrames = storeKeys[0].length;
    if (countFrames == maxDraw) {
      maxIsReached = true;
    } else {
      maxIsReached = false;
    }
    //showOnion();
    //We load the list of drawings from DB
    for (let i = 0; i < tempKeys.length; i++) {
      let key = tempKeys[i];

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
    spancurrent.touchStarted(framesClass.clearDrawing);
    // clearDrawing();
    updateTLScroll();
    //clearDrawing(); à corriger car quand on update ça clear les autres.
  }

  errData() {
    ////console.log(err);
  }

  createNewEnsemble() {
    $("#loadingDiv").addClass("hide");
    let ref = database.ref('/');
    // let data;
    let newEnsemble = {
      ensemble: 'newEnsemble'
    };
    //console.log("We push data in the DB.");
    let result = ref.push(newEnsemble);
    //console.log("New DB created with this key: " + result.key);
    currentEnsemble = result.key;
    console.log('Key Ensemble: ' + currentEnsemble);
    let msgK = createP("<p>——</p>You created a new permanent session.");
    let perma = createA('?id=' + result.key, result.key);
    msgK.id('newEnsemblemsg');
    perma.addClass('permalink');
    msgK.parent('console');
    perma.parent('newEnsemblemsg');
    // msgK.addClass('feedback');
    updateScroll();
    let keyLink = createA('?id=' + result.key, '<i class="fas fa-key"></i>');
    keyLink.parent('keyEnsemble');
    keyLink.style('color', '#f2dd00')
  }

  //Note: function pour amorcer la creéation de nouvelles db
  createNewDB() {

    if (((newdbKeys.length) + (storeProjects[0].length - 1)) >= maxProjects || newdbKeys.length == maxProjects) {
      consoleClass.newMessage("<p>——</p>You reached the max number of projects allowed.", 'console', 0, 'feedback');
    } else if (newdbKeys.length == 0 || newdbKeys.length < maxProjects) {
      let elts = selectAll('.listing');
      for (let i = 0; i < elts.length; i++) {
        elts[i].remove();
      }
      //console.log("——");
      //console.log("We just fired 'createNewDB'!");
      let ref = database.ref('/' + currentEnsemble);
      let data;
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

      data = {
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
      //console.log("New DB created with this key: " + result.key);
      currentDB = currentEnsemble + '/' + result.key + '/drawings/';
      storeKeys = [];
      //console.log("We tried to create a new DB Branche");
      let ref2 = database.ref(currentDB);
      ref2.on('value', dbTalkClass.gotData, dbTalkClass.errData);

      newdbKeys.push(result.key);
      let thisDB = newdbKeys[newdbKeys.indexOf(result.key)].toString();
      //console.log("Database Key: " + thisDB);
      // let msg2 = createP("<p>——</p>You created a new project and its database.");
      // msg2.parent('console');
      // msg2.addClass('feedback');
      // updateScroll();


      consoleClass.newMessage("<p>——</p>You created a new project and its database.", 'console', 'newDBmsg', 'feedback');

      setTimeout(function() {
        consoleClass.newMessage("You can now draw on the Canvas with your mouse or, even better with your pen tablet!", 'console', 0, 'feedback')
      }, 100);
      setTimeout(function() {
        consoleClass.newMessage("After your first frame, click on the \"Save & Next\" button to save your drawing and continue to the next frame.", 'console', 0, 'feedback');
      }, 200);
      consoleClass.newMessage("<button class=\"project-folder\" id=\"" + thisDB + "\" ontouchstart=\"dbTalkClass.loadOneOfDBs('" + thisDB + "')\" onclick=\"dbTalkClass.loadOneOfDBs('" + thisDB + "')\"><i class=\"fas fa-folder\"></i></button>", 'folder-container');
      framesClass.clearDrawing();

      $(".project-folder").removeClass("currentFolder");
      $("#" + thisDB).addClass("currentFolder");
    }



  } //Closing createNewDB function

  loadOneOfDBs(dbkey) {
    $("#substitute").removeClass("hide");
    // clearDrawing();
    $(".project-folder").removeClass("currentFolder");
    $("#" + dbkey).addClass("currentFolder");
    let testDBKEY = currentEnsemble + '/' + dbkey + "/drawings/";
    if (currentDB == testDBKEY) {
      //console.log('same db key');
    } else {
      //console.log('not same');
      let elts = selectAll('.listing');
      for (let i = 0; i < elts.length; i++) {
        elts[i].remove();
      }
      storeKeys = [];
      // //console.log(storeKeys.length);
      currentDB = currentEnsemble + '/' + dbkey + '/drawings/';
      waitDB = true;
      let ref = database.ref(currentDB);
      ref.on('value', dbTalkClass.gotData, dbTalkClass.errData);
      consoleClass.newMessage("You switched database", 'console', 0, 'feedback');
      timelinePos = 0;

    }

  }

  loadParamDB(dbkey) {

    //console.log('not same');
    let elts = selectAll('.listing');
    for (let i = 0; i < elts.length; i++) {
      elts[i].remove();
    }
    storeKeys = [];
    // //console.log(storeKeys.length);
    currentEnsemble = dbkey;
    let msgK = createP("<p>——</p>You joined an existing permanent session.");
    let perma = createA('?id=' + dbkey, dbkey);
    msgK.id('gotEnsemblemsg');
    msgK.parent('console');
    perma.addClass('permalink');
    perma.parent('gotEnsemblemsg');
    msgK.addClass('msgFixed');
    updateScroll();
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

    $("#loadingDiv").addClass("hide");
    storeProjects = [];
    let projects = data.val();
    let keys = Object.keys(projects);
    storeProjects.splice(0, 1);
    storeProjects.push(keys);
    //console.log(storeProjects);
    for (let i = 0; i < storeProjects[0].length - 1; i++) {
      consoleClass.newMessage("<button class=\"project-folder\" id=\"" + storeProjects[0][i] + "\" ontouchstart=\"dbTalkClass.OfDBs('" + storeProjects[0][i] + "')\" onclick=\"dbTalkClass.loadOneOfDBs('" + storeProjects[0][i] + "')\"><i class=\"fas fa-folder\"></i></button>", 'folder-container');

    }
  }
}
