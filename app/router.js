import { Router } from 'express';
import * as Users from './controllers/user_controller';
import * as Groups from './controllers/group_controller';
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
router.get('/logout', Users.logout);

// User profile
router.get('/user/profile', requireAuth, Users.profile);

// Groups
router.route('/groups')
  .get(requireAuth, Groups.getGroups)
  .post(requireAuth, Groups.createGroup);

router.route('/groups/:id')
  .get(requireAuth, Groups.getGroup)
  .delete(requireAuth, Groups.deleteGroup);

// Main API routes
router.route('/posts')
  .get((req, res) => {
    res.json({ message: 'lol' });
  });

export default router;
