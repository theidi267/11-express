'use strict';

import express from 'express';
const router = express.Router();

import requireAll from 'require-dir';
const models = requireAll('../models');

let sendJSON = (res,data) => {
  res.statusCode = 200;
  res.statusMessage = 'OK';
  res.setHeader('Content-Type', 'application/json');
  res.write( JSON.stringify(data) );
  res.end();
};

let serverError = (res,err) => {
  let error = { error:err };
  res.statusCode = 500;
  res.statusMessage = 'Server Error';
  res.setHeader('Content-Type', 'application/json');
  res.write( JSON.stringify(error) );
  res.end();
};

let getModel = (req,res) => {
  try {
    if ( req.params.model && models[req.params.model] ) {
      return models[req.params.model].default ? models[req.params.model].default : models[req.params.model];
    }
    throw `Model ${req.params.model} not found`;
  }
  catch(e) {
    serverError(res,e);
  }
};

router.get('/api/v1/:model', (req,res) => {
  console.log(req.model);
  req.model.fetchAll()
    .then( data => sendJSON(res,data) )
    .catch( err => serverError(res,err) );
});

router.get('/api/v1/:model/:id', (req,res) => {
  if ( req.params.id ) {
    req.model.findOne(req.params.id)
      .then(data => sendJSON(res, data))
      .catch(err => serverError(res, err));
  }
  else {
    serverError(res, 'Record Not Found');
  }

});

router.post('/api/v1/:model', (req,res) => {
  let record = new req.model(req.body);
  record.save()
    .then(data => sendJSON(res,data))
    .catch(console.error);

});

router.param('model', (req,res,next,value) => { //eslint-disable-line
  req.model = getModel(req,res);
  next();
});

export default router;

