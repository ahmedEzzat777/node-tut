const winston = require('winston');
const express = require('express');
const app = express();

require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();

// throw new Error('uncaught'); // handled by process.on('uncaughtException',..)
// const p = Promise.reject(new Error('uncaught promise rejection'));
// p.then(()=> console.log('done'));

const port = process.env.PORT | 3000;
app.listen(port, () => winston.info(`Listening on port ${port}`));