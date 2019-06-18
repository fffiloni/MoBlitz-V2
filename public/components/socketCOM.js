let folks = [];
someoneRedraws = false;
nbpeopleoncanvas = 0;
nbpeopleplaying = 0;

class SCKT{

  //////////////////
  //COMMUNICATION WITH DB VIA SOCKET
  //////////////////

  initializeDB(){
    socket.on('getdb', (config) => {

      // Initialize Firebase
      firebase.initializeApp(config);
      database = firebase.database();

      //Get session ID from URL if exists
      var params = getURLParams();
      //console.log(params);

      if (params.id) {
        //Load DB with this ID
        dbTalkClass.loadParamDB(params.id);

      } else {
        dbTalkClass.createNewEnsemble();


      }

    });
  };

  async createDBAsync() {
    dbTalkClass.createNewDB();
  }
  async loadAllForMulti(data){
    dbTalkClass.loadParamDB(data);
  }

  async createNewDBFromIcon() {

    return scktClass.createDBAsync();
  }

  safeRedraw(){
    if(loopActivated == true){

    } else {

    }
    if (isDrawing == true ){
      //canvas is already being redraw
      // si je dessine laisse moi faire
      // do not redraw
    } else if (isDrawing == false){
      //check if someone is already on canvas
      if(nbpeopleoncanvas > 1){
        //canvas is already being redraw
        //do nothing
      } else if (nbpeopleoncanvas == 1 ){
        // one people is about to being able to redraw
        if (playing == false){
          redraw();
        } else if (playing == true){
          //

        }
      } else if(nbpeopleoncanvas == 0){
        //nobody is redrawing, you can do it
        redraw();
      } else if (nbpeopleoncanvas < 0){
        nbpeopleoncanvas = 0;
      }
    }
  }

