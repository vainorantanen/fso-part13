const Blog = require('./blog')
const User = require('./user')
const Readlisting = require('./readlisting')

Blog.belongsTo(User)
User.hasMany(Blog)

User.belongsToMany(Blog, { through: Readlisting, as: 'markedBlogs' })
Blog.belongsToMany(User, { through: Readlisting, as: 'usersMarked' })

module.exports = {
  Blog, User, Readlisting
}