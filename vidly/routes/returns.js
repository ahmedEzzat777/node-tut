const auth = require('../middleware/auth');
const { Rental } = require('../models/rental');
const { Movie } = require('../models/movie');
const validate = require('../middleware/validate');
const express = require('express');
const router = express.Router();
const Joi = require('joi');

router.post('/', [auth, validate(validateReturn)], async (req, res) => {

    const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

    if(!rental)
        return res.status(404).send('not found');

    if(rental.days)
        return res.status(400).send('rental already processed');

    rental.return();

    await rental.save();
    
    await Movie.updateOne({_id:req.body.movieId}, {
        $inc: { numberInStock: 1}
    });

    res.send(rental);
});

function validateReturn(reqBody) {
    const schema = Joi.object({
        customerId: Joi.string().regex(/^[a-f\d]{24}$/i).required(),
        movieId: Joi.string().regex(/^[a-f\d]{24}$/i).required()
    });

    return schema.validate(reqBody);
}

module.exports = router;