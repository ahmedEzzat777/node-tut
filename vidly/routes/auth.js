const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const validate = require('../middleware/validate');
const {User} = require('../models/user');
const express = require('express');
const router = express.Router();

router.post('/', validate(validateLogin), async (req, res) => {

    const user = await User.findOne({email:req.body.email});

    if(!user)
        return res.status(400).send('invalid email or password');

    const correctPassword = await bcrypt.compare(req.body.password, user.password);

    if(!correctPassword)
        return res.status(400).send('invalid email or password');

    const token = user.generateAuthToken();;

    res.send(token);
});

function validateLogin(req) {
    const schema = Joi.object({
        email:Joi.string().required().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).message('not a valid email'),
        password:Joi.string().required().min(5).max(255)
    });

    return schema.validate(req);
}

module.exports = router;