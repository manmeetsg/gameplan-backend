import Group from '../models/group_model';
import User from '../models/user_model';

export const getGroups = (req, res) => {
  const netID = req.user.netID;

  User.findOne({ netID })
  .populate('groups')
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

export const deleteGroup = (req, res) => {
  // TODO: Need to check that you actually own it
  Group.remove({ _id: req.params.id }, (err) => {
    if (err) {
      res.json({ message: `Error: ${err}` });
    } else {
      res.json({ message: 'Deleted!' });
    }
  });
};

export const createGroup = (req, res) => {
  // Create the group, with the creator as the owner and single member
  const group = new Group();
  group.name = req.body.name;
  group.owner = req.user._id;
  group.members = [req.user._id];

  group.save()
  .then(result => {
    User.findOneAndUpdate({ netID: req.user.netID }, {
      groups: [result._id],
    })
    .then(user => {
      // Successfully added
      res.json({ message: 'Group created!' });
    })
    .catch(error => {
      console.log(error);
    });
  })
  .catch(error => {
    console.log(error);
  });
};
