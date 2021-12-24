const router = require('express').Router();


const {
    getAllThoughts,
    getThoughtById,
    addThought,
    updateThought
    
} = require('../../controllers/thought-controller');


// Set up GET all and POST at /api/users
router
  .route('/')
  .get(getAllThoughts)
  .post(addThought)

// Set up GET one, PUT, and DELETE at /api/users/:id
router
  .route('/:id')
  .get(getThoughtById)
  .put(updateThought)
  
  

module.exports = router;