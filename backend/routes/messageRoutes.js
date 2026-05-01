const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { sendMessage, allMessages } = require('../controllers/messageController');
const { upload, isCloudinaryConfigured } = require('../utils/storage');
const router = express.Router();

router.use(protect);
router.route('/').post(sendMessage);
router.route('/:chatId').get(allMessages);
router.post('/upload', upload.single('file'), (req, res) => {
    let url = req.file.path;
    if (!isCloudinaryConfigured) {
        // Construct the URL for local storage
        url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }
    res.json({ url, type: req.file.mimetype });
});

module.exports = router;
