const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

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

userSchema.methods.generateAuthToken = function () {
	const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
		expiresIn: "7d",
	});
	return token;
};

userSchema.methods.toString = function () {
    return "[" + this.prenom + " " + this.nom + " (" + this._id + ")]"
};

const User = mongoose.model("User", userSchema);

module.exports = User;