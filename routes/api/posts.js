// Bring express
const express = require('express');
// Bring express router
const router = express.Router();

// Route info:   GET api/posts
// Description:  Test route. The call back is a req,res arrow function
// Access value: Public (If a token is needed to access methods. None for public)
router.get('/', (req, res) => res.send('Posts Route'));

// export the route
module.exports = router;
