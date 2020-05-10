// Bring express
const express = require('express');
// Bring express router
const router = express.Router();
// Bring bcrypt
const bcrypt = require('bcryptjs');
// Bring auth
const auth = require('../../middleware/auth');
// Bring JWT
const jwt = require('jsonwebtoken');
// Bring config
const config = require('config');
// Bring Check, validationresult - express validator
const { check, validationResult } = require('express-validator');


// Bring user
const User = require('../../models/User');

// Route info:   GET api/auth
// Description:  Test route. The call back is a req,res arrow function
// Access value: Public (If a token is needed to access methods. None for public)
router.get('/', auth, async (req, res) => {
  // call the database
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
// Route info: POST api/auth
// Description: This is used authenticate user & get token
// Access value: Public
router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  async (req, res) => {
    // Handle error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // In order to make this work. Bodyparser must be initialized in
    // server.js
    //console.log(req.body);

    // Instead of doing req.body
    // we can do destructure
    const { email, password } = req.body;
    // Make a query with async await
    try {
      // See if user exists by searching from email address
      let user = await User.findOne({ email });
      // If user is found, send 400 error message as json object
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }
      // Bcrypt has a mehtod called compare which takes a
      // password and an encrypted password and compares
      // them if they match and returns a promise.
      const isMatch = await bcrypt.compare(password, user.password);
      // If there is no match
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      // Return jsonwebtoken
      // 1. create payload
      const payload = {
        user: {
          id: user.id // we get the id from the user promise
        }
      };

      // sign with the payload and the token from config
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 }, //options to expire
        // Handle error
        (err, token) => {
          if (err) throw err;
          res.json({ token }); // send the token back
        }
      );
      //res.send('User registered');
    } catch (err) {
      // Handle error from server
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// export the route
module.exports = router;
