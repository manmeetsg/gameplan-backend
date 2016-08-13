import mongoose, { Schema } from 'mongoose';

// create a schema for posts
const GroupSchema = new Schema(
  {
    name: String,
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  {
    timestamps: { createdAt: 'created_at' },
  }
);

// create model class
const GroupModel = mongoose.model('Group', GroupSchema);

export default GroupModel;
