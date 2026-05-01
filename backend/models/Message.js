const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    content: {
        type: String,
        trim: true
    },
    messageType: {
        type: String,
        enum: ['text', 'image', 'video', 'file', 'audio'],
        default: 'text'
    },
    fileUrl: {
        type: String
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat'
    },
    readBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    status: {
        type: String,
        enum: ['sent', 'delivered', 'seen'],
        default: 'sent'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Message', messageSchema);
