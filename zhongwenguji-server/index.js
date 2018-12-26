const serverless = require('serverless-http');
const express = require('express');
const getCharacterSample = require('./src/getCharacterSample');
const submitTest = require('./src/submitTest');

const app = express();

app.get('/getCharacterSample', getCharacterSample());
app.post('/submitTest', submitTest());

module.exports.handler = serverless(app);
