import { Router } from 'express';
import * as Users from './controllers/user_controller';
import * as Groups from './controllers/group_controller';
import * as Posts from './controllers/post_controller';
import { requireAuth } from './services/passport';

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

// Users
router.get('/users', requireAuth, Users.getUsers);
router.get('/users/me', requireAuth, Users.getMe);
router.get('/users/profile', requireAuth, Users.profile);

// Groups
router.route('/groups')
  .get(requireAuth, Groups.getGroups)
  .post(requireAuth, Groups.createGroup);

router.route('/groups/:id')
  .get(requireAuth, Groups.getGroup)
  .put(requireAuth, Groups.updateGroup)
  .delete(requireAuth, Groups.deleteGroup);

// Posts
router.route('/posts')
  .get(requireAuth, Posts.getPosts)
  .post(requireAuth, Posts.createPost);

router.route('/posts/:id')
  .get(requireAuth, Posts.getPost)
  .put(requireAuth, Posts.updatePost)
  .post(requireAuth, Posts.addComment)
  .delete(requireAuth, Posts.deletePost);

router.route('/posts/group/:id')
  .get(requireAuth, Posts.getGroupPosts);

export default router;
