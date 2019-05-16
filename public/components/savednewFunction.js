newInsertFrame(){
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

  //console.log("We push data in the DB.");
  storeKeys.splice(0, 1);
  let result = ref.push(data);
  insertedKey = result.key;
  storeKeys[0].push(result.key);
  storeKeys[0].splice(storeKeys[0].length - 1, 1);
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
}

// let tempKeys = keys;
// for (let k of keys){
//   let ref = database.ref(currentDB + k);
//   ref.once('value', moveKey, dbTalkClass.errData);
//
//   function moveKey(data){
//     let dbdrawing = data.val();
//     if (dbdrawing.nearPrevKey != undefined){
//       let wichkey = keys.indexOf(dbdrawing.nearPrevKey);
//       console.log("j'ai trouvé une clefs d'insertion!: "+ wichkey);
//       // let calculateDiff = key.indexOf(k) - wichkey;
//       let movingKey = key.indexOf(k);
//       tempKeys.move(movingKey,wichkey + 1);
//     }
//   }
// }
