'use strict';

import express from 'express';
import requireAll from 'require-dir';
const router = express.Router(); //eslint-disable-line

const models = requireAll('../../src/models'); //eslint-disable-line

describe('API ROUTES', () => {

  it('when accessed by an unregistered route it should return a 404 error', () => {
    
  });
});