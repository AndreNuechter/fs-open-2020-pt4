const router = require('express').Router();
const Route = require('../utils/async-handler.js');
const { GET, POST, DELETE } = require('../utils/http-methods.js');
const { base, id } = require('../utils/request-paths.js');
const bcrypt = require('bcrypt');
const User = require('../models/User.js');

[
    Route(GET, base, async (_, response) => {
        response.json(await User.find({}).populate('blogs', '-user'));
    }),
    Route(GET, id, async (request, response) => {
        const { id } = request.params;
        const user = await User.findById(id);
        if (user) response.json(user);
        else response.status(404).end();
    }),
    Route(DELETE, id, async (request, response) => {
        const { id } = request.params;
        await User.findByIdAndDelete(id);
        response.status(204).end();
    }),
    Route(POST, base, async (request, response) => {
        const { name, password, username } = request.body;

        if (!password || password.length < 3) {
            const error = new Error('password missing or too short');
            error.name = 'ValidationError';
            throw error;
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = await new User({
            username,
            name,
            passwordHash
        }).save();
        response.status(201).json(newUser);
    })
].forEach(({ method, path, controller }) => router[method](path, controller));

module.exports = router;