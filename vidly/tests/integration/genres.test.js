const request = require('supertest');
const {Genre} = require('../../models/genre');
const {User} = require('../../models/user');
const mongoose = require('mongoose');

let server;

describe('/api/genres', () => {
    beforeEach( () => { server = require('../../index'); });
    afterEach( async () => { 
        server.close();
        await Genre.remove({});
    });

    describe('GET /', () => {
        it('should return all genres', async() => {
            await Genre.collection.insertMany([
                {name:'genre1'},
                {name:'genre2'},
            ]);

            const res = await request(server).get('/api/genres');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g => g.name == 'genre1')).toBeTruthy();
            expect(res.body.some(g => g.name == 'genre2')).toBeTruthy();
        });
    });

    describe('GET /:id', () => {
        it('should return genre with certain id', async() => {
            const genre = new Genre({name: 'genre'});

            await Genre.collection.insertOne(genre);

            const res = await request(server).get('/api/genres/' + genre._id);
            expect(res.status).toBe(200);
            expect(res.body).toMatchObject({_id:genre._id, name:genre.name});
            //expect(res.body).toHaveProperty('name', 'genre');
        });

        it('should return 404 if failed to find the genre', async() => {
            const res = await request(server).get('/api/genres/' + new mongoose.Types.ObjectId());
            expect(res.status).toBe(404);
        });

        it('should return 400 if invalid objectid', async() => {
            const res = await request(server).get('/api/genres/1');
            expect(res.status).toBe(400);
        });
    });

    describe('POST /', () => {
        it('should return 401 if client in not logged in', async() => {
            const res = await request(server)
                .post('/api/genres')
                .send({name:'genre1'});

            expect(res.status).toBe(401);
        });

        it('should return 400 if genre is less than 3 characters', async() => {
            const token = new User().generateAuthToken();

            const res = await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({name:'21'});

            expect(res.status).toBe(400);
        });

        it('should return 400 if genre is more than 50 characters', async() => {
            const token = new User().generateAuthToken();
            const longName = new Array(52).join('a');

            const res = await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({name:longName});

            expect(res.status).toBe(400);
        });

        it('should save the genre if it is valid', async() => {
            const token = new User().generateAuthToken();
            
            const res = await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({name:'genre1'});

            const genre = await Genre.find({name:'genre1'});

            expect(genre).not.toBeNull();
        });

        it('should return the genre if it is valid', async() => {
            const token = new User().generateAuthToken();
            
            const res = await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({name:'genre1'});

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'genre1');
        });
    });
});