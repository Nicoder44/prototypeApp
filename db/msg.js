const mongoose = require('mongoose');

const msgSchema = mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String,
        default: '',
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const Msg = mongoose.model('Msg', msgSchema);

module.exports = Msg;