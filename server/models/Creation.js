import mongoose from 'mongoose';

const creationSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      index: true
    },
    prompt: {
      type: String,
      required: [true, 'Prompt string is required']
    },
    content: {
      type: String,
      required: [true, 'Content result string is required']
    },
    type: {
      type: String,
      required: [true, 'Creation tool type is required'],
      enum: ['article', 'title', 'image', 'bg-remove', 'object-remove', 'resume-review']
    },
    isPublic: {
      type: Boolean,
      default: false
    },
    likes: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

const Creation = mongoose.models.Creation || mongoose.model('Creation', creationSchema);
export default Creation;
