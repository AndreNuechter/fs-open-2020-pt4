const morgan = require('morgan');

const methodsWBody = ['PUT', 'POST'];
const config = (tokens, req, res) => [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    methodsWBody.includes(req.method.toUpperCase()) ? JSON.stringify(req.body) : ''
].join(' ');

module.exports = morgan(config);