import User from '../models/user_model';

export const login = (req, res) => {
  const netID = req.session.auth.netid;

  // Check if the user exists
  User.findOne({ netID })
  .then(existing => {
    if (!existing) {
      // Create user
      const user = new User();
      user.name = req.session.auth.name;
      user.netID = netID;

      user.save()
      .then(result => {
        res.send(`User created: ${req.session.auth.name}.`);
      })
      .catch(err => {
        console.log(err);
      });
    } else {
      // User exists, redirect to main page
      res.send(`Logged in: ${req.session.auth.name}.`);
    }
  })
  .catch(err => {
    console.log(err);
  });
};

export const logout = (req, res) => {
  res.send('Logged out.');
};
