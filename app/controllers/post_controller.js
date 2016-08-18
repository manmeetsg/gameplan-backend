import Post from '../models/post_model';
import Group from '../models/group_model';

export const createPost = (req, res) => {
  const post = new Post();
  post.title = req.body.title;
  post.description = req.body.description;
  post.author = req.user._id;
  post.groups = req.body.groups;
  post.responders = [req.user._id];

  post.save()
  .then(result => {
    res.json({ message: 'Post created!' });
  })
  .catch(error => {
    res.json({ error });
  });
};

export const getPosts = (req, res) => {
  Group.find({ members: req.user._id })
  .then(groups => {
    Post.find({ groups: { $in: groups.map(group => { return group._id; }) } })
    .sort('-created_at')
    .populate('author')
    .populate('responders')
    .populate('groups')
    .then(posts => {
      res.json(posts);
    })
    .catch(err => {
      res.json({ message: `Error: ${err}` });
    });
  })
  .catch(err => {
    res.json({ message: `Error: ${err}` });
  });
};

export const getGroupPosts = (req, res) => {
  Post.find({ groups: req.params.id })
  .sort('-created_at')
  .populate('author')
  .populate('responders')
  .populate('groups')
  .then(post => {
    res.json(post);
  })
  .catch(err => {
    res.json({ message: `Error: ${err}` });
  });
};

export const getPost = (req, res) => {
  Post.findById(req.params.id)
  .populate('author')
  .then(post => {
    res.json({
      id: post._id,
      title: post.title,
      content: post.content,
      author: post.author,
    });
  })
  .catch(err => {
    res.json({ message: `Error: ${err}` });
  });
};

export const deletePost = (req, res) => {
  Post.remove({ _id: req.params.id }, (err) => {
    if (err) {
      res.json({ message: `Error: ${err}` });
    } else {
      res.json({ message: 'Deleted!' });
    }
  });
};

export const updatePost = (req, res) => {
  Post.findOneAndUpdate({ _id: req.params.id }, req.body, (err) => {
    if (err) {
      res.json({ message: `Error: ${err}` });
    } else {
      res.json({ message: 'Updated!' });
    }
  });
};
