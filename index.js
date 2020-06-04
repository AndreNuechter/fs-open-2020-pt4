const express = require('express');
const cors = require('cors');
const logger = require('./utils/logger');
const router = require('./controllers/router.js');
const errorHandler = require('./utils/error-handler.js');
const notFoundHandler = require('./utils/not-found-handler.js');
const { PORT } = require('./utils/constants.js');
const app = express();

app.use(cors(), express.json(), logger);
app.use('/api/blogs', router);
app.use(errorHandler, notFoundHandler);

// eslint-disable-next-line no-console
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));