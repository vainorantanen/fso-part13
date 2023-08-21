const router = require('express').Router()

const { User, Blog, Readlisting } = require('../models')

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


router.get('/', async (req, res) => {
  const readlistings = await Readlisting.findAll({})
  res.json(readlistings)
})

router.post('/', async (req, res) => {
  try {
    const readlisting = await Readlisting.create(req.body)
    res.json(readlisting)
  } catch(error) {
    return res.status(400).json({ error })
  }
})

router.put('/:id', tokenExtractor, async (req, res) => {

  try {
    const listing = await Readlisting.findByPk(req.params.id)
  const user = await User.findByPk(req.decodedToken.id, {
    attributes: { exclude: [''] },
    include: [
      {
        model: Blog,
        attributes: { exclude: ['userId'] },
        include: [
          {
            model: Readlisting,
            attributes: ['read', 'id'],
            where: { userId: req.params.id }, // Filter by the user's id
            required: false, // Use left join to include even if there's no readlisting entry
          }
        ]
      },
      {
        model: Blog,
        as: 'markedBlogs',
        attributes: { exclude: ['userId'] },
        through: {
          attributes: []
        },
        include: [
          {
            model: User,
            attributes: ['name']
          },
          {
            model: Readlisting,
            attributes: ['read', 'id'],
            where: { userId: req.params.id }, // Filter by the user's id
            required: false, // Use left join to include even if there's no readlisting entry
          }
        ]
      },
    ]
  });
 
    if (listing && listing.toJSON().userId === user.toJSON().id) {
      listing.read = req.body.read === true
      await listing.save()
      res.json(listing)
    } else {
      return res.status(404).json({ error: 'Listing not found' });
    }
  } catch (error) {
    return res.status(400).json({ error });
  }
  
})

module.exports = router