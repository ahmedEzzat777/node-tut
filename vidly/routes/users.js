const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const {User, validate:validateUser} = require('../models/user');
const express = require('express');
const router = express.Router();

router.get('/me', auth, async (req, res) => {
    const id = req.user._id;
    const user = await User.findById(id).select('-password');
    res.send(user);
});

router.post('/', validate(validateUser), async (req, res) => {
    let user = req.body;

    const existingUser = await User.findOne({email:user.email});

    if(existingUser)
        return res.status(400).send('a user with that email already exists');

    user = new User(_.pick(user, ['name', 'email', 'password']));

    const salt = await bcrypt.genSalt();
    const hashed = await bcrypt.hash(user.password, salt);
    user.password = hashed;
    
    await user.save();

    const token = user.generateAuthToken();

    return res.header('x-auth-token', token).send(_.pick(user, ['name', 'email'])); //omit excludes properties
});

module.exports = router;