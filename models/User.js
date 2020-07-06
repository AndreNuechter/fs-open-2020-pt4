const mongoose = require('mongoose');
const { MONGO_URL } = require('../utils/constants.js');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3
    },
    passwordHash: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }]
});

mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
userSchema.set('toJSON', {
    transform(_, returnedObject) {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.passwordHash;
    }
});
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);