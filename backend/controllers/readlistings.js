const router = require('express').Router()

const { User, Blog, Readlisting } = require('../models')

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

module.exports = router