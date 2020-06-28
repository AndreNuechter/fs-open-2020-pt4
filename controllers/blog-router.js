const router = require('express').Router();
const asyncHandler = require('../utils/async-handler.js');
const Blog = require('../models/Blog.js');

router.get('/', asyncHandler(async (_, response) => {
    const blogs = await Blog.find({});
    response.json(blogs);
}));

router.post('/', asyncHandler(async (request, response) => {
    const newBlog = await new Blog(request.body).save();
    response.status(201).json(newBlog);
}));

router.delete('/:id', asyncHandler(async (request, response) => {
    const { id } = request.params;
    await Blog.findByIdAndDelete(id);
    response.status(204).end();
}));

router.get('/:id', asyncHandler(async (request, response) => {
    const { id } = request.params;
    const blog = await Blog.findById(id);
    if (blog) response.json(blog);
    else response.status(404).end();
}));

router.put('/:id', asyncHandler(async (request, response) => {
    const { id } = request.params;
    const blog = Blog.findById(id);

    if (!blog) {
        const error = new Error('Not found');
        error.name = 'NotFoundError';
        throw error;
    }

    const { likes } = request.body;

    await Blog.updateOne({ _id: id }, { likes }, { runValidators: true });
    response.status(200).end();
}));

module.exports = router;