const router = require('express').Router()

const { User, Blog, Readlisting } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: [''] } ,
    include: [{
      model: Blog,
      attributes: { exclude: ['userId'] }
    },
    {
      model: Blog,
      as: 'markedBlogs',
      attributes: { exclude: ['userId'] },
      through: {
        attributes: []
      },
      include: {
        model: User,
        attributes: ['name']
      }
    }
  ]
  })
  res.json(users)
})

router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body)
    res.json(user)
  } catch(error) {
    return res.status(400).json({ error })
  }
})

router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id, {
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

  if (user) {
    res.json(user);
  } else {
    res.status(404).end();
  }
});




router.put('/:username', async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.params.username
    }
  });
  if (user) {
    user.username = req.body.username
    await user.save()
    res.json(user)
  } else {
    res.status(404).end()
  }
})

module.exports = router