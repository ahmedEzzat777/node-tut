const express = require('express');
const router = express.Router();
const {Genre, validate} = require('../models/genre');

router.get('/', async (req, res) => {
    const genres = await Genre.find()
    res.send(genres);
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const genre = await Genre.findById(id);

    if(!genre)
        return res.status(404).send('genre not found');

    res.send(genre);
});

router.post('/', async (req, res) =>{
    let genre = req.body;
    const result = validate(genre);

    if(result.error)
        return res.status(400).send(result.error.details[0].message);
    
    genre = new Genre({
        name:genre.name
    });

    return res.send(await genre.save());
});

router.put('/:id', async (req, res) =>{
    const id = req.params.id;
    const result = validate(req.body);

    if(result.error)
        return res.status(400).send(result.error.details[0].message);

    const genre = await Genre.Genre.findOneAndUpdate({_id:id}, {
        $set:{
            name:req.body.name
        }
    }, {new: true});

    if(!genre)
        return res.status(404).send('no genre with that id');

    return res.send(genre);
});

router.delete('/:id', async (req, res) =>{
    const id = req.params.id;
    const genre = await Genre.findByIdAndDelete(id);

    if(!genre)
        return res.status(404).send('no genre with that id');
    
    return res.send(genre);
});

module.exports = router;