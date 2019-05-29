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
        //Say to server that we will join e room with this ID name
  			socket.emit('join custom', params.id);
      } else {
        dbTalkClass.createNewEnsemble();
        // dbTalkClass.createNewDB();
        async function createSecondOne() {
          dbTalkClass.createNewDB();
        }
        async function loadAllForMulti(){
          dbTalkClass.loadParamDB(currentEnsemble);

        }
        createSecondOne().then(createSecondOne()).then(loadAllForMulti());

      }
    });
  };

  safeRedraw(){
    if (isDrawing == false){
      redraw();
    } else {
      //Do Not redraw
    }
  }

  actionSocketResponses(){

    //// CONNECTION TO ROOM ///

    socket.on('socket joined a room', function(data){
      console.log("nb people in room : " + data);
      nbPeopleInRoom = data;
      if(data > 1){
        slots = [];
        socket.emit('get slots array');
      } else {
        console.log("je suis tout seul dans la room");
        for (let i = 0; i < storeProjects[0].length - 1; i++) {
          let slotData = {db: storeProjects[0][i], status: 'free'};
          slots.push(slotData);
          // dbTalkClass.loadOneOfDBs(slots[0].db);
        }
      }
    });

    socket.on('gimme your slots array', function(){
      socket.emit("this is my slots array", slots);
    })

    socket.on('transfer slots array', function(data){
      slots = [];
      data.forEach(function(slot, index){
        slots.push(slot);

      });
      slots.forEach(function(slot, index){
        console.log(slot.db + " : " + slot.status)
      })
    });

    socket.on('update slots from abroad', function(data){
      slots = data;
      slots.forEach(function(slot, index){
        console.log(slot.db + " : " + slot.status + " | user: " + slot.user)
        if (slot.status === 'not free' && slot.db !== currentLayerKey){
            $("#" + slot.db).addClass("occupiedFolder");
        } else {
          $("#" + slot.db).removeClass("occupiedFolder");
        }

      })
    })

    socket.on('user freeing slot', function(data){
      //Cleaning
      duoDrawings = [];
      scktClass.safeRedraw();

      //Update slots before disconnection
      let index = slots.findIndex(finder => finder.user == data);
      slots[index].status = 'free';
      slots[index].user = undefined;
      $("#" + slots[index].db).removeClass("occupiedFolder");
      slots.forEach(function(slot, index){
        console.log(slot.db + " : " + slot.status + " | user: " + slot.user)
      })
    })

    //////////////////
    //DRAWING FROM FRIENDS PART
    //////////////////

    //0. Friend is drawing, his pen is on canvas
    socket.on('foreignIsDrawing', () => foreignDrawing = true);

    //1. Receive a startPath (first point) from Friends
    socket.on('startFromDuo', function(){
  		currentForeign = [];
  		duoDrawings.push(currentForeign);
  		currentForeign.splice(0, 1);
  		scktClass.safeRedraw();
  	});

    //2. Trace Friend's path
    socket.on('pushPointFromDuo', function(points){
  		// console.log(points);

        currentForeign.push(points);
        scktClass.safeRedraw()



  	});

    //3. Receive the end Path (last point) from friends
    socket.on('endFromDuo', () => {
      scktClass.safeRedraw()
    });

    socket.on('eraseInFriend', function(erasePoint){
      fex = erasePoint.px;
      fey = erasePoint.py;
      tracerClass.eraserFriends();
      scktClass.safeRedraw();
    })

    //3bis. Friend is not drawing, he released the pen
    socket.on('foreingIsNotDrawing', () => foreignDrawing = false);

    //4. Undo last path from friend
    socket.on('undoLastForeign', function(){
  		duoDrawings.pop();
  		console.log("try to undo foreign drawings")
  		scktClass.safeRedraw();
  	});

    //5. Receive clean pad from friends
    socket.on('cleanDuo', function(){
  		duoDrawings = [];
  		scktClass.safeRedraw();
  	});



    //////////////////
    // Friend is navigating in his timeline part
    //////////////////

    socket.on('replaceDuoDrawings', function(data){

      framesClass.showDrawingFriend(data);
  		// console.log("try to undo foreign drawings")
  		scktClass.safeRedraw()
  	});

  }; // END actionSocketResponses();

}
