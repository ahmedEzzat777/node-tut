const mongoose = require('mongoose');
const Joi = require('joi');

const schema = mongoose.Schema({
    name:{type:String, minlength:3, required:true}
});

const Genre = mongoose.model('Genre', schema);

function validateGenre(genre) {
    const schema = Joi.object({
        _id:Joi.string().length(12),
        name: Joi.string().required().min(3)
    });

    return schema.validate(genre);
}

module.exports.Genre = Genre;
module.exports.validate = validateGenre;

