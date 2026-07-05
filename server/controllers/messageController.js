const Message = require('../models/Message');
const { sendEmail } = require('../config/mail');

// @desc    Submit contact message
// @route   POST /api/contact
// @access  Public
const createMessage = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    const newMessage = await Message.create({
      name,
      email,
      subject: subject || 'New Contact Form Submission',
      message,
    });

    // Send email alert in the background to prevent blocking client response
    const mailHtml = `
      <h3>New Contact Message</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
      <p><strong>Message:</strong></p>
      <div style="background: #f4f4f4; padding: 15px; border-radius: 5px; border-left: 5px solid #7c3aed;">
        ${message.replace(/\n/g, '<br/>')}
      </div>
      <p style="font-size: 0.8rem; color: #666; margin-top: 20px;">
        Submitted on ${new Date().toLocaleString()}
      </p>
    `;

    try {
      await sendEmail({
        subject: `Portfolio Contact: ${subject || 'New Message'}`,
        html: mailHtml,
      });
    } catch (mailError) {
      console.error('Failed to send mail notification:', mailError);
      return res.status(500).json({ 
        success: false, 
        error: 'Email dispatch failed. Please try WhatsApp/email directly.' 
      });
    }

    res.status(201).json({ success: true, data: newMessage });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all messages
// @route   GET /api/messages
// @access  Private
const getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json({ success: true, count: messages.length, data: messages });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark message as read
// @route   PUT /api/messages/:id/read
// @access  Private
const markAsRead = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      res.status(404);
      throw new Error('Message not found');
    }

    message.isRead = true;
    await message.save();

    res.json({ success: true, data: message });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete message
// @route   DELETE /api/messages/:id
// @access  Private
const deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      res.status(404);
      throw new Error('Message not found');
    }

    await Message.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createMessage,
  getMessages,
  markAsRead,
  deleteMessage,
};
