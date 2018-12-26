const serverless = require('serverless-http');
const express = require('express');
const getCharacterSample = require('./src/getCharacterSample');

const app = express();

app.get('/getCharacterSample', getCharacterSample());

module.exports.handler = serverless(app);
