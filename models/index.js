const { db, DataTypes } = require('../db/connection')
const Show = require('./Show')
const User = require('./User')

const watched = db.define('watched', {
});

Show.belongsToMany(User, { through: 'watched' })
User.belongsToMany(Show, { through: 'watched' })

module.exports = {
  Show,
  User,
  watched
}
