// Bring express
const express = require('express');
// Bring express router
const router = express.Router();
// Bring Auth
const auth = require('../../middleware/auth');
// Bring Profile
const Profile = require('../../models/Profile');
// Bring the model
const User = require('../../models/User');
// Bring Express-validator
const { check, validationResult } = require('express-validator');
// Bring request
const request = require('request');
// Bring config
const config = require('config');

// Route info:   GET api/profile/
// Description:  Test route. The call back is a req,res arrow function
// Access value: Public (If a token is needed to access methods. None for public)
//router.get('/', (req, res) => res.send('Profile Route'));

// Route info:   GET api/profile/me
// Description:  Get current user profile. The call back is a req,res arrow function
// Access value: Private (If a token is needed to access methods. None for public)
// Because mongoose returns a promise we have to use async await
router.get('/me', auth, async (req, res) => {
  try {
    // Take profile model and use findOne by user req.user.id
    //It will use the Profile.js and use the user id that comes with the token
    // Using populate() we are adding the user name and avatar from user model, not from profile model
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate('user', ['name', 'avatar']);
    // If there is no profile
    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }
    // If there is profile
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Route info:   POST api/profile/
// Description:  Create or update user profile
// Access value: Private
// We use the auth and validation middleware
router.post('/', [auth, [
  check('status', 'Status is required').not().isEmpty(),
  check('skills','Skills is required').not().isEmpty()
]], async (req, res) => {
  const errors = validationResult(req);
  //check for errors
  if(!errors.isEmpty()){
    return res.status(400).json({ errors: errors.array() });
  }

  // We will pull all this stuff out from the request body
  const {
    company,
    website,
    location,
    bio,
    status,
    githubusername,
    skills,
    youtube,
    facebook,
    twitter,
    instagram,
    linkedin
  } = req.body;
  // Build profile object
  const profileFields = {};
  profileFields.user = req.user.id; // It will know the user by the token
  if(company) profileFields.company = company;
  if(website) profileFields.website = website;
  if(location) profileFields.location = location;
  if(bio) profileFields.bio = bio;
  if(status) profileFields.status = status;
  if(githubusername) profileFields.githubusername = githubusername;
  // for skills we need to turn that into an array
  if(skills){
    // We use.split that turns a string into an array
    // with the comma as a delimitor and .map to go
    // through every skill and .trim to ignore spaces
    profileFields.skills = skills.split(',').map(skill => skill.trim())
  }
  // Build social object
  profileFields.social = {}
  if(youtube) profileFields.social.youtube = youtube;
  if(twitter) profileFields.social.twitter = twitter;
  if(facebook) profileFields.social.facebook = facebook;
  if(linkedin) profileFields.social.linkedin = linkedin;
  if(instagram) profileFields.social.instagram = instagram;
  
  //console.log(profileFields.social.twitter);
  // Try to find the user by matching it with the one
  // that comes from the token
  try{
    let profile = await Profile.findOne({ user: req.user.id });

    if(profile){
      // Update by find again by user id and update profile fields
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id }, 
        { $set: profileFields}, 
        { new: true}
      );
      // We want to return the entire profile
      // in the form of json
      return res.json(profile);
    };

    // Create the profile if it doesn't exist
    profile = new Profile(profileFields);

    // Save it
    await profile.save();
    res.json(profile);
    
  }catch(err){
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Route info:   GET api/profile
// Description:  Get all profiles
// Access value: Public
router.get('/', async (req,res) => {
try {
  // We create a variable to find the user and populate it
  // with the user model
  const profiles = await Profile.find().populate('user', ['name','avatar']);
  res.json(profiles);
} catch (err) {
  console.error(err.message);
  res.status(500).send('Server Error');
}
});

// Route info:   GET api/profile/user/:user_id
// Description:  Get profile by user id
// Access value: Public
router.get('/user/:user_id', async (req,res) => {
  try {
    // We create a variable to find the user and populate it
    // with the user url that comes from the req.params.user_id
    const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name','avatar']);
    //check to make sure there is a profile
    if(!profile) return res.status(400).json({ msg: 'Profile not found' });

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if(err.kind == 'ObjectId'){
      return res.status(400).json({ msg: 'Profile not found' });
    }
    res.status(500).send('Server Error');
  }
  });

// Route info:   DELETE api/profile/
// Description:  Delete profile, user & posts
// Access value: Private
router.delete('/', auth, async (req,res) => {
  try {
    // Remove users posts
    
    // Remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    // Remove user
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: 'User deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
  });

// Route info:   PUT api/profile/experience
// Description:  Add profile experience
// Access value: Private
router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'Title is required')
      .not()
      .isEmpty(),
      check('company', 'Company is required')
      .not()
      .isEmpty(),
      check('from', 'From date is required')
      .not()
      .isEmpty(),
    ]
  ],
  async(req, res) => {
  // we need validation to interact with the form in the front end
  // 1. Check for errors
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({ errors: errors.array() });
  }

  // destructuring pulling the next info from req.body
  const{
    title,
    company,
    location,
    from,
    to,
    current,
    description
  } = req.body;
  // This will create an object with the info the user submits
  const newExp = {
    title,
    company,
    location,
    from,
    to,
    current,
    description
  }

  // Dealing with mongodb
  try{
    // Find my user model
    const profile = await Profile.findOne({ user: req.user.id });

    // We are using unshift to push the most recent to the 
    //first position
    profile.experience.unshift(newExp);
    // save the new profile with the newExp object
    await profile.save();

    // Handle the answer to pass it to the front end
    res.json(profile);

  }catch(err){
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Route info:   DELETE api/profile/experience/:exp_id
// Description:  Delete profile experience
// Access value: Private

router.delete('/experience/:exp_id', auth, async (req, res) => {
try {
    // Find my user model
    const profile = await Profile.findOne({ user: req.user.id });
    // Get the correct experience to remove by index 
    // using map
    const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);

    // We have the experience to remove, so splice it from the profile
    profile.experience.splice(removeIndex, 1);

    //save it
    await profile.save();

    //send response
    res.json(profile);
} catch (err) {
  console.error(err.message);
    res.status(500).send('Server Error');
}
});

// Route info:   PUT api/profile/education
// Description:  Add profile education
// Access value: Private
router.put(
  '/education',
  [
    auth,
    [
      check('school', 'School is required')
      .not()
      .isEmpty(),
      check('degree', 'Degree is required')
      .not()
      .isEmpty(),
      check('fieldofstudy', 'Field of Study is required')
      .not()
      .isEmpty(),
    ]
  ],
  async(req, res) => {
  // we need validation to interact with the form in the front end
  // 1. Check for errors
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({ errors: errors.array() });
  }

  // destructuring pulling the next info from req.body
  const{
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description
  } = req.body;
  // This will create an object with the info the user submits
  const newEdu = {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description
  }

  // Dealing with mongodb
  try{
    // Find my user model
    const profile = await Profile.findOne({ user: req.user.id });

    // We are using unshift to push the most recent to the 
    //first position
    profile.education.unshift(newEdu);
    // save the new profile with the newExp object
    await profile.save();

    // Handle the answer to pass it to the front end
    res.json(profile);

  }catch(err){
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Route info:   DELETE api/profile/education/:exp_id
// Description:  Delete profile education
// Access value: Private

router.delete('/education/:edu_id', auth, async (req, res) => {
try {
    // Find my user model
    const profile = await Profile.findOne({ user: req.user.id });
    // Get the correct education to remove by index 
    // using map
    const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);

    // We have the education to remove, so splice it from the profile
    profile.education.splice(removeIndex, 1);

    //save it
    await profile.save();

    //send response
    res.json(profile);
} catch (err) {
  console.error(err.message);
    res.status(500).send('Server Error');
}
});

// Route info:   GET api/profile/education/github/:username
// Description:  Get user repos from github
// Access value: Public
router.get('/github/:username', (req, res) => {
  try {
    // options is an object constructor that fetches from github
    // with the client id and the secret
    // per_page = # of repos
    // sort by date created
    // asc = ascending order
    // do that by GET request with user agent as node.js
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get
        ('githubClientID'
        )}&client_secret=${config.get('githubSecret')}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js'}
    };
    // make the request taking in the options object and a callback function
    request(options, (error, response, body) => {
      // check for error
      if(error) console.error(error);
      // Check if we didn't get a 200 ok response
      if(response.statusCode !== 200){
        return res.status(404).json({ msg: 'No Github profile found' });
      }
      // If it's found send the regular json parsed
      res.json(JSON.parse(body));
    })
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
})

// export the route
module.exports = router;
