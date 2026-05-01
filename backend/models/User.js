const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    username: {
        type: String,
        required: [true, 'Please add a username'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    },
    avatar: {
        type: String,
        default: 'https://res.cloudinary.com/dmhcnht9v/image/upload/v1643084310/avatars/default_avatar_jt9v7w.png'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    otp: {
        code: String,
        expiry: Date
    },
    onlineStatus: {
        type: String,
        enum: ['online', 'offline'],
        default: 'offline'
    },
    lastSeen: {
        type: Date,
        default: Date.now
    },
    blockedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    pinnedChats: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat'
    }]
}, {
    timestamps: true
});

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
