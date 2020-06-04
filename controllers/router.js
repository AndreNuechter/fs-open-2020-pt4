const router = require('express').Router();
const routes = require('./routes.js');

routes.forEach(({ method, route, cb }) => router[method](route, cb));
module.exports = router;