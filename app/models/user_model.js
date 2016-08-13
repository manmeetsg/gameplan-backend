import mongoose, { Schema } from 'mongoose';

// create a schema for posts
const UserSchema = new Schema(
  {
    name: String,
    netID: String,
    groups: [{ type: Schema.Types.ObjectId, ref: 'Group' }],
    active_posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
  },
  {
    timestamps: { createdAt: 'created_at' },
  }
);

// create model class
const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
