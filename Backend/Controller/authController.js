const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ==================== TOKEN GENERATORS ====================
// Generate Access Token (15 minutes)
const generateAccessToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '15m'  // Short-lived: 15 minutes
  });
};

// Generate Refresh Token (7 days)
const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '7d'   // Long-lived: 7 days
  });
};

// Old token generator (keep for backward compatibility or remove)
// const generateToken = (id, role) => {
//   return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
// }

// ==================== REGISTER USER ====================
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role, profilePic, dob, phone } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide name, email, and password' 
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ 
        success: false,
        message: 'User already exists with this email' 
      });
    }

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: role || 'user', // default to 'user' if not provided
      profilePic: profilePic || null,
      dob: dob || null,
      phone: phone || null,
      lastLogin: new Date()
    });

    // Generate BOTH tokens
    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    // Send response
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePic: user.profilePic,
        dob: user.dob,
        phone: user.phone,
        isActive: user.isActive,
        accessToken: accessToken,    // 15 minutes
        refreshToken: refreshToken   // 7 days
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle duplicate email error
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false,
        message: 'Email already registered' 
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        success: false,
        message: messages.join(', ') 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Server error during registration' 
    });
  }
}

// ==================== LOGIN USER ====================
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide email and password' 
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({ 
        success: false,
        message: 'Account is deactivated. Please contact support.' 
      });
    }

    // Check password
    const isPasswordValid = await user.matchPassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate BOTH tokens
    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    // Send response
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePic: user.profilePic,
        dob: user.dob,
        phone: user.phone,
        isActive: user.isActive,
        emailVerified: user.emailVerified,
        lastLogin: user.lastLogin,
        accessToken: accessToken,    // 15 minutes
        refreshToken: refreshToken   // 7 days
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during login' 
    });
  }
}

// ==================== REFRESH TOKEN ====================
// @desc    Refresh access token
// @route   POST /api/v1/auth/refresh-token
// @access  Public (needs valid refresh token)
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token is required'
      });
    }
    
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    
    // Find user
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Generate new access token
    const newAccessToken = generateAccessToken(user._id, user.role);
    
    res.json({
      success: true,
      accessToken: newAccessToken,
      message: 'Access token refreshed successfully'
    });
    
  } catch (error) {
    console.error('Refresh token error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Refresh token expired. Please login again.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// ==================== LOGOUT ====================
// @desc    Logout user
// @route   POST /api/v1/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  try {
    // Note: For proper logout, you might want to:
    // 1. Store refresh tokens in DB and delete them here
    // 2. Maintain a blacklist of tokens
    // For now, just return success - frontend clears tokens
    
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// ==================== GET USER PROFILE ====================
// @desc    Get user profile (Protected route)
// @route   GET /api/v1/auth/me
// @access  Private
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password -passwordResetToken -passwordResetExpires')
      .populate('favorites');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}

// ==================== UPDATE USER PROFILE ====================
// @desc    Update user profile (Protected route)
// @route   PUT /api/v1/auth/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update fields if provided
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.dob = req.body.dob || user.dob;
    user.phone = req.body.phone || user.phone;
    
    // Handled profilePic from Multer or plain URL
    if (req.file) {
      user.profilePic = `/uploads/${req.file.filename}`;
    } else if (req.body.profilePic) {
      user.profilePic = req.body.profilePic;
    }

    // If password is being updated
    if (req.body.password) {
      user.password = req.body.password;
    }

    // Update billing address if provided
    if (req.body.billingAddress) {
      const addr = typeof req.body.billingAddress === 'string'
        ? JSON.parse(req.body.billingAddress)
        : req.body.billingAddress;
      user.billingAddress = {
        street: addr.street || user.billingAddress?.street || '',
        city: addr.city || user.billingAddress?.city || '',
        postalCode: addr.postalCode || user.billingAddress?.postalCode || '',
        country: addr.country || user.billingAddress?.country || '',
      };
    }

    const updatedUser = await user.save();

    // Generate new access token if email or password changed
    let accessToken;
    if (req.body.email || req.body.password) {
      accessToken = generateAccessToken(updatedUser._id, updatedUser.role);
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        profilePic: updatedUser.profilePic,
        dob: updatedUser.dob,
        phone: updatedUser.phone,
        isActive: updatedUser.isActive,
        billingAddress: updatedUser.billingAddress,
        accessToken: accessToken || req.headers.authorization?.split(' ')[1]
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    
    // Handle duplicate email
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email already in use'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}

// ==================== TOGGLE FAVORITE ====================
// @desc    Toggle product in favorites
// @route   POST /api/v1/auth/favorites/:productId
// @access  Private
exports.toggleFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const productId = req.params.productId;

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isFavorited = user.favorites.includes(productId);

    if (isFavorited) {
      user.favorites = user.favorites.filter(id => id.toString() !== productId.toString());
    } else {
      user.favorites.push(productId);
    }

    await user.save();
    
    // Return updated populated favorites
    const updatedUser = await User.findById(req.user._id).populate('favorites');

    res.json({
      success: true,
      message: isFavorited ? 'Removed from favorites' : 'Added to favorites',
      favorites: updatedUser.favorites
    });
  } catch (error) {
    console.error('Toggle favorite error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ==================== GOOGLE LOGIN ====================
// @desc    Login or register with Google
// @route   POST /api/v1/auth/google
// @access  Public
exports.googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: 'Google credential is required'
      });
    }

    // Verify the Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture, email_verified } = payload;

    // Check if user already exists
    let user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      // User exists — update Google info if not already set
      if (!user.googleId) {
        user.googleId = googleId;
        user.authProvider = user.authProvider === 'local' ? 'local' : 'google';
      }
      if (!user.profilePic && picture) {
        user.profilePic = picture;
      }
      user.emailVerified = email_verified || user.emailVerified;
      user.lastLogin = new Date();
      await user.save();
    } else {
      // Create new user from Google profile
      user = await User.create({
        name,
        email: email.toLowerCase(),
        googleId,
        authProvider: 'google',
        profilePic: picture || null,
        emailVerified: email_verified || false,
        isActive: true,
        lastLogin: new Date()
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    res.json({
      success: true,
      message: 'Google login successful',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePic: user.profilePic,
        dob: user.dob,
        phone: user.phone,
        isActive: user.isActive,
        emailVerified: user.emailVerified,
        lastLogin: user.lastLogin,
        accessToken,
        refreshToken
      }
    });

  } catch (error) {
    console.error('Google login error:', error);

    if (error.message?.includes('Token used too late') || error.message?.includes('Invalid token')) {
      return res.status(401).json({
        success: false,
        message: 'Google authentication failed. Please try again.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during Google login'
    });
  }
};