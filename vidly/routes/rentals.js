const express = require('express');
const router = express.Router();
const {Rental, validate} = require('../models/rental');
const {Customer} = require('../models/customer');
const {Movie} = require('../models/movie');
const mongoose = require('mongoose');
//const Fawn = require('fawn');
//Fawn.init(mongoose); //refused to work

router.post('/', async (req, res) => {
    let rental = req.body;
    const result = validate(rental);

    if(result.error)
        return res.status(400).send(result.error.details[0].message);

    const customer = await Customer.findById(rental.customerId);

    if(!customer)
        return res.status(400).send('invalid customer');

    const movie = await Movie.findById(rental.movieId);

    if(!movie)
        return res.status(400).send('invalid movie');

    if(movie.numberInStock === 0)
        return res.status(404).send('no available stock');

    rental = new Rental({
        customer:{
            _id: customer._id,
            name: customer.name,
            isGold: customer.isGold
        },
        movie:{
            _id:movie._id,
            title:movie.title
        },
        days: rental.days,
        price: customer.isGold? (rental.days*2): (rental.days*2.2 + 5)
    });

    movie.numberInStock--;
    await movie.save();
    res.send(await rental.save());

    // try{
    //     await new Fawn.Task()
    //         .save('rentals', rental)
    //         .update('movies', {_id:movie.id}, {
    //             $inc:{numberInStock:-1}
    //         })
    //         .run()
            
    //     res.send(rental);
    // }
    // catch(ex){
    //     res.status(500).send('somthing happened');
    // }


});

router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('-date');
    res.send(rentals);
});

module.exports = router;