import Group from '../models/group_model';
import User from '../models/user_model';

export const getGroups = (req, res) => {
  Group.find({ members: req.user._id })
  .then(groups => {
    res.json(groups);
  })
  .catch(err => {
    res.json({ message: `Error: ${err}` });
  });
};

export const getGroup = (req, res) => {
  Group.findById(req.params.id)
  .populate('members')
  .then(group => {
    res.json(group);
  })
  .catch(err => {
    res.json({ message: `Error: ${err}` });
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
  group.description = req.body.description;
  group.owner = req.user._id;
  group.members = req.body.members;

  group.save()
  .then(result => {
    User.findOneAndUpdate({ netID: req.user.netID }, {
      $push: { groups: result._id },
    })
    .then(user => {
      // Successfully added
      res.json({ message: 'Group created!' });
    })
    .catch(err => {
      res.json({ message: `Error: ${err}` });
    });
  })
  .catch(err => {
    res.json({ message: `Error: ${err}` });
  });
};

export const updateGroup = (req, res) => {
  // Update group with information, return updated group
  Group.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
  .populate('members')
  .exec((err, group) => {
    if (err) {
      res.json({ message: `Error: ${err}` });
    } else {
      res.json(group);
    }
  });
};
