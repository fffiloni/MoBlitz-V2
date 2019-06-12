let folks = [];
someoneRedraws = false;

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

        async function createDBAsync() {
          dbTalkClass.createNewDB();
        }
        async function loadAllForMulti(){
          dbTalkClass.loadParamDB(currentEnsemble);
        }
        createDBAsync().then(createDBAsync()).then(loadAllForMulti());

      }
    });
  };

  safeRedraw(){
    if (isDrawing == false ){
      if(foreignDrawing == true){
        redraw();

      } else {
        if(playing == false){
           redraw();
         }
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
            currentPoint: [],
            drawings: []
          }
          folks.push(folkData);
        }
      })
      socket.emit('pushmeinyourfolksarray', yourID);
    });

    socket.on('pushnewfolkinfolksarray', function(data){
      let newfolkData = {
        folk: data,
        currentPoint: [],
        drawings: []
      }
      folks.push(newfolkData);
    })

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
      // CLeaning Folks array
      let folk = folks.findIndex(i => i.folk == data);
      folks.splice(folk, 1);
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
    socket.on('startFromDuo', function(data){
      console.log(data);
      let index = folks.findIndex(i => i.folk == data);
      folks.findIndex(i => i.folk == "vplslPxrVIIsYi1ZAAAE");
      console.log(index);
      folks[index].currentPoint = [];
  		// currentForeign = [];
  		folks[index].drawings.push(folks[index].currentPoint);
  		folks[index].currentPoint.splice(0, 1);
  		scktClass.safeRedraw();
  	});

    //2. Trace Friend's path
    socket.on('pushPointFromDuo', function(dataReceived){
  		// console.log(points);
        let index = folks.findIndex(i => i.folk == dataReceived.folkID);
        folks[index].currentPoint.push(dataReceived.point);
        // currentForeign.push(points);
        scktClass.safeRedraw();
  	});

    //3. Receive the end Path (last point) from friends
    socket.on('endFromDuo', () => {
      scktClass.safeRedraw();
    });

    socket.on('eraseInFriend', function(erasePoint){
      fex = erasePoint.px;
      fey = erasePoint.py;
      tracerClass.eraserFriends();
      scktClass.safeRedraw();
    });

    //3bis. Friend is not drawing, he released the pen
    socket.on('foreingIsNotDrawing', () => foreignDrawing = false);

    //4. Undo last path from friend
    socket.on('undoLastForeign', function(){
  		duoDrawings.pop();
  		console.log("try to undo foreign drawings")
  		scktClass.safeRedraw();
  	});

    //5. Receive clean pad from friends
    socket.on('cleanDuo', function(data){
      let index = folks.findIndex(i => i.folk == data);
  		folks[index].drawings = [];
  		scktClass.safeRedraw();
  	});



    //////////////////
    // Friend is navigating in his timeline part
    //////////////////

    socket.on('someonechangedkey', (data) => {

        // il faut trouver l’index de layerID, dans le tableau des layers (layersArray)
        let index = layersArray.findIndex(i => i.folderKey === data.layerID);
        let folkfinder = folks.findIndex(i => i.folk === data.folkID);

        // il faudra créer les span de timeline correspondants

        layersArray[index].currentDisplayKey = data.keyDisplayed;
        // console.log(layersArray[index]);

        let ref = database.ref(currentEnsemble + '/' + data.layerID + '/drawings/' + data.keyDisplayed);
        ref.once('value', oneFromSomeone, dbTalkClass.errData);
        function oneFromSomeone(data){
          let dbdrawing = data.val();
          folks[folkfinder].drawings = dbdrawing.drawing;
          $(".listing-some-" + layersArray[index].folderKey).removeClass("activedraw-friend");

          $("#" + layersArray[index].currentDisplayKey).addClass("activedraw-friend");
          // redraw();
        }
        // console.log("index du layer concerné " + data.layerID + ": " + index );

        scktClass.safeRedraw();

    });

    socket.on('replaceDuoDrawings', function(data){

      framesClass.showDrawingFriend(data);
  		// console.log("try to undo foreign drawings")
  		scktClass.safeRedraw();
  	});

  }; // END actionSocketResponses();

}
