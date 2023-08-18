const router = require('express').Router()

const { Blog } = require('../models')
const { User } = require('../models')
const { Op } = require('sequelize')

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
  const where = {}

  if (req.query.search) {
    where[Op.or] = [
      {
        title: {
          [Op.iLike]: `%${req.query.search}%`, 
        }
      },
      {
        author: {
          [Op.iLike]: `%${req.query.search}%`, 
        }
      }
    ]
};

    const blogs = await Blog.findAll({
      attributes: { exclude: ['userId'] },
      include: {
        model: User,
        attributes: ['name']
      },
      where,
      order: [['likes', 'DESC']]
    })
    res.json(blogs)
  })

router.post('/', tokenExtractor, async (req, res) => {
    console.log('body', req.body)
      const user = await User.findByPk(req.decodedToken.id)
      const blog = await Blog.create({ ...req.body, userId: user.id })
      res.json(blog)
  })
  
  router.delete('/:id', tokenExtractor, async (req, res) => {
      try {
        const blog = await Blog.findByPk(req.params.id);
        const user = await User.findByPk(req.decodedToken.id)

        if (blog && blog.userId === user.id) {
          await blog.destroy();
          return res.status(204).end();
        } else {
          return res.status(404).json({ error: 'Blog not found' });
        }
      } catch (error) {
        return res.status(400).json({ error });
      }
    });
  
  router.get('/:id', async (req, res) => {
    const blog = await Blog.findByPk(req.params.id)
    if (blog) {
      res.json(blog)
    } else {
      res.status(404).end()
    }
  })

  router.put('/:id', async (req, res) => {
    const blog = await Blog.findByPk(req.params.id)
    blog.likes = req.body.likes
    await blog.save()
    res.json(blog)
  })

module.exports = router