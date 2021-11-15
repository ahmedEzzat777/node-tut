const express = require('express');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const app = express();
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/vidly');

app.use(express.json());
app.use('/api/genres',genres);
app.use('/api/customers',customers);
app.use('/api/movies',movies);


const port = process.env.PORT | 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));