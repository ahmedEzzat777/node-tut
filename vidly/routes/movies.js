const express = require('express');
const router = express.Router();
const {Movie, validate} = require('../models/movie');
const {Genre} = require('../models/genre');

router.get('/', async (req, res) => {
    const movies = await Movie.find()
    res.send(movies);
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const movie = await Movie.findById(id);

    if(!movie)
        return res.status(404).send('movie not found');

    res.send(movie);
});

router.post('/', async (req, res) =>{
    let movie = req.body;
    const result = validate(movie);

    if(result.error)
        return res.status(400).send(result.error.details[0].message);

    let genre = await Genre.findById(movie.genreId);
    
    if(!genre){
        return res.status(404).send('genre doesnt exist');
    }

    movie = new Movie({
        title: movie.title,
        genre: {_id:genre._id, name:genre.name},
        numberInStock: movie.numberInStock,
        dailyRentalRate: movie.dailyRentalRate
    });

    return res.send(await movie.save());
});

router.put('/:id', async (req, res) =>{
    const id = req.params.id;
    const result = validate(req.body);

    if(result.error)
        return res.status(400).send(result.error.details[0].message);

    let genre = await Genre.findById(req.body.genreId);

    if(!genre){
        return res.status(404).send('genre doesnt exist');
    }

    const movie = await Movie.findOneAndUpdate({_id:id}, {
        $set:{
            name:req.body.name,
            title: req.body.title,
            genre: {_id:genre._id, name:genre.name},
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate
        }
    }, {new: true});

    if(!movie)
        return res.status(404).send('no movie with that id');

    return res.send(movie);
});

router.delete('/:id', async (req, res) =>{
    const id = req.params.id;
    const movie = await Movie.findByIdAndDelete(id);

    if(!movie)
        return res.status(404).send('no movie with that id');
    
    return res.send(movie);
});

module.exports = router;