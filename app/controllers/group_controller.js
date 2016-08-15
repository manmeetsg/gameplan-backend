import Group from '../models/group_model';
import User from '../models/user_model';

export const getGroups = (req, res) => {
  const netID = req.user.netID;

  User.findOne({ netID })
  .populate('group')
  .then(user => {
    res.json(user.groups);
  })
  .catch(err => {
    console.log(err);
  });
};

export const getGroup = (req, res) => {
  Group.findById(req.params.id)
  .populate('members')
  .then(group => {
    res.json(group);
  })
  .catch(err => {
    console.log(err);
  });
};

export const createGroup = (req, res) => {
  // const group = new Group();
  // group.name = req.body.name;
  // group.owner = req.user._id;

  console.log(req.user);
  res.send('Test');

  // post.save()
  // .then(result => {
  //   res.json({ message: 'Post created!' });
  // })
  // .catch(error => {
  //   res.json({ error });
  // });
};
