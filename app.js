const express = require('express');
const app = express();
const cors = require('cors');
const logger = require('./utils/logger');
const blogRouter = require('./controllers/blog-router.js');
const userRouter = require('./controllers/user-router.js');
const loginRouter = require('./controllers/login-router.js');
const testingRouter = require('./controllers/testing-router.js');
const tokenExtractor = require('./utils/token-extractor.js');
const errorHandler = require('./utils/error-handler.js');
const notFoundHandler = require('./utils/not-found-handler.js');

app.use(tokenExtractor, cors(), express.json(), logger);
app.use('/api/blogs', blogRouter);
app.use('/api/users', userRouter);
app.use('/api/login', loginRouter);
app.use('/api/testing', testingRouter);
app.use(errorHandler, notFoundHandler);

module.exports = app;