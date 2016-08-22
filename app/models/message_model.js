import mongoose, { Schema } from 'mongoose';

// create a schema for messsages
const MessageSchema = new Schema(
  {
    text: String,
    poster: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: { createdAt: 'created_at' },
  }
);

// create model class
const MessageModel = mongoose.model('Message', MessageSchema);

export default MessageModel;
