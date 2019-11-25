# MoBlitz Version 2
a p5js pad to make traditional animation together in realtime

![interface](/exports/animation-pad.png)

### Install
`npm install`

You need a firebase database to make MoBlitz work properly.
As long as you get your Firebase credentials, add them to the .env file

```
/*
 * .env
 */

MY_API_KEY=
FIREBASE_AUTH_DOMAIN=
DATABASE_URL=
PROJECT_ID=
STORAGE_BUCKET=
MESSAGING_SENDER_ID=

```

### Start

`node server.js`

MoBlitz v2 runs on localhost:4000


### Real-Time

To make it really in realtime and play with your fellows animators friends, you need to push it on a server, using a service like Heroku for example.
