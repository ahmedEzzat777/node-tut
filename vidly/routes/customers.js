const express = require('express');
const Joi = require('joi');
const router = express.Router();
const {Customer, validate:validateCustomer} = require('../models/customer');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
    const customers = await Customer.find();
    res.send(customers);
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const customer = await Customer.findById(id);

    if(!customer)
        return res.status(404).send('customer not found');

    res.send(customer);
});

router.post('/', [auth, validate(validateCustomer)], async (req, res) =>{
    let customer = req.body;

    customer = new Customer({
        name:customer.name,
        phone:customer.phone,
        isGold:customer.isGold
    });

    return res.send(await customer.save());
});

router.put('/:id', [auth, validate(validateCustomer)], async (req, res) =>{
    const id = req.params.id;

    const customer = await Customer.findByIdAndUpdate(id, {
        $set:{
            name:req.body.name,
            phone:req.body.phone,
            isGold:req.body.isGold
        }
    }, {new: true});

    if(!customer)
        return res.status(404).send('no customer with that id');

    return res.send(customer);
});

router.delete('/:id', auth, async (req, res) =>{
    const id = req.params.id;
    const customer = await Customer.findByIdAndDelete(id);

    if(!customer)
        return res.status(404).send('no customer with that id');
    
    return res.send(customer);
});


module.exports = router;