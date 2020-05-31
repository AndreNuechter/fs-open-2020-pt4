const Route = require('./Route.js');
const Blog = require('../model/Blog.js');

module.exports = [
    Route('get', '/', (_, response) => {
        Blog
            .find({})
            .then(blogs => {
                response.json(blogs);
            });
    }),
    Route('post', '/', (request, response) => {
        new Blog(request.body)
            .save()
            .then(result => {
                response.status(201).json(result);
            });
    })
];