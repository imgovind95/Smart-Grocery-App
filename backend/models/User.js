import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto'; // Import crypto for token generation

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['buyer', 'seller'],
    default: 'buyer'
  },
  // --- ADD THESE TWO FIELDS ---
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  // --------------------------
}, { timestamps: true });

// Password hashing middleware
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  // And prevent hashing the hash again if only token fields are updated
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// --- ADD THIS NEW METHOD ---
// Method to generate and hash password reset token
userSchema.methods.getResetPasswordToken = function() {
    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // Set expire time (e.g., 10 minutes)
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes in milliseconds

    return resetToken; // Return the original (unhashed) token to be sent via email
};
// -------------------------

const User = mongoose.model('User', userSchema);
export default User;