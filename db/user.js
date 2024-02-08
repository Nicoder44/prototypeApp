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
    profileImage: { type: String },
    dateNaissance: {
        type: Date,
        required: true
    },
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

userSchema.pre('save', function (next) {
    this.prenom = formatPrenom(this.prenom);
    this.nom = formatNom(this.nom);
    next();
});

function formatPrenom(prenom) {
    return prenom.toLowerCase().replace(/(?:^|\s|-)\S/g, function (match) {
        return match.toUpperCase();
    });
}

function formatNom(nom) {
    return nom.toLowerCase().replace(/(?:^|\s|-)\S/g, function (match) {
        return match.toUpperCase();
    });
}

userSchema.methods.getAge = function () {
    if (this.dateNaissance) {
        const today = new Date();
        const birthDate = new Date(this.dateNaissance);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    } else {
        return null; 
    }
};

const User = mongoose.model("User", userSchema);

module.exports = User;