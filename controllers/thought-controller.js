const { Thought, User } = require('../models');


const thoughtController = {
    //GET all thoughts
    getAllThoughts(req, res) {
      Thought.find({})
        .populate({
          path: 'user',
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
          path: 'user',
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
  
 
}
  
  
  
    
  
    
  
module.exports = thoughtController;