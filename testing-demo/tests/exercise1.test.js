const exercise1 = require('../exercise1');

describe('fizzBuzz', () => {
    it('should return fizz if the input is divisible by 3', () => {
        const result = exercise1.fizzBuzz(3);
        expect(result).toBe('Fizz');
    });

    it('should return buzz if the input is divisible by 5', () => {
        const result = exercise1.fizzBuzz(5);
        expect(result).toBe('Buzz');
    });

    it('should return fizzbuzz if the input is divisible by 5 and 3', () => {
        const result = exercise1.fizzBuzz(15);
        expect(result).toBe('FizzBuzz');
    });

    it('should return the input if number is not divisible by either 3 or 5', () => {
        const result = exercise1.fizzBuzz(7);
        expect(result).toBe(7);
    });

    it.each(['hello',{}, [], null, undefined])('should throw if input is not a number', (a) => {    
        expect(() => {const result = exercise1.fizzBuzz(a);}).toThrow();
    });
});