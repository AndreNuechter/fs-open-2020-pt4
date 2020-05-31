const mongoose = require('mongoose');
const { MONGO_URL } = require('../util/constants.js');

const blogSchema = mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number
});

mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = mongoose.model('Blog', blogSchema);