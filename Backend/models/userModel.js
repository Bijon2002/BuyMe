const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  googleId: { type: String, default: null },
  authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  profilePic: { type: String, default: null },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  dob: { type: Date },
  phone: { type: String },
  billingAddress: {
    street: { type: String, default: '' },
    city: { type: String, default: '' },
    postalCode: { type: String, default: '' },
    country: { type: String, default: '' },
  },
  isActive: { type: Boolean, default: true },
  emailVerified: { type: Boolean, default: false },
  lastLogin: { type: Date },
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date },
    refreshToken: { type: String },
  refreshTokenExpires: { type: Date },
}, { timestamps: true });


// SIMPLIFIED version - works without next parameter issues
userSchema.pre('save', async function() {
  // Only hash the password if it has been modified (or is new)
  if (this.isModified('password')) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
      throw error;
    }
  }
});

// Method to match entered password with hashed password
userSchema.methods.matchPassword = async function(enteredPassword) {
  // Google-only users have no password
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;