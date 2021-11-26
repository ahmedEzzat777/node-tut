const mongoose = require('mongoose');
const Joi = require('joi');

const schema = mongoose.Schema({
    name:{type:String, minlength:3, maxlength:50, required:true}
});

const Genre = mongoose.model('Genre', schema);

const joiSchema = Joi.object({
    _id:Joi.string().regex(/^[a-f\d]{24}$/i),
    name: Joi.string().required().min(3).max(50)
});

function validateGenre(genre) {
    return joiSchema.validate(genre);
}

module.exports.Genre = Genre;
module.exports.validate = validateGenre;
module.exports.genreSchema = schema;

