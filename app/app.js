const express = require('express');
const logger = require('morgan');
const fs = require('fs');
const path = require('path');

let app = express();

// create a write stream (in append mode)
let accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

// setup the logger
app.use(logger('dev', { stream: accessLogStream }));

// start server
app.use(express.static(__dirname + '/public'));
app.server = app.listen(process.env.PORT || 3035);

module.exports = app;
