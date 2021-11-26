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

            const res = await request(server).get('/api/genres/');
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
            //expect(res.body).toMatchObject(genre);
            expect(res.body).toHaveProperty('name', 'genre');
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
        //define the happy path, and then in each test, we change one parameter that
        //clearly aligns with the name of the test.
        let token;
        let name;

        const exec = async () => {
            return await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({name}); //ES6, when name and value are the same add only name
        };

        beforeEach(() => {
            token = new User().generateAuthToken();
            name = 'genre1';
        });

        it('should return 401 if client in not logged in', async() => {
            token = '';
            
            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 400 if genre is less than 3 characters', async() => {
            name = '21';
            
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if genre is more than 50 characters', async() => {
            name = new Array(52).join('a');

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should save the genre if it is valid', async() => {            
            const res = await exec();

            const genre = await Genre.find({name:'genre1'});

            expect(genre).not.toBeNull();
        });

        it('should return the genre if it is valid', async() => {            
            const res = await exec();

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'genre1');
        });
    });

    describe('DELETE /', () => {
        let id;
        let token;

        beforeEach(async() => {
            token = new User({isAdmin:true}).generateAuthToken();
            const genre = new Genre({name:'genre1'});
            await genre.save();
            id = genre._id;
        });

        afterEach(async() => {await Genre.remove({});})

        const exec = async () => {
            return await request(server)
                .delete('/api/genres/' + id)
                .set('x-auth-token', token);
        };

        it('should delete the genre from mongodb if correct genre is passed', async() => {
            const result = await exec();

            const storeGenre = await Genre.findById(id);
            expect(storeGenre).toBeFalsy();
        });

        it('should return the deleted genre if correct genre is passed', async() => {
            const result = await exec();

            expect(result.body).toHaveProperty('_id', id.toHexString());
            expect(result.body).toHaveProperty('name', 'genre1');
        });

        it('should return 404 if invalid id is passed', async() => {
            id = mongoose.Types.ObjectId();
            const result = await exec();

            expect(result.status).toBe(404);
        });

        it('should return 403 if user is not an admin', async() => {
            token = new User().generateAuthToken();
            const result = await exec();

            expect(result.status).toBe(403);
        });
    });

    describe('PUT /', () => {
        let id;
        let token;
        let name;

        beforeEach(async() => {
            token = new User().generateAuthToken();
            const genre = new Genre({name:'genre1'});
            await genre.save();
            id = genre._id.toHexString();
            name = 'genre2';
        });
        
        const exec = async() => {
            return await request(server)
                .put('/api/genres/' + id)
                .set('x-auth-token', token)
                .send({name});
        };
    
        it('should modify name to genre2 in db if correct genre id is passed', async() => {
            const result = await exec();
    
            const genre = await Genre.findById(id);
    
            expect(result.status).toBe(200);
            expect(genre.name).toBe('genre2');
        });

        it('should return 400 if invalid new name is passed', async() => {
            name = '12';
            const result = await exec();
    
            const genre = await Genre.findById(id);
    
            expect(result.status).toBe(400);
        });

        it('should return 404 if invalid genre id is passed', async() => {
            id = new mongoose.Types.ObjectId();
            const result = await exec();
    
            const genre = await Genre.findById(id);
    
            expect(result.status).toBe(404);
        });
    });
});

