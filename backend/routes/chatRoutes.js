const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { accessChat, fetchChats, createGroupChat } = require('../controllers/chatController');
const router = express.Router();

router.use(protect);
router.route('/').post(accessChat).get(fetchChats);
router.post('/group', createGroupChat);

module.exports = router;
