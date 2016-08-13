import mongoose, { Schema } from 'mongoose';
import moment from 'moment';

// create a schema for posts
const PostSchema = new Schema(
  {
    title: String,
    content: String,
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    tags: [String],
    groups: [{ type: Schema.Types.ObjectId, ref: 'Group' }],
    chat: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
    responders: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    expiration: { type: Date, default: () => { return moment(Date.now()).add(1, 'months').toDate(); } },
  },
  {
    timestamps: { createdAt: 'created_at' },
  }
);

// create model class
const PostModel = mongoose.model('Post', PostSchema);

export default PostModel;
