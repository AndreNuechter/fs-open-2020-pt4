const mongoose = require('mongoose');
const { MONGO_URL } = require('../utils/constants.js');

const blogSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: String,
    url: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
blogSchema.set('toJSON', {
    transform(_, returnedObject) {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

module.exports = mongoose.model('Blog', blogSchema);