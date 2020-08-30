const router = require('express').Router();
const Route = require('../utils/async-handler.js');
const { POST } = require('../utils/http-methods.js');
const { base } = require('../utils/request-paths.js');
const User = require('../models/User.js');
const Blog = require('../models/Blog.js');

[
    Route(POST, base, async (request, response) => {
        response.end('awake');
    }),
    Route(POST, '/reset', async (_, response) => {
        await User.deleteMany({});
        await Blog.deleteMany({});
        response.end();
    })
].forEach(({ method, path, controller }) => router[method](path, controller));

module.exports = router;