const Blog = require('./blog')
const User = require('./user')
const Readlisting = require('./readlisting')
const Session = require('./session')

Blog.belongsTo(User)
User.hasMany(Blog)

User.belongsToMany(Blog, { through: Readlisting, as: 'markedBlogs' })
Blog.belongsToMany(User, { through: Readlisting, as: 'usersMarked' })

Blog.hasMany(Readlisting);
Session.belongsTo(User)

module.exports = {
  Blog, User, Readlisting, Session
}