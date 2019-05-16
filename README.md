# MoBlitz
a p5js pad to make animation together in realtime

### Install
`npm install`

You need a firebase database to make MoBlitz work properly.

On the `./public/sketch.js`file, from line `59` to `66`,
replace this
```
var config = {
    apiKey: key,
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: ""
  };
```
with your firebase credentials.

### Start

`node server.js`

MoBlitz runs on localhost:4000



### Real-Time

To make it really in realtime and play with your fellows animators friends, you need to push it on a server, using a service like Heroku for example.
