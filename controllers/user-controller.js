const { User } = require('../models');

const userController = {
  //GET all users
  getAllUsers(req, res) {
    User.find({})
      .populate({
        path: 'thoughts',
        select: '-__v'
      })
      .select('-__v')
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },


  getUserById({ params }, res) {
    //GET a single user by its _id and populated thought and friend data
    User.findOne({ _id: params.id })
      .populate({
        path: 'thoughts',
        path: 'friends',
        select: '-__v'
      })
      .select('-__v')
      .then(dbUserData => {

        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with that ID' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  createUser({ body }, res) {
    //POST a new user:
    User.create(body)
      .then(dbUserData => res.json(dbUserData))
      .catch(err => res.status(400).json(err));
  },

  updateUser({ params, body }, res) {
    //PUT to update a user by its _id
    User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with that ID' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.json(err))
  },

  deleteUser({ params }, res) {
    //DELETE to remove user by its _id
    User.findOneAndDelete({ _id: params.id })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with that ID' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.status(400).json(err))
  },

  createFriend({ params }, res) {
    //POST to add a new friend 
    User.findOneAndUpdate(
      { _id: params.userId },
      { $addToSet: { friends: params.friendId } },
      { new: true, runValidators: true }
    )
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with that ID' });
          return;
        }
        User.findOneAndUpdate(
          { _id: params.friendId },
          { $addToSet: { friends: params.userId } },
          { new: true, runValidators: true }
        )
          .then(dbUserData2 => {
            if (!dbUserData2) {
              res.status(404).json({ message: 'No user found with that friend' })
              return;
            }
            res.json(dbUserData);
          })
          .catch(err => res.json(err));
      })
      .catch(err => res.json(err));
  },

  removeFriend( { params }, res) {
    User.findOneAndUpdate(
        { _id: params.userId },
        { $pull: { friends: params.friendId }},
        { new: true}
    )
    .then(dbUserData => res.json(dbUserData))
    .catch(err => res.json(err));
  }


}



  

  


module.exports = userController;