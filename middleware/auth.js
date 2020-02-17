// Bring jwt
const jwt = require('jsonwebtoken');
// bring config
const config = require('config');

// export
module.exports = function(req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if there is no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    // variable to decode the token with verify
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    // take the request object and assign a value to the user
    req.user = decoded.user;
    next();
  } catch (err) {
    // If the token is not valid
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
