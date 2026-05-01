const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRE,
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
        const { name, username, password } = req.body;

        const userExists = await User.findOne({ username });

        if (userExists) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const user = await User.create({
            name,
            username,
            password,
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            username: user.username,
            avatar: user.avatar,
            token: generateToken(user._id),
            refreshToken: generateRefreshToken(user._id),
        });
    } catch (error) {
        console.error('Signup Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username }).select('+password');

        if (user && (await user.matchPassword(password))) {
            const token = generateToken(user._id);
            const refreshToken = generateRefreshToken(user._id);

            res.json({
                _id: user._id,
                name: user.name,
                username: user.username,
                avatar: user.avatar,
                token,
                refreshToken
            });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Refresh token
// @route   POST /api/auth/refresh
// @access  Public
exports.refresh = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: 'No refresh token' });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const newToken = generateToken(decoded.id);

        res.json({ token: newToken });
    } catch (error) {
        res.status(401).json({ message: 'Invalid refresh token' });
    }
};


// @desc    Search users
// @route   GET /api/auth/search?search=...
// @access  Protected
exports.searchUsers = async (req, res) => {
    const keyword = req.query.search
        ? {
            $or: [
                { name: { $regex: req.query.search, $options: 'i' } },
                { username: { $regex: req.query.search, $options: 'i' } },
            ],
        }
        : {};

    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.send(users);
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Protected
exports.updateProfile = async (req, res) => {
    try {
        const { name, avatar } = req.body;
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = name || user.name;
            user.avatar = avatar || user.avatar;
            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                username: updatedUser.username,
                avatar: updatedUser.avatar,
                token: generateToken(updatedUser._id),
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile' });
    }
};
