const api = require('supertest');
const mongoose = require('mongoose');
const User = require('../models/User');
const app = require('../app');

const generateTestUsername = () => `test-${Math.random()}`;
let id;

afterAll(() => {
    mongoose.connection.close();
});

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
            username: generateTestUsername(),
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
        })()).toEqual({ name: newUser.name, username: newUser.username, blogs: [] });

        id = response.body.id;
    });

    test('returns status code 400 for missing username and/or password', async () => {
        await api(app).post('/api/users').send({}).expect(400);
        await api(app).post('/api/users').send({ username: generateTestUsername() }).expect(400);
        await api(app).post('/api/users').send({ password: 'password' }).expect(400);
    });

    test('returns status code 400 when password or username is too short', async () => {
        await api(app).post('/api/users').send({ username: generateTestUsername(), password: '12' }).expect(400);
        await api(app).post('/api/users').send({ username: 'fo', password: 'password' }).expect(400);
    });

    test('enforces uniqueness of usernames', async () => {
        const newUser = { username: generateTestUsername(), password: 'password' };
        const response = await api(app).post('/api/users').send(newUser).expect(201);
        await api(app).post('/api/users').send(newUser).expect(400);

        id = response.body.id;
    });

    test('does not add invalid entries', async () => {
        const invalidUser = { username: generateTestUsername() };
        await api(app).post('/api/users').send(invalidUser).expect(400).expect(res => res.body !== undefined);
        const empty = await User.findOne(invalidUser);
        expect(empty).toBe(null);
    });
});

describe('DELETE /api/users/:id', () => {
    test('returns status 204 and removes the user', async () => {
        const newUser = { username: generateTestUsername(), password: 'password' };
        const response = await api(app).post('/api/users').send(newUser);
        await api(app)
            .delete(`/api/users/${response.body.id}`)
            .expect(204);
        await api(app)
            .get(`/api/users/${response.body.id}`)
            .expect(404);
    });
});

describe('GET /api/users/:id', () => {
    test('returns the specified user or 404', async () => {
        const newUser = { username: generateTestUsername(), password: 'password' };
        const postResponse = await api(app).post('/api/users').send(newUser);
        const getResponse = await api(app)
            .get(`/api/users/${postResponse.body.id}`)
            .expect('Content-Type', /json/)
            .expect(200);
        expect(getResponse.body.username).toBe(newUser.username);

        id = postResponse.body.id;
    });
});