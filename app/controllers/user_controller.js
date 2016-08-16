import User from '../models/user_model';
import jwt from 'jwt-simple';
import dotenv from 'dotenv';
dotenv.config({ silent: true });

// Import CAS authentication
import CAS from '../auth/cas';
const cas = new CAS({
  base_url: 'https://login.dartmouth.edu/cas',
  service: 'http://gameplan.surge.sh/login',
  version: 2.0,
});

// encodes a new token for a user object
function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, process.env.SECRET);
}

export const login = (req, res) => {
  if (req.body.ticket) {
    cas.validate(req.body.ticket, (err, status, username, extended) => {
      if (err) {
        if (String(err).indexOf('INVALID_TICKET') !== -1) {
          res.status(400).json({ status: 'error', message: 'Invalid ticket.' });
        } else {
          res.status(400).json({ status: 'error', message: err });
        }
      } else {
        // Generate session code for authentication on backend
        const netID = extended.attributes.netid;
        User.findOne({ netID })
        .then(existing => {
          if (!existing) {
            // Create user
            const user = new User();
            user.name = extended.attributes.name;
            user.netID = netID;

            user.save()
            .then(result => {
              res.send({ token: tokenForUser(user) });
            })
            .catch(err => {
              res.status(400).json({ status: 'error', message: err });
            });
          } else {
            // User exists, redirect to main page
            res.send({ token: tokenForUser(existing) });
          }
        })
        .catch(err => {
          res.status(400).json({ status: 'error', message: err });
        });
      }
    });
  } else {
    res.status(400).json({ status: 'error', message: 'Did not have ticket.' });
  }
};

export const logout = (req, res) => {
  res.send('Logged out.');
};

export const profile = (req, res) => {
  const netID = req.session.auth.netid;

  User.findOne({ netID })
  .then(user => {
    res.json({
      name: user.name,
      active_posts: user.active_posts,
      groups: user.groups,
    });
  })
  .catch(err => {
    console.log(err);
  });
};
