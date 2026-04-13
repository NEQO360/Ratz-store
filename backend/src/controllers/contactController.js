const Contact = require('../models/Contact');
const { sendAdminNewMessageNotification, sendReplyToCustomer } = require('../utils/emailService');

exports.submitContact = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        error: 'Please fill in all fields'
      });
    }

    const contact = await Contact.create({ name, email, subject, message });

    sendAdminNewMessageNotification(contact).catch(err => console.error('Admin email error:', err));

    res.status(201).json({ success: true, data: contact });
  } catch (err) {
    next(err);
  }
};

exports.getMessages = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Contact.countDocuments(query);
    const messages = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const counts = {
      total: await Contact.countDocuments(),
      unread: await Contact.countDocuments({ status: 'unread' }),
      read: await Contact.countDocuments({ status: 'read' }),
      replied: await Contact.countDocuments({ status: 'replied' })
    };

    res.status(200).json({
      success: true,
      count: messages.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      counts,
      data: messages
    });
  } catch (err) {
    next(err);
  }
};

exports.updateMessageStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['unread', 'read', 'replied'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status' });
    }

    const message = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ success: false, error: 'Message not found' });
    }

    res.status(200).json({ success: true, data: message });
  } catch (err) {
    next(err);
  }
};

exports.replyToMessage = async (req, res, next) => {
  try {
    const { reply } = req.body;

    if (!reply || !reply.trim()) {
      return res.status(400).json({ success: false, error: 'Reply message is required' });
    }

    const message = await Contact.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ success: false, error: 'Message not found' });
    }

    await sendReplyToCustomer(message, reply);

    message.status = 'replied';
    await message.save();

    res.status(200).json({ success: true, data: message });
  } catch (err) {
    next(err);
  }
};

exports.deleteMessage = async (req, res, next) => {
  try {
    const message = await Contact.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({ success: false, error: 'Message not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
