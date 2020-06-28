const api = require('supertest');
const mongoose = require('mongoose');
const User = require('../models/User');
const app = require('../app');

let id;

afterEach(async () => {
    if (id) await User.findByIdAndDelete(id);
    id = null;
});

describe('GET /api/users/', () => {
    test('returns JSON and status 200', async () => {
        await api(app)
            .get('/api/users')
            .expect('Content-Type', /json/)
            .expect(200);
    });
});

describe('POST /api/users/', () => {
    test('returns status code 201 along w the newly posted entry incl an added id, but wo the password', async () => {
        const newUser = {
            username: Math.random().toString(),
            password: 'password',
            name: 'bar'
        };
        const response = await api(app).post('/api/users').send(newUser);
        expect(response.status).toBe(201);
        expect('id' in response.body).toBe(true);
        expect((() => {
            const user = response.body;
            delete user.id;
            return user;
        })()).toEqual({ name: newUser.name, username: newUser.username });

        id = response.body.id;
    });

    test('returns status code 400 for missing username and/or password', async () => {
        await api(app).post('/api/users').send({}).expect(400);
        await api(app).post('/api/users').send({ username: Math.random().toString() }).expect(400);
        await api(app).post('/api/users').send({ password: 'password' }).expect(400);
    });

    test('returns status code 400 when password or username is too short', async () => {
        await api(app).post('/api/users').send({ username: Math.random().toString(), password: '12' }).expect(400);
        await api(app).post('/api/users').send({ username: 'fo', password: 'password' }).expect(400);
    });

    test('enforces uniqueness of usernames', async () => {
        const newUser = { username: Math.random().toString(), password: 'password' };
        const response = await api(app).post('/api/users').send(newUser).expect(201);
        await api(app).post('/api/users').send(newUser).expect(400);

        id = response.body.id;
    });

    test('does not add invalid entries', async () => {
        const invalidUser = { username: Math.random().toString() };
        await api(app).post('/api/users').send(invalidUser).expect(400).expect(res => res.body !== undefined);
        const empty = await User.findOne(invalidUser);
        expect(empty).toBe(null);
    });
});

// TODO DELETE and GET /:id

afterAll(() => {
    mongoose.connection.close();
});