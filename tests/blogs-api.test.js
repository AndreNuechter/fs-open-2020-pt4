const api = require('supertest');
const mongoose = require('mongoose');
const Blog = require('../models/Blog');
const User = require('../models/User');
const testBlogs = require('./test-blogs');
const app = require('../app');

let auth;
let id;
let post;

beforeAll(async () => {
    const testUserData = { username: Math.random().toString(), password: 'password' };
    const testUserRequest = await api(app).post('/api/users').send(testUserData);
    const tokenRequest = await api(app).post('/api/login').send(testUserData);
    auth = { Authorization: `bearer ${tokenRequest.body.token}` };
    id = testUserRequest.body.id.toString();
    post = newBlog => api(app).post('/api/blogs').set(auth).send(newBlog);
});

afterAll(async () => {
    await User.findByIdAndDelete(id);
    mongoose.connection.close();
});

beforeEach(async () => {
    await Blog.deleteMany({});
    await Promise.all(testBlogs.map((blog) => new Blog({ ...blog, user: id }).save()));
});

describe('GET /api/blogs/', () => {
    test('returns JSON', async () => {
        await api(app)
            .get('/api/blogs')
            .expect('Content-Type', /json/)
            .expect(200);
    });

    test('returns all test entries', async () => {
        const response = await api(app).get('/api/blogs');
        expect(response.body.length).toBe(testBlogs.length);
    });

    test('returns entries with an id property', async () => {
        const response = await api(app).get('/api/blogs');
        expect(response.body.every(b => 'id' in b)).toBe(true);
    });
});

describe('POST /api/blogs/', () => {
    const newBlog = { title: 'foo', author: 'bar', url: '/', likes: 1 };

    test('returns status code 401 when no token is provided', async () => {
        await api(app).post('/api/blogs').send(newBlog).expect(401);
    });

    test('returns the newly posted entry with an added id', async () => {
        const response = await post(newBlog);

        expect('id' in response.body).toBe(true);
        expect((() => {
            const blog = response.body;
            delete blog.id;
            return blog;
        })()).toEqual({ ...newBlog, user: id });
    });

    test('the total number of blogs increments by one after a post', async () => {
        await post(newBlog);
        const response = await api(app).get('/api/blogs');
        expect(response.body.length).toBe(testBlogs.length + 1);
    });

    test('the likes property of a new blog defaults to 0 if left empty', async () => {
        delete newBlog.likes;
        const response = await post(newBlog);
        expect(response.body.likes).toBe(0);
    });

    test('returns status code 400 for missing title and/or url', async () => {
        await post({}).expect(400);
        await post({ title: 'foo' }).expect(400);
        await post({ url: '/' }).expect(400);
    });

    test('does not add invalid entries', async () => {
        await post({}).expect(400);
        await post({ title: 'foo' }).expect(400);
        await post({ url: '/' }).expect(400);
        const response = await api(app).get('/api/blogs');
        expect(response.body.length).toBe(testBlogs.length);
    });
});

describe('DELETE /api/blogs/:id', () => {
    test('requires a user token and returns status 401 if none or the wrong is provided', async () => {
        const id = testBlogs[0]._id;
        const wrongToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QtMC42NDk5MzQzMzUyMDkwNzgzIiwiaWQiOiI1ZjAzMzNiNjEzNTk1ZDBkYzA0OTcxNTUiLCJpYXQiOjE1OTQwNjIzMDR9.yll9nIUL8sR4utgjOLJZbnmVcKiZSATqWz3NS20meFk';
        await api(app).delete(`/api/blogs/${id}`).expect(401);
        await api(app).delete(`/api/blogs/${id}`).set({ Authorization: `bearer ${wrongToken}` }).expect(401);
        await api(app).get(`/api/blogs/${id}`).expect(200);
    });

    test('returns status code 204 and causes the identified entry to be deleted', async () => {
        const id = testBlogs[0]._id;
        await api(app).get(`/api/blogs/${id}`).expect(200);
        await api(app).delete(`/api/blogs/${id}`).set(auth).expect(204);
        await api(app).get(`/api/blogs/${id}`).expect(404);
    });
});

describe('GET /api/blogs/:id', () => {
    test('returns the identified entry or status code 404', async () => {
        const firstTestBlog = testBlogs[0];
        const response = await api(app).get(`/api/blogs/${firstTestBlog._id}`);
        const firstBlog = response.body;
        expect(firstBlog.title).toBe(firstTestBlog.title);
        expect(firstBlog.author).toBe(firstTestBlog.author);
        expect(firstBlog.likes).toBe(firstTestBlog.likes);
        await api(app).delete(`/api/blogs/${firstTestBlog._id}`).set(auth);
        await api(app).get(`/api/blogs/${firstTestBlog._id}`).expect(404);
    });

    test('returns status code 400 for invalid ids', async () => {
        await api(app).get('/api/blogs/fooBar').expect(400);
    });
});

describe('PUT /api/blogs/:id', () => {
    test('updates the likes of the identified entry and returns status code 200', async () => {
        const firstTestBlog = testBlogs[0];
        const firstGetRequest = await api(app).get(`/api/blogs/${firstTestBlog._id}`);
        const blogBeforeUpdate = firstGetRequest.body;
        expect(blogBeforeUpdate.likes).toBe(firstTestBlog.likes);

        const likes = Math.trunc(Math.random() * 1e5);
        const putRequest = await api(app).put(`/api/blogs/${firstTestBlog._id}`).send({ likes });
        expect(putRequest.status).toBe(200);

        const secondGetRequest = await api(app).get(`/api/blogs/${firstTestBlog._id}`);
        const blogAfterUpdate = secondGetRequest.body;
        expect(blogAfterUpdate.likes).toBe(likes);
    });

    test('returns status code 404 for non-existing entries', async () => {
        await api(app).put('/api/blogs/#fff').expect(404);
    });
});