const serverless = require('serverless-http');
const express = require('express');
const getCharacterSample = require('./src/getCharacterSample');
const submitTest = require('./src/submitTest');
const skritterCallbackHandler = require('./src/skritterCallbackHandler');

const app = express();

const cors = (req, res, next) => {
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  });
  next();
};

app.get('/getCharacterSample', cors, getCharacterSample());
app.post('/submitTest', cors, submitTest());
app.get('/oauth/skritter/callback', skritterCallbackHandler());

module.exports.handler = serverless(app);
