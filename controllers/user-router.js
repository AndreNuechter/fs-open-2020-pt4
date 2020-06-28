const router = require('express').Router();
const asyncHandler = require('../utils/async-handler.js');
const bcrypt = require('bcrypt');
const User = require('../models/User.js');

router.get('/', asyncHandler(async (_, response) => {
    const users = await User.find({});
    response.json(users);
}));

router.get('/:id', asyncHandler(async (request, response) => {
    const { id } = request.params;
    const user = await User.findById(id);
    if (user) response.json(user);
    else response.status(404).end();
}));

router.delete('/:id', asyncHandler(async (request, response) => {
    const { id } = request.params;
    await User.findByIdAndDelete(id);
    response.status(204).end();
}));

router.post('/', asyncHandler(async (request, response) => {
    const { name, password, username } = request.body;

    if (!password || password.length < 3) {
        const error = new Error('pw < 3');
        error.name = 'ValidationError';
        throw error;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await new User({
        username,
        name,
        passwordHash,
    }).save();

    response.status(201).json(newUser);
}));

module.exports = router;