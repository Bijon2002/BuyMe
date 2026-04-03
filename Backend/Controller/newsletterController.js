const Subscriber = require('../models/subscriberModel');
const nodemailer = require('nodemailer');

// Set up Nodemailer transporter using the provided app password
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// @desc    Subscribe to newsletter
// @route   POST /api/v1/newsletter/subscribe
// @access  Public
exports.subscribe = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ success: false, message: 'Please provide an email' });
        }

        const existingSubscriber = await Subscriber.findOne({ email });
        
        if (existingSubscriber) {
            return res.status(400).json({ success: false, message: 'Email already subscribed' });
        }

        const subscriber = await Subscriber.create({ email });

        // Send a welcome email
        const mailOptions = {
            from: '"BuyMe Premium" <event.vibesz@gmail.com>',
            to: email,
            subject: 'Welcome to the BuyMe Executive List!',
            html: `
                <div style="font-family: 'Inter', 'Helvetica', 'Arial', sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; padding: 40px; border-radius: 20px; border: 1px solid #e1e8ed; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
                    <div style="text-align: center; margin-bottom: 40px;">
                        <h1 style="color: #0f172a; margin: 0; font-size: 32px; font-weight: 900; letter-spacing: -1px;">Buy<span style="color: #febd69;">Me</span></h1>
                        <p style="color: #64748b; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; margin-top: 5px;">The Premium Destination</p>
                    </div>
                    <div style="background: #f8fafc; padding: 35px; border-radius: 15px; border-left: 6px solid #febd69; margin-bottom: 30px;">
                        <h2 style="color: #1e293b; margin-top: 0; font-size: 24px;">Welcome to the Inner Circle 🎉</h2>
                        <p style="color: #475569; font-size: 16px; line-height: 1.8;">You've joined an exclusive community of discerning shoppers. From this moment on, you will receive "First Look" access to our limited-release collections and VIP member pricing.</p>
                    </div>
                    <div style="text-align: center;">
                        <a href="http://localhost:3000" style="display: inline-block; background: #0f172a; color: #ffffff; padding: 16px 35px; text-decoration: none; border-radius: 12px; font-weight: 800; font-size: 16px; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(0,0,0,0.15);">Explore Collections</a>
                    </div>
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 40px 0;">
                    <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0; line-height: 1.6;">
                        © ${new Date().getFullYear()} BuyMe Marketplace. All rights reserved.<br/>
                        You are receiving this because you subscribed to our premium updates.
                    </p>
                </div>
            `
        };

        transporter.sendMail(mailOptions);

        res.status(201).json({
            success: true,
            message: 'Successfully subscribed to the newsletter',
            subscriber
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Utility function to send New Post emails (Called from productController)
exports.sendNewPostEmail = async (product) => {
    try {
        const subscribers = await Subscriber.find();
        if (!subscribers || subscribers.length === 0) return;

        const emails = subscribers.map(sub => sub.email);

        const mailOptions = {
            from: '"BuyMe Premium Alerts" <event.vibesz@gmail.com>',
            bcc: emails,
            subject: `🚀 JUST IN: The New ${product.name} has Arrived`,
            html: `
                <div style="font-family: 'Inter', 'Helvetica', 'Arial', sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; padding: 40px; border-radius: 24px; border: 1px solid #f1f5f9; box-shadow: 0 10px 30px rgba(0,0,0,0.06);">
                    <div style="text-align: center; margin-bottom: 40px;">
                        <h3 style="color: #febd69; font-size: 14px; text-transform: uppercase; letter-spacing: 3px; font-weight: 800; margin-bottom: 10px;">New Arrival Alert</h3>
                        <h1 style="color: #0f172a; margin: 0; font-size: 32px; font-weight: 900; letter-spacing: -1px; line-height: 1.2;">Something special just <span style="color: #73152e;">dropped.</span></h1>
                    </div>
                    
                    <div style="text-align: center; margin-bottom: 40px;">
                        <img src="http://localhost:3000${product.images[0]?.image || '/images/products/5.jpg'}" alt="${product.name}" style="width: 100%; max-width: 450px; height: auto; border-radius: 20px; box-shadow: 0 15px 35px rgba(0,0,0,0.1);">
                    </div>

                    <div style="padding: 0 20px;">
                        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 20px;">
                            <h2 style="color: #0f172a; margin: 0; font-size: 24px; font-weight: 800;">${product.name}</h2>
                            <div style="color: #febd69; font-size: 28px; font-weight: 900;">$${product.price}</div>
                        </div>
                        <p style="color: #64748b; font-size: 16px; line-height: 1.8; margin-bottom: 30px;">
                            ${product.description.length > 180 ? product.description.substring(0, 180) + '...' : product.description}
                        </p>
                        <div style="text-align: center;">
                            <a href="http://localhost:3000/product/${product._id}" style="display: inline-block; background: #0f172a; color: #ffffff; padding: 18px 45px; text-decoration: none; border-radius: 12px; font-weight: 800; font-size: 18px; box-shadow: 0 8px 25px rgba(15,23,42,0.25);">Shop This Product</a>
                        </div>
                    </div>
                    
                    <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 45px 0;">
                    <div style="text-align: center;">
                        <p style="color: #94a3b8; font-size: 12px; margin-bottom: 5px;">You're receiving this because you're a member of the BuyMe Elite list.</p>
                        <p style="color: #94a3b8; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} BuyMe Marketplace. All rights reserved.</p>
                    </div>
                </div>
            `
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) console.error("Email delivery failed:", error);
            else console.log("Elite newsletter sent:", info.response);
        });
    } catch (error) {
        console.error("Newsletter system failure:", error);
    }
};

// @desc    Get all subscribers
// @route   GET /api/v1/newsletter/admin/subscribers
// @access  Private/Admin
exports.getSubscribers = async (req, res) => {
    try {
        const subscribers = await Subscriber.find().sort({ subscribedAt: -1 });
        res.status(200).json({
            success: true,
            count: subscribers.length,
            subscribers
        });
    } catch (error) {
        console.error('Fetch subscribers error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Delete subscriber
// @route   DELETE /api/v1/newsletter/admin/subscribers/:id
// @access  Private/Admin
exports.deleteSubscriber = async (req, res) => {
    try {
        const subscriber = await Subscriber.findByIdAndDelete(req.params.id);
        if (!subscriber) {
            return res.status(404).json({ success: false, message: 'Subscriber not found' });
        }
        res.status(200).json({
            success: true,
            message: 'Subscriber properly removed from database'
        });
    } catch (error) {
        console.error('Delete subscriber error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
