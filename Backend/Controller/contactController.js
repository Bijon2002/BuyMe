const Contact = require('../models/contactModel');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// @desc    Submit a new contact message
// @route   POST /api/v1/contact/submit
// @access  Public
exports.submitContact = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({ success: false, message: 'Please provide all fields' });
        }

        const contact = await Contact.create({ name, email, subject, message });

        res.status(201).json({
            success: true,
            message: 'Your premium inquiry has been successfully sent. A representative will be in touch shortly.',
            contact
        });
    } catch (error) {
        console.error('Contact submit error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get all contact messages
// @route   GET /api/v1/admin/contacts
// @access  Private/Admin
exports.getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: contacts.length,
            contacts
        });
    } catch (error) {
        console.error('Fetch contacts error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Reply to a contact message and mark as replied
// @route   POST /api/v1/admin/contacts/reply/:id
// @access  Private/Admin
exports.replyContact = async (req, res) => {
    try {
        const { replyMessage } = req.body;
        const contactId = req.params.id;

        if (!replyMessage) {
            return res.status(400).json({ success: false, message: 'Reply message cannot be empty' });
        }

        const contact = await Contact.findById(contactId);

        if (!contact) {
            return res.status(404).json({ success: false, message: 'Contact record not found' });
        }

        if (contact.isReplied) {
            return res.status(400).json({ success: false, message: 'Already replied to this ticket' });
        }

        const mailOptions = {
            from: '"BuyMe Executive Support" <event.vibesz@gmail.com>',
            to: contact.email,
            subject: `Re: ${contact.subject}`,
            html: `
                <div style="font-family: 'Inter', 'Helvetica', 'Arial', sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; padding: 40px; border-radius: 20px; border: 1px solid #e1e8ed; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #0f172a; margin: 0; font-size: 32px; font-weight: 900; letter-spacing: -1px;">Buy<span style="color: #febd69;">Me</span></h1>
                        <p style="color: #64748b; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; margin-top: 5px;">Executive Support</p>
                    </div>
                    
                    <p style="color: #1e293b; font-size: 16px; margin-bottom: 20px;">Dear <b>${contact.name}</b>,</p>
                    
                    <div style="background: #f8fafc; padding: 25px; border-radius: 15px; border-left: 4px solid #febd69; margin-bottom: 30px;">
                        <p style="color: #475569; font-size: 15px; line-height: 1.8; margin: 0; white-space: pre-wrap;">${replyMessage}</p>
                    </div>

                    <div style="padding: 20px; border: 1px dashed #e2e8f0; border-radius: 12px; margin-bottom: 30px;">
                        <p style="color: #94a3b8; font-size: 13px; margin: 0 0 10px 0;"><b>Original Message:</b></p>
                        <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 0; font-style: italic;">"${contact.message}"</p>
                    </div>
                    
                    <p style="color: #1e293b; font-size: 16px;">Warm regards,<br><b>The BuyMe Premium Team</b></p>
                    
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
                    <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0; line-height: 1.6;">
                        © ${new Date().getFullYear()} BuyMe Marketplace. All rights reserved.<br/>
                    </p>
                </div>
            `
        };

        transporter.sendMail(mailOptions, async (error, info) => {
            if (error) {
                console.error("Email reply failed:", error);
                return res.status(500).json({ success: false, message: 'Failed to send email. Check Nodemailer config.' });
            }
            
            contact.isReplied = true;
            await contact.save();

            res.status(200).json({
                success: true,
                message: 'Reply sent successfully recorded.',
                contact
            });
        });

    } catch (error) {
        console.error('Contact reply error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
