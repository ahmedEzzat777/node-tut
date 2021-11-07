const express = require('express');
const Joi = require('joi');

const router = express.Router();

let Genres = [
    {id: 0, name:'Action'},
    {id: 1, name:'Drama'},
    {id: 2, name:'Romance'},
];

router.get('/', (req, res) => {
    res.send(Genres);
});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    const genre = Genres.find((i) => i.id === parseInt(id));

    if(!genre)
        return res.status(404).send('genre not found');

    res.send(genre);
});

router.post('/', (req, res) =>{
    const genre = req.body;
    const result = validateGenre(genre);

    if(result.error)
        return res.status(400).send(result.error.details[0].message);

    genre.id = Genres.length;
    genre.id = 
    Genres.push(genre);

    return res.send(genre);
});

router.put('/:id', (req, res) =>{
    const id = req.params.id;
    const genre = Genres.find(i => i.id === parseInt(id));

    if(!genre)
        return res.status(404).send('no genre with that id');

    const result = validateGenre(req.body);

    if(result.error)
        return res.status(400).send(result.error.details[0].message);

    genre.name = req.body.name;

    return res.send(genre);
});

router.delete('/:id', (req, res) =>{
    const id = req.params.id;
    const genre = Genres.find(i => i.id === parseInt(id));

    if(!genre)
        return res.status(404).send('no genre with that id');

    const idx = Genres.findIndex(i => i.id === parseInt(id));
    Genres.splice(idx, 1);
    return res.send(Genres);
});

function validateGenre(genre) {
    const schema = Joi.object({
        name: Joi.string().required().min(3)
    });

    return schema.validate(genre);
}

module.exports = router;