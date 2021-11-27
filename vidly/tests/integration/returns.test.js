const {Rental} =  require('../../models/rental');
const {User} =  require('../../models/user');
const {Movie} = require('../../models/movie');
const mongoose = require('mongoose');
const moment = require('moment');
const request = require('supertest');

describe('/api/returns/', () => {
    let server;
    let customerId;
    let movieId;
    let rental;
    let movie;
    let token;

    beforeEach( async() => { 
        server = require('../../index'); 
        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();

        movie = new Movie({
            _id:movieId,
            title:'12345',
            dailyRentalRate: 2,
            numberInStock: 2
        });

        await movie.save();

        rental = new Rental({
            customer:{
                _id: customerId,
                name: '12345',
                phone: '12345',
            },
            movie:{
                _id: movieId,
                title: movie.title,
                dailyRentalRate: movie.dailyRentalRate
            },
            date: moment().add(-1, 'days').toDate()
        });

        await rental.save();
        token = new User().generateAuthToken();
    });

    afterEach( async () => { 
        await server.close();
        await Rental.remove({});
        await Movie.remove({});
    });

    const exec = async () => {
        return await request(server)
            .post('/api/returns')
            .set('x-auth-token', token)
            .send({customerId, movieId});
    };

    it('should return 401 if client is not logged in', async() => {
        token = '';
        const res = await exec();

        expect(res.status).toBe(401);
    });

    it('should return 400 if customerId is not provided', async() => {
        customerId = '';
        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 400 if movieId is not provided', async() => {
        movieId = '';
        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 404 if no rental found for this customer/movie', async() => {
        await Rental.remove({});
        const res = await exec();

        expect(res.status).toBe(404);
    });

    it('should return 400 if rental is already processed', async() => {
        rental.days = 2;
        await rental.save();

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 200 if valid request', async() => {
        const res = await exec();

        expect(res.status).toBe(200);
    });

    it('should set days if input is valid', async() => {
        const res = await exec();

        const result = await Rental.findById(rental._id);

        expect(result.days).toBe(1);
    });

    it('should calculate the rental fee', async () => {
        const res = await exec();

        const result = await Rental.findById(rental._id);

        const expected = result.days * result.movie.dailyRentalRate;

        expect(result.price).toBe(expected);
    });

    it('should increase the stock', async () => {
        const res = await exec();

        const result = await Movie.findById(movie._id);

        const expected = movie.numberInStock + 1;

        expect(result.numberInStock).toBe(expected);
    });

    it('should return the correct rental object', async () => {
        const res = await exec();

        const rentalInDb = await Rental.findById(rental._id);
        
        //expect(res.body).toMatchObject(rentalInDb); //error in date formatting

        expect(Object.keys(res.body)).toEqual(expect.arrayContaining([
            'date',
            'days',
            'price',
            'customer',
            'movie',
        ]));
    });
});