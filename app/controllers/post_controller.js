import Post from '../models/post_model';

export const createPost = (req, res) => {
  const post = new Post();
  post.title = req.body.title;
  post.tags = req.body.tags.split(' ');
  post.content = req.body.content;
  post.author = req.user._id;

  post.save()
  .then(result => {
    res.json({ message: 'Post created!' });
  })
  .catch(error => {
    res.json({ error });
  });
};

export const getPosts = (req, res) => {
  Post.find().sort('-created_at').exec((err, posts) => {
    if (err) {
      res.json({ message: `Error: ${err}` });
    } else {
      res.json(posts.map(post => {
        return {
          id: post._id,
          tags: post.tags,
          title: post.title,
        };
      }));
    }
  });
};

export const getPost = (req, res) => {
  Post.findById(req.params.id)
  .populate('author')
  .then(post => {
    res.json({
      id: post._id,
      tags: post.tags,
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
