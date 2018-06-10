'use strict';

import express from 'express';
let app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

import router from './api/api.js';
app.use( router );

let isRunning = false;

module.exports = {
  start: (port) => {
    if(! isRunning) {
      app.listen(port, (err) => {
        if(err) { throw err; }
        // Tick the running flag
        isRunning = true;
        console.log('Server is up on port', port);
      });
    }
    else {
      console.log('Server is already running');
    }
  },

  stop: () => {
    app.close( () => {
      isRunning = false;
      console.log('Server has been stopped');
    });
  },
};