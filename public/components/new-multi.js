// 1- CREER LES TABLEAUX DE KEYS POUR CHAQUE FOLDER

function getEnsembleDBs(){
  // ...
  let layersArray = [];
  storeProjects[0].forEach((folder) => {
    let oneLayer = {
      folderKey: folder,
      storeKeysFolder: [],
      folderDrawings: []
    }
    layersArray.push(oneLayer);
  }
};



// 2- SIGNALER UN CHANGEMENT AUX AUTRES SOCKETS

// COTÉ CLIENT
function gotData(){
  // envoie aux sockets signal
  let layerID = currentLayerKey;
  socket.emit('ihavenewdata', layerID);
}

//COTÉ SERVEUR
socket.on('ihavenewdata', (layerID) => {
  socket.broadcast.to(socket.roomID).emit('someonegotnewdata', layerID);
});

//COTÉ RECEVEURS
socket.on('someonegotnewdata', (layerID) => {
  let tempDB = currentDB + '/' + layerID + '/drawings';
  let ref = database.ref(tempDB);
  ref.once('value', gotSomeoneData);

  function gotSomeoneData(data){
    // utiliser layerID et data comme info
    let result = data.val();
    let dbdrawings = result.keys;
    // il faut trouver l’index de layerID, dans le tableau des layers (layersArray)
   let index = layersArray.findIndex(i => i.folder === layerID);
   layersArray[index].storeKeysFolder = dbdrawings;

// il faudra créer les span de timeline correspondants

redraw();
  }
});

// 3- AFFICHER SUR LE CANVAS LE CONTENU DES
