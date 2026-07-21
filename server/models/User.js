import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: [true, 'Clerk ID is required'],
      unique: true,
      index: true
    },
    email: {
      type: String,
      required: [true, 'Email address is required']
    },
    name: {
      type: String,
      default: ''
    },
    hasUnlimitedAccess: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
