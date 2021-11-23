const {User} = require('../../../models/user');
const jwt = require('jsonwebtoken');
//const config = require('config');
const mongoose = require('mongoose');

describe('user.generateAuthToken', () => {
    it('should return a valid jwt token', () => {
        //config.get = jest.fn().mockReturnValue('secret');

        const payload = {
            _id: new mongoose.Types.ObjectId(), //if failed you can call with .toHexString()
            isAdmin:false
        };

        const user = new User(payload);
        const result = user.generateAuthToken();
        const decoded = jwt.decode(result);
        
        expect(decoded).toMatchObject(payload);
    });
});