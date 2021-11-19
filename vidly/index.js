require('express-async-errors');
const winston = require('winston');
require('winston-mongodb');
const config = require('config');
const express = require('express');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
const error = require('./middleware/error');

const app = express();
const mongoose = require('mongoose');

winston.add(new winston.transports.File({
    filename:'logfile.log',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.simple() //or winston.format.json()
      )
}));

winston.add(new winston.transports.MongoDB({
    db:'mongodb://localhost:27017/vidly',
    level:'info'
}));

if(!config.get('jwtPrivateKey')) {
    console.error('FATAL ERROR: jwtPrivateKey not set');
    process.exit(1);
}

mongoose.connect('mongodb://localhost:27017/vidly');

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use(error);


const port = process.env.PORT | 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));