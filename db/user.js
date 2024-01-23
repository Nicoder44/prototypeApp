const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    prenom: {
        type: String,
        required: true
    },
    nom: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    description: String,
    age: Number,
    genre: String
});

const User = mongoose.model("User", userSchema);

module.exports = User;