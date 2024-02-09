const mongoose = require('mongoose');

const matchSchema = mongoose.Schema({
    Liker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    Liked: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    matchAccepted: {
        type: Boolean,
        default: false,
    }
});

const Match = mongoose.model('Match', matchSchema);

module.exports = Match;