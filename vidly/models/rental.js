const mongoose = require('mongoose');
const Joi = require('joi');
const moment = require('moment');

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
            title:{type:String, minLength:3, maxLength:255},
            dailyRentalRate:{type:Number, min:0}
        }),
        required:true
    },
    date:{type:Date, default:Date.now, required:true},
    days:{type:Number, min:1, max:30},
    price:{type:Number, min:1, max:30}
});

schema.statics.lookup = function(customerId, movieId) {
    return this.findOne({
        'movie._id':movieId,
        'customer._id':customerId
    });
};

schema.methods.return = function() {
    const d = moment().diff(this.date, 'days');//Math.floor((Date.now() - rental.date) / (1000 * 60 * 60 * 24));
    this.days = d;
    this.price = this.days * this.movie.dailyRentalRate;
};

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

