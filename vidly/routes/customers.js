const express = require('express');
const Joi = require('joi');
const router = express.Router();
const {Customer, validate} = require('../models/customer');

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

router.post('/', async (req, res) =>{
    let customer = req.body;
    const result = validate(customer);

    if(result.error)
        return res.status(400).send(result.error.details[0].message);

    customer = new Customer({
        name:customer.name,
        phone:customer.phone,
        isGold:customer.isGold
    });

    return res.send(await customer.save());
});

router.put('/:id', async (req, res) =>{
    const id = req.params.id;
    const result = validate(req.body);

    if(result.error)
        return res.status(400).send(result.error.details[0].message);

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

router.delete('/:id', async (req, res) =>{
    const id = req.params.id;
    const customer = await Customer.findByIdAndDelete(id);

    if(!customer)
        return res.status(404).send('no customer with that id');
    
    return res.send(customer);
});


module.exports = router;