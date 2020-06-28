const express = require('express');
const app = express();
const cors = require('cors');
const logger = require('./utils/logger');
const blogRouter = require('./controllers/blog-router.js');
const userRouter = require('./controllers/user-router.js');
const errorHandler = require('./utils/error-handler.js');
const notFoundHandler = require('./utils/not-found-handler.js');

app.use(cors(), express.json(), logger);
app.use('/api/blogs', blogRouter);
app.use('/api/users', userRouter);
app.use(errorHandler, notFoundHandler);

module.exports = app;