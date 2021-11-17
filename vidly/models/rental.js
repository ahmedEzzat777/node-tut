const mongoose = require('mongoose');
const Joi = require('joi');


const schema = mongoose.Schema({
    customer:{
        type: new mongoose.Schema({
            _id:mongoose.Types.ObjectId,
            name:{type:String, minLength:3, maxLength:255},
            isGold:Boolean
        }),
        required:true
    },
    movie:{
        type: new mongoose.Schema({
            _id:mongoose.Types.ObjectId,
            title:{type:String, minLength:3, maxLength:255}
        }),
        required:true
    },
    date:{type:Date, default:Date.now, required:true},
    days:{type:Number, min:1, max:30},
    price:{type:Number, min:1, max:30}
});

const Rental = mongoose.model('Rental', schema);

function validateRental(rental) {
    const schema = Joi.object({
        //_id:Joi.string().length(12),
        customerId: Joi.string().required().regex(/^[a-f\d]{24}$/i),
        movieId: Joi.string().required().regex(/^[a-f\d]{24}$/i),
        days:Joi.number().min(0).max(255),
    });

    return schema.validate(rental);
}

module.exports.Rental = Rental;
module.exports.validate = validateRental;

