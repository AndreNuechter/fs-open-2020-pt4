const jwt = require('jsonwebtoken');
const router = require('express').Router();
const Route = require('../utils/async-handler.js');
const { GET, POST, PUT, DELETE } = require('../utils/http-methods.js');
const { base, id } = require('../utils/request-paths.js');
const { SECRET } = require('../utils/constants.js');
const Blog = require('../models/Blog.js');
const User = require('../models/User.js');

[
    Route(GET, base, async (_, response) => {
        response.json(await Blog.find({}).populate('user', '-blogs'));
    }),
    Route(POST, base, async (request, response) => {
        const { token } = request;
        const decodedToken = jwt.verify(token, SECRET);

        if (!token || !decodedToken.id) {
            return response.status(401).json({ error: 'token missing or invalid' });
        }

        const user = await User.findById(decodedToken.id);

        if (!user) {
            return response.status(401).json({ error: 'token invalid' });
        }

        const newBlog = await new Blog({ ...request.body, user: user.id }).save();

        user.blogs.push(newBlog._id);
        await user.save();
        response.status(201).json(newBlog);
    }),
    Route(DELETE, id, async (request, response) => {
        const { token } = request;
        const decodedToken = jwt.verify(token, SECRET);

        if (!token || !decodedToken.id) {
            return response
                .status(401)
                .json({ error: 'token missing or invalid' });
        }

        const { id } = request.params;
        const blog = await Blog.findById(id);

        if (blog.user.toString() !== decodedToken.id) {
            return response
                .status(401)
                .json({ error: 'not your blog' });
        }

        await Blog.findByIdAndDelete(id);
        response.status(204).end();
    }),
    Route(GET, id, async (request, response) => {
        const { id } = request.params;
        const blog = await Blog.findById(id);
        if (blog) response.json(blog);
        else response.status(404).end();
    }),
    Route(PUT, id, async (request, response) => {
        const { id } = request.params;
        const blog = Blog.findById(id);

        if (!blog) {
            return response.status(404).end();
        }

        const { likes } = request.body;

        await Blog.updateOne({ _id: id }, { likes }, { runValidators: true });
        response.status(200).end();
    })
].forEach(({ method, path, controller }) => router[method](path, controller));

module.exports = router;