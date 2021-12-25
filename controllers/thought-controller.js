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
      //POST to create a new thought (don't forget to push the created thought's _id to the associated user's thoughts array field)
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
      //PUT to update a thought by its _id
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

  removeThought({ params }, res) {
    //DELETE to remove a thought by its _id
    Thought.findOneAndDelete({ _id: params.id })
    .then(dbThoughtData => {
        if (!dbThoughtData) {
            res.status(404).json({ message: 'No thought found with that ID'});
            return;
        }
        User.findOneAndUpdate(
            { username: dbThoughtData.username },
            { $pull: { thoughts: params.id } }
        )
        .then(() => {
            res.json({message: 'Thought removed'});
        })
        .catch(err => res.status(500).json(err));
    })
    .catch(err => res.status(500).json(err));
  },

  postReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $addToSet: { reactions: body } },
        { new: true, runValidators: true }
    )
    .then(dbThoughtData => {
        if (!dbThoughtData) {
            res.status(404).json({ message: 'Thought not found' });
            return;
        }
        res.json(dbThoughtData);
    })
    .catch(err => res.status(500).json(err));
},

 
}
  
  
  
    
  
    
  
module.exports = thoughtController;