const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');
const { boolean } = require('joi');

const schema = new mongoose.Schema({
    name:{
        type: String,
        required:true,
        minlength:3,
        maxlength:128
    },
    email:{
        type: String,
        required:true,
        unique: true,
        validate: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'invalid email']
    },
    password:{
        type: String,
        required:true
    },
    isAdmin:Boolean
    // roles:[],
    // operations:[],
});

schema.methods.generateAuthToken = function() {
    return jwt.sign({
        _id: this._id,
        isAdmin: this.isAdmin
    }, config.get('jwtPrivateKey'));
}

const User = mongoose.model('User', schema);

function validateUser(user) {
    const schema = Joi.object({
        name:Joi.string().required().min(3).max(128),
        email:Joi.string().required().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).message('not a valid email'),
        password:Joi.string().required().min(5).max(255)
    });

    return schema.validate(user);
}

module.exports.User = User;
module.exports.validate = validateUser;
