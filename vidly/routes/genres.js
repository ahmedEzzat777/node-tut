const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const express = require('express');
const router = express.Router();
const {Genre, validate} = require('../models/genre');
const mongoose = require('mongoose');
const validateObjectId = require('../middleware/validateObjectId');

// // another method of handling errors (other than 'express-async-errors')
// const asyncMiddleware = require('../middleware/async');
// router.get('/', asyncMiddleware(async (req, res) => {
//     const genres = await Genre.find()
//     res.send(genres);
// }));

router.get('/', async (req, res) => {
    const genres = await Genre.find()
    res.send(genres);
});

router.get('/:id', validateObjectId, async (req, res) => {
    const id = req.params.id;

    const genre = await Genre.findById(id);

    if(!genre)
        return res.status(404).send('genre not found');

    res.send(genre);
});

router.post('/', auth, async (req, res) =>{
    let genre = req.body;
    const result = validate(genre);

    if(result.error)
        return res.status(400).send(result.error.details[0].message);
    
    genre = new Genre({
        name:genre.name
    });

    return res.send(await genre.save());
});

router.put('/:id', auth, async (req, res) =>{
    const id = req.params.id;
    const result = validate(req.body);

    if(result.error)
        return res.status(400).send(result.error.details[0].message);

    const genre = await Genre.findOneAndUpdate({_id:id}, {
        $set:{
            name:req.body.name
        }
    }, {new: true});

    if(!genre)
        return res.status(404).send('no genre with that id');

    return res.send(genre);
});

router.delete('/:id', [auth, admin], async (req, res) =>{
    const id = req.params.id;
    const genre = await Genre.findByIdAndDelete(id);

    if(!genre)
        return res.status(404).send('no genre with that id');
    
    return res.send(genre);
});

module.exports = router;