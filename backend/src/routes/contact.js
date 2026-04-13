const express = require('express');
const router = express.Router();
const {
  submitContact,
  getMessages,
  updateMessageStatus,
  replyToMessage,
  deleteMessage
} = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', submitContact);

router.get('/', protect, authorize('admin', 'superadmin'), getMessages);
router.put('/:id/status', protect, authorize('admin', 'superadmin'), updateMessageStatus);
router.post('/:id/reply', protect, authorize('admin', 'superadmin'), replyToMessage);
router.delete('/:id', protect, authorize('admin', 'superadmin'), deleteMessage);

module.exports = router;
