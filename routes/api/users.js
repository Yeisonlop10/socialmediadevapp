// Bring express
const express = require('express');
// Bring express router
const router = express.Router();
// Bring Check, validationresult - express validator
const { check, validationResult } = require('express-validator');
// Bring the User schema
const User = require('../../models/User');
// Bring gravatar package
const gravatar = require('gravatar');
// Bring bcrypt
const bcrypt = require('bcryptjs');
// Bring JWT
const jwt = require('jsonwebtoken');
// Bring config
const config = require('config');

// Route info:   GET api/users
// Description:  Test route. The call back is a req,res arrow function
// Access value: Public (If a token is needed to access methods. None for public)
// This one is used just for testing
//router.get('/', (req, res) => res.send('User Route'));

// Route info: POST api/users
// Description: This is used to register users
// Access value: Public
router.post(
  '/',
  [
    check('name', 'Name is required')
      .not()
      .isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 })
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
    const { name, email, password } = req.body;
    // Make a query with async await
    try {
      // See if user exists by searching from email address
      let user = await User.findOne({ email });
      // If user is found, send 400 error message as json object
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }
      // Get users gravatar
      const avatar = gravatar.url(email, {
        s: '200', // size
        r: 'pg', // rate, to avoide nudes etc
        d: 'mm' // default image. user icon
      });

      // create instance of user, not saved yet
      user = new User({
        name,
        email,
        avatar,
        password // not encrypted yet(plain text)
      });
      // Encrypt password
      // 1. to do the hashing
      const salt = await bcrypt.genSalt(10);
      // 2. take the password and hash it. it takes the pass, creates a hash
      // and puts the password in
      user.password = await bcrypt.hash(password, salt);
      // save user. Because its a promise use await.
      await user.save(); // this gives a promise
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
        { expiresIn: 36000 }, //options to expire
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
