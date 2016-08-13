import { Router } from 'express';
// import * as Posts from './controllers/post_controller';

const router = Router();

// Base route
router.get('/', (req, res) => {
  res.json({ message: 'GamePlan API functional!' });
});

// Main API routes
router.route('/posts')
  .get((req, res) => {
    res.json({ message: 'lol' });
  });

// your routes will go here
// router.route('/posts')
//   .get(Posts.getPosts)
//   .post(Posts.createPost);

// router.route('/posts/:id')
//   .get(Posts.getPost)
//   .put(Posts.updatePost)
//   .delete(Posts.deletePost);

export default router;
