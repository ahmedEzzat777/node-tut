const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const config = require('config');
const morgan = require('morgan');
const express = require('express');
const logger = require('./middleware/logger');
const authenticator = require('./middleware/authenticator');
const helmet = require('helmet');
const courses = require('./routes/courses');
const home = require('./routes/home');

const app = express();

app.use(express.json());
app.use(express.static('public'));
app.use(helmet());
app.set('view engine', 'pug');
app.set('views', './views');
app.set('/api/courses', courses);
app.set('/', home);

//configuration

console.log('application name '+config.get('name'));
console.log('mail server '+config.get('mail.host'));
//console.log('mail password '+config.get('mail.password'));
startupDebugger('this is a startup message');
dbDebugger('this is a db message');

if(app.get('env') === 'development') {
    app.use(morgan('tiny'));
    console.log('morgan enabled');
}

app.use(logger);
app.use(authenticator);

//Port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));