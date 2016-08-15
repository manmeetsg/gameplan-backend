import User from '../models/user_model';

import CAS from '../auth/cas';
const cas = new CAS({
  base_url: 'https://login.dartmouth.edu/cas',
  service: 'http://localhost:8080/login',
  version: 2.0,
});

export const login = (req, res) => {
  // Authenticate
  if (req.session.auth && req.session.auth.netid) {
    // Already authenticated
  } else if (req.body.ticket) {
    // Validate with CAS server
    cas.validate(req.body.ticket, (err, status, username, extended) => {
      if (err) {
        if (String(err).indexOf('INVALID_TICKET') !== -1) {
          res.json({ status: 'error', message: 'Invalid ticket.' });
        } else {
          res.json({ status: 'error', message: err });
        }
      } else {
        // Generate session code for authentication on backend
        req.session.regenerate(err => {
          if (err) console.log(err);

          // the auth object contains {name, username, netid} fields
          req.session.auth = extended.attributes;

          // Create user
          const netID = req.session.auth.netid;
          User.findOne({ netID })
          .then(existing => {
            if (!existing) {
              // Create user
              const user = new User();
              user.name = req.session.auth.name;
              user.netID = netID;

              user.save()
              .then(result => {
                res.json({ status: 'success', message: 'User created.' });
              })
              .catch(err => {
                console.log(err);
              });
            } else {
              // User exists, redirect to main page
              res.json({ status: 'success', message: 'Logged in.' });
            }
          })
          .catch(err => {
            console.log(err);
          });
        });
      }
    });
  } else {
    res.json({ status: 'error', message: 'Error.  Must contain ticket.' });
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