  actionSocketResponses(){

    socket.on('yourID', (data) => {
      yourID = data;
      //socket.emit('newPeople');
      //console.log("Your ID is " + yourID);
    });

    //// CONNECTION TO ROOM ///

    socket.on('socket joined a room', function(data){
      //data.roomID & data.folks
      console.log("you are in room: " + data.roomID);
      console.log("These folks are here too: " + data.folks);

      data.folks.forEach(function(folk){
        if(folk !== yourID){
          let folkData = {
            folk: folk,
            position: {x: -1, y: -1},
            currentPoint: [],
            drawings: [],
            display: 'not hidden'
          }
          folks.push(folkData);
        }
      })
      socket.emit('pushmeinyourfolksarray', yourID);
    });

    socket.on('pushnewfolkinfolksarray', function(data){
      let newfolkData = {
        folk: data,
        position: {x: -1, y: -1},
        currentPoint: [],
        drawings: []
      }
      folks.push(newfolkData);
    })

    socket.on('gimme your slots array', function(){
      if(myLayer != undefined){
        socket.emit("this is my slots array", slots);
      }

    })

    socket.on('transfer slots array', function(data){
      // slots = [];
      data.forEach(function(slot, index){
        let finder = slots.findIndex(i => i.db == slot.db);
        if(finder != -1){
          slots[finder].db = slot.db;
          slots[finder].status = slot.status;
          slots[finder].user = slot.user;
          // slots.push(slot);
        } else {
          slots.push(slot);
        }


      });
      slots.forEach(function(slot, index){
        console.log(slot.db + " : " + slot.status + " | userID: " + slot.user);
        if (slot.status === 'occupied'){
            $("#" + slot.db).addClass("occupiedFolder");
            $("." + slot.db).addClass("occupiedFolder");

            if(slot.db == currentLayerKey){
              $("#" + slot.db).removeClass("occupiedFolder");

              $("#" + slot.db).addClass("currentFolder");

            }

        } else {
          $("#" + slot.db).removeClass("occupiedFolder");
          $("." + slot.db).removeClass("occupiedFolder");
        }
      })
    });

    socket.on('update slots from abroad', function(data){
      slots = data;
      slots.forEach(function(slot, index){
        console.log(slot.db + " : " + slot.status)
        if (slot.status === 'occupied' && slot.db !== currentLayerKey){
            $("#" + slot.db).addClass("occupiedFolder");
        } else {
          $("#" + slot.db).removeClass("occupiedFolder");
        }

      })
    })

    socket.on('user freeing slot', function(data){
      // CLeaning Folks array
      let folk = folks.findIndex(i => i.folk == data);
      folks.splice(folk, 1);
      //Cleaning



      //Update slots before disconnection
      let index = slots.findIndex(finder => finder.user == data);
      slots[index].status = 'free';
      slots[index].user = undefined;
      $("#" + slots[index].db).removeClass("occupiedFolder");
      $(".listing-some-" + slots[index].db).removeClass("activedraw-friend");
      slots.forEach(function(slot, index){
        console.log(slot.db + " : " + slot.status + " | user: " + slot.user)
      })
      scktClass.safeRedraw();
    })

    //////////////////
    //DRAWING FROM FRIENDS PART
    //////////////////

    // 0. Friend is drawing, his pen is on canvas
    socket.on('foreignIsDrawing', () => {
      loopActivated = true;
      loop();
    });

    //1. Receive a startPath (first point) from Friends
    socket.on('startFromDuo', function(data){

      nbpeopleoncanvas++
      // console.log(data);
      let index = folks.findIndex(i => i.folk == data);
      folks.findIndex(i => i.folk == "vplslPxrVIIsYi1ZAAAE");
      // console.log(index);
      folks[index].currentPoint = [];
  		// currentForeign = [];
  		folks[index].drawings.push(folks[index].currentPoint);
  		folks[index].currentPoint.splice(0, 1);
  		scktClass.safeRedraw();

      // timer = setInterval(function(){
      //   scktClass.safeRedraw();
      // }, 1000/60);

  	});

    //2. Trace Friend's path
    socket.on('pushPointFromDuo', function(dataReceived){

  		// console.log(points);
        let index = folks.findIndex(i => i.folk == dataReceived.folkID);
        folks[index].currentPoint.push(dataReceived.point);
        folks[index].position.x = dataReceived.point.x4;
        folks[index].position.y = dataReceived.point.y4;
        // currentForeign.push(points);
        scktClass.safeRedraw();
  	});

    //3. Receive the end Path (last point) from friends
    socket.on('endFromDuo', (data) => {
      nbpeopleoncanvas--
      let index = folks.findIndex(i => i.folk == data.folkID);
      folks[index].position = data.position;
      // clearInterval(timer);
      scktClass.safeRedraw();
      loopActivated = false;
      noLoop();
    });

    socket.on('eraseInFriend', function(data){
      let dataToSend ={
        fex: data.point.px,
        fey: data.point.py,
        folk: data.folkID
      }


      tracerClass.eraserFriends(dataToSend);
      scktClass.safeRedraw();
    });

    //3bis. Friend is not drawing, he released the pen
    // socket.on('foreingIsNotDrawing', () => );

    //4. Undo last path from friend
    socket.on('undoLastForeign', function(){
  		duoDrawings.pop();
  		console.log("try to undo foreign drawings")
  		scktClass.safeRedraw();
  	});

    //5. Receive clean pad from friends
    socket.on('cleanDuo', function(data){
      let index = folks.findIndex(i => i.folk == data.folkID);
  		folks[index].drawings = [];
      folks[index].currentDisplayKey = null;
      $(".listing-some-" + data.layerID).removeClass("activedraw-friend");
  		scktClass.safeRedraw();
  	});

    socket.on('foreingIsPlaying', function(){
      nbpeopleplaying++;
    })

    socket.on('foreingIsNotPlaying', function(){
      nbpeopleplaying--;
    })

    //////////////////
    // Friend is navigating in his timeline part
    //////////////////

    socket.on('someonechangedkey', (data) => {

        // il faut trouver l’index de layerID, dans le tableau des layers (layersArray)
        let index = layersArray.findIndex(i => i.folderKey === data.layerID);
        let folkfinder = folks.findIndex(i => i.folk === data.folkID);

        // il faudra créer les span de timeline correspondants

        folks[folkfinder].currentDisplayKey = data.keyDisplayed;
        // console.log(layersArray[index]);

        let ref = database.ref(currentEnsemble + '/' + data.layerID + '/drawings/' + data.keyDisplayed);
        ref.once('value', oneFromSomeone, dbTalkClass.errData);
        function oneFromSomeone(data){
          let dbdrawing = data.val();
          folks[folkfinder].drawings = dbdrawing.drawing;
          $(".listing-some-" + layersArray[index].folderKey).removeClass("activedraw-friend");

          $("#" + folks[folkfinder].currentDisplayKey).addClass("activedraw-friend");
          // redraw();
        }
        // console.log("index du layer concerné " + data.layerID + ": " + index );

        scktClass.safeRedraw();

    });

  }; // END actionSocketResponses();

}
