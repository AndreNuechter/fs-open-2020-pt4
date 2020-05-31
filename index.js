const express = require('express');
const cors = require('cors');
const logger = require('./util/logger');
const router = require('./controller/Router.js');
const errorHandler = require('./util/error-handler.js');
const notFoundHandler = require('./util/not-found-handler.js');
const { PORT } = require('./util/constants.js');
const app = express();

app.use(cors(), express.json(), logger);
app.use('/api/blogs', router);
app.use(errorHandler, notFoundHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));