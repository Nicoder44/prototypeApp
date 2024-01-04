const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
    titre: String,
    contenu: String
});

const model = mongoose.model("Blog", blogSchema);

module.exports = model;