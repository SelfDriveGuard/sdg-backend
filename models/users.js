const mongoose = require('mongoose');

const {Schema} = mongoose;

// Schema
const userSchema = new Schema({
    userName: {type: String},
    password: {type: String},
    dev: {type: Boolean},
});

// Model
const users = mongoose.model('users', userSchema);

module.exports = users;
