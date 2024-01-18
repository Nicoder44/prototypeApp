const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    prenom: {
        type: String,
        required: true
    },
    nom: String,
    password: {
        type: String,
        required: true
    },
    description: String,
    age: Number,
    genre: String
});

const User = mongoose.model("User", userSchema);

module.exports = User;