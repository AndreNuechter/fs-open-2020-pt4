const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = require('express').Router();
const Route = require('../utils/async-handler.js');
const { POST } = require('../utils/http-methods.js');
const { base } = require('../utils/request-paths.js');
const { SECRET } = require('../utils/constants.js');
const User = require('../models/User.js');

[
    Route(POST, base, async (request, response) => {
        const { username, password } = request.body;
        const user = await User.findOne({ username });

        if (!user || !await bcrypt.compare(password, user.passwordHash)) {
            return response.status(401).json({
                error: 'invalid username and/or password'
            });
        }

        const token = jwt.sign({
            username,
            id: user.id,
        }, SECRET);

        response.json({ token, username, name: user.name });
    })
].forEach(({ method, path, controller }) => router[method](path, controller));

module.exports = router;