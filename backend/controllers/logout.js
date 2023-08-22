const router = require('express').Router();
const { Session } = require('../models');

const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      console.log(authorization.substring(7))
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch (error){
      console.log(error)
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

router.delete('/', tokenExtractor, async (req, res) => {
  try {
    const user = req.decodedToken;
    if (user) {
      // get token from sessions table
      const token = req.headers.authorization.split(' ')[1];
      const session = await Session.findOne({
        where: { userId: user.id, token: token },
      });
      if (session) {
        // Delete the user's session token from the sessions table
        await Session.destroy({
          where: { userId: user.id },
        });

        res.status(204).end(); // Return a successful response with no content
      } else {
        return res.status(401).json({ error: 'Token not found or expired' });
      }
    } else {
      return res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error logging out:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
