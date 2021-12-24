const { Thought, User } = require('../models');


const thoughtController = {
    //GET all thoughts
    getAllThoughts(req, res) {
      Thought.find({})
        .populate({
          path: 'reactions',
          select: '-__v'
        })
        .select('-__v')
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => {
          console.log(err);
          res.status(400).json(err);
        });
    },
  
  
    getThoughtById({ params }, res) {
      //GET a single thought by its _id 
      Thought.findOne({ _id: params.id })
        .populate({
          path: 'reactions',
          select: '-__v'
        })
        .select('-__v')
        .then(dbThoughtData => {
  
          if (!dbThoughtData) {
            res.status(404).json({ message: 'No Thought found with that ID' });
            return;
          }
          res.json(dbThoughtData);
        })
        .catch(err => {
          console.log(err);
          res.status(400).json(err);
        });
    },

    addThought({ body }, res) {
        Thought.create(body)
        .then(dbThoughtData => {
            User.findOneAndUpdate(
                { _id: body.userId },
                { $push: { thoughts: dbThoughtData._id } },
                { new: true }
            )
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'User not found'})
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
        })
        .catch(err => res.status(400).json(err));
    },

    updateThought({ params, body }, res) {
      Thought.findOneAndUpdate(
          { _id: params.id },
          body,
          { new: true }
      )
      .then(dbThoughtData => {
          if (!dbThoughtData) {
              res.status(404).json({ message: 'No thought found with that ID' });
              return;
          }
          res.json(dbThoughtData);
      })
      .catch(err => res.status(400).json(err));
  },

  
 
}
  
  
  
    
  
    
  
module.exports = thoughtController;