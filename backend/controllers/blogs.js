const router = require('express').Router()

const { Blog } = require('../models')

router.get('/', async (req, res) => {
    const blogs = await Blog.findAll()
    res.json(blogs)
  })

router.post('/', async (req, res) => {
      const blog = await Blog.create(req.body)
      res.json(blog)
  })
  
  router.delete('/:id', async (req, res) => {
      try {
        const blog = await Blog.findByPk(req.params.id);
        console.log(blog)
        if (blog) {
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