const serverless = require('serverless-http');
const express = require('express');
const getCharacterSample = require('./src/getCharacterSample');
const submitTest = require('./src/submitTest');

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

module.exports.handler = serverless(app);
