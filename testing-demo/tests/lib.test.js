const lib = require('../lib');

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