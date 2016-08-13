import { Router } from 'express';
import * as Users from './controllers/user_controller';

import dartAuth from './auth/auth';
const auth = dartAuth({
  service: 'http://localhost:9090',
  prefix: '/api',
  logoutRedirect: 'http://localhost:9090/',
});

const router = Router();

// Base route
router.get('/', (req, res) => {
  if (req.session.auth) {
    res.send('Logged in to backend.');
  } else {
    res.send('Not logged in to backend.');
  }
});

router.get('/login', auth, Users.login);
router.get('/logout', auth, Users.logout);

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
