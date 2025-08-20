import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  // store hashed password, not plain
  passwordHash: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'superAdmin'],
    default: 'admin',
  },
}, { timestamps: true });

// 👇 important: allow only 1 superAdmin
userSchema.index(
  { role: 1 },
  { unique: true, partialFilterExpression: { role: 'superAdmin' } }
);

export default mongoose.models?.User || mongoose.model('User', userSchema);
