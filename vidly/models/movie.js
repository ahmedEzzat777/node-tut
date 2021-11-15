const mongoose = require('mongoose');
const Joi = require('joi');
const {genreSchema} = require('./genre');


const schema = mongoose.Schema({
    title:{type:String, minlength:3, required:true, trim:true},
    genre:{type:genreSchema},
    numberInStock: {type:Number, min:0, max:255},
    dailyRentalRate: {type:Number, min:0, max:255},
});

const Movie = mongoose.model('Movie', schema);

function validateMovie(genre) {
    const schema = Joi.object({
        _id:Joi.string().length(12),
        title: Joi.string().required().min(3),
        numberInStock: Joi.number().min(0),
        dailyRentalRate: Joi.number().min(0),
        genreId:Joi.string()
    });

    return schema.validate(genre);
}

module.exports.Movie = Movie;
module.exports.validate = validateMovie;

