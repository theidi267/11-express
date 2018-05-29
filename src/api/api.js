'use strict';

import express from 'express';
const router = express.Router();

// Read and require every file in the "models" directory
// This allows us to dynamically create and use models with ONE API.
import requireAll from 'require-dir';
const models = requireAll('../models');

/**
 * Simple method to send a JSON response (all of the API methods will use this)
 * @param res
 * @param data
 */
let sendJSON = (res,data) => {
  res.statusCode = 200;
  res.statusMessage = 'OK';
  res.setHeader('Content-Type', 'application/json');
  res.write( JSON.stringify(data) );
  res.end();
};

/**
 * Send a formatted (JSON) error the user in case of catastrophe
 * @param res
 * @param err
 */
let serverError = (res,err) => {
  let error = { error:err };
  res.statusCode = 500;
  res.statusMessage = 'Server Error';
  res.setHeader('Content-Type', 'application/json');
  res.write( JSON.stringify(error) );
  res.end();
};

/**
 * Dynamically find and set the right model, based on the URL Param
 *    i.e.  /api/vi/people/12345 would result in the model being "people"
 *          assuming there is a valid "people.js" file in the models folder
 * @param req
 * @param res
 * @returns {*}
 */
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

router.param('model', (req,res,next,value) => {
  req.model = getModel(req,res);
  next();
});

export default router;

