const mongoose = require('mongoose');
const Joi = require('joi');

const schema = mongoose.Schema({
    name:{type:String, minlength:3, required:true},
    isGold:Boolean,
    phone:String
});

const Customer = mongoose.model('Customer', schema);

function validateCustomer(customer) {
    const schema = Joi.object({
        _id:Joi.string().length(12),
        name: Joi.string().required().min(3),
        isGold:Joi.boolean(),
        phone: Joi.string()
    });

    return schema.validate(customer);
}


module.exports.Customer = Customer;
module.exports.validate = validateCustomer;

