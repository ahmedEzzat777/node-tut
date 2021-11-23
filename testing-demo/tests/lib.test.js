const lib = require('../lib');
const db = require('../db');
const mail = require('../mail');

describe('absolute', () => {
    it('should return a positive if input is positive', () => {
        const result = lib.absolute(1);
        expect(result).toBe(1);
    });

    it('should return a positive if input is negative', () => {
        const result = lib.absolute(1);
        expect(result).toBe(1);
    });

    it('should return 0 if input is 0', () => {
        const result = lib.absolute(0);
        expect(result).toBe(0);
    });
});

describe('greet', () => {
    it('should return the greeting message', () => {
        const result = lib.greet('Mosh');
        //expect(result).toBe('Welcome Mosh');
        expect(result).toMatch(/Mosh/); //or contains
    });
});

describe('getCurrencies', () => {
    it('should return usd, eur and aud', () => {
        const result = lib.getCurrencies();
        //expect(result).toEqual(['USD', 'AUD', 'EUR']); //same order, too specific

        expect(result).toContain('AUD');
        expect(result).toContain('EUR');
        expect(result).toContain('USD');

        expect(result).toEqual(expect.arrayContaining(['AUD', 'EUR', 'USD'])); //any order
    });
});

describe('getProduct', () => {
    it('should return object with id 1 and price 10', () => {
        const result = lib.getProduct(1);
        //expect(result).toBe({id:1, price:10}); //tests for object instance, will fail
        //expect(result).toEqual({id:1, price:10}); //tests for exact properties, too specific
        expect(result).toMatchObject({id:1, price:10});
        expect(result).toHaveProperty('id', 1);
        
    });
});

describe('registerUser', () => { //parametrized test, could also be done by a forEach with array
    it.each([null, undefined, '', 0, false, NaN])('should throw if username is falsy', (a) => {
        //null
        //undefined
        //''
        //0
        //false
        //NaN
        expect(()=> {lib.registerUser(a);}).toThrow();
    });

    it('should return valid user object if valid name is passed', () => {
        const result = lib.registerUser('Mosh');
        expect(result).toMatchObject({username:'Mosh'});
        expect(result.id).toBeGreaterThan(0);
    });
});

describe('getDiscount', () => {
    it('should apply 10% discount if customer has more than 10 points', () => {
        db.getCustomerSync = function(customerId) {
            console.log('fake/mock reading customer');
            return { id: customerId, points: 11 };
        };
        const order = {customerId:1, totalPrice:10};
        lib.applyDiscount(order);
        expect(order.totalPrice).toBe(9);
    });
});

describe('notifyCustomers', () => {
    it('should send a mail to the client', () => {
        //const mockFunction = jest.fn();
        //mockFunction.mockReturnValue(1);
        //mockFunction.mockResolvedValue(1);
        //await mockFunction();
        //mockFunction.mockRejectedValue(new Error('...'));

        db.getCustomerSync = jest.fn().mockReturnValue({email:'a'});
        mail.send = jest.fn();

        // let mailSent = false;
        // mail.send = function() {
        //     mailSent = true;
        // }

        lib.notifyCustomer({customerId:1, email:'a'});

        expect(mail.send).toHaveBeenCalled(); //toHaveBeenCalledWith
        expect(mail.send.mock.calls[0][0]).toBe('a'); //check first argument for the first call
        expect(mail.send.mock.calls[0][1]).toMatch(/order/); //check second argument for the first call
    });
});