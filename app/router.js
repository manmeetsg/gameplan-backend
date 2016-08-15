import { Router } from 'express';
import * as Users from './controllers/user_controller';
import * as Groups from './controllers/group_controller';

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

// User authentication
router.post('/login', Users.login);
router.get('/logout', auth, Users.logout);

// User profile
router.get('/user/profile', auth, Users.profile);

// Groups
router.route('/groups')
  .get(auth, Groups.getGroups)
  .post(auth, Groups.createGroup);

router.route('/groups/:id')
  .get(auth, Groups.getGroup);

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
