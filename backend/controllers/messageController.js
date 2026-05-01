const Message = require('../models/Message');
const User = require('../models/User');
const Chat = require('../models/Chat');

// @desc    Get all messages for a chat
// @route   GET /api/messages/:chatId
// @access  Protected
exports.allMessages = async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId })
            .populate('sender', 'name avatar email')
            .populate('chat');
        
        // Mark messages as seen when fetched
        await Message.updateMany(
            { chat: req.params.chatId, sender: { $ne: req.user._id }, status: { $ne: 'seen' } },
            { $set: { status: 'seen' } }
        );

        res.json(messages);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Send a message
// @route   POST /api/messages
// @access  Protected
exports.sendMessage = async (req, res) => {
    const { content, chatId, messageType, fileUrl } = req.body;

    if (!chatId || (!content && !fileUrl)) {
        console.log('Invalid data passed into request');
        return res.sendStatus(400);
    }

    var newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
        messageType: messageType || 'text',
        fileUrl: fileUrl,
    };

    try {
        var message = await Message.create(newMessage);

        message = await message.populate('sender', 'name avatar');
        message = await message.populate('chat');
        message = await User.populate(message, {
            path: 'chat.users',
            select: 'name avatar email',
        });

        await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

        res.json(message);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
