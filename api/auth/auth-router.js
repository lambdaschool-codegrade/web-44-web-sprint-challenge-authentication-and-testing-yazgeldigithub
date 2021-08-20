  
const router = require('express').Router()
const bcrypt = require('bcryptjs')
const Users = require('../users/users-model')
const tokenBuilder = require('./token-builder')
const {
  checkBody,
  checkUsernameUnique,
  checkUsernameExists
} = require('./auth-middleware')

router.post(
  '/register', 
  checkBody, 
  checkUsernameUnique, 
  (req, res, next) => {
    let user = req.newUser
    const rounds = process.env.BCRYPT_ROUNDS || 7
    const hash = bcrypt.hashSync(user.password, rounds)
    
    user.password = hash

    Users.addUser(user)
      .then(newUser => {
        res.status(201).json(newUser)
      })
      .catch(next)
})

router.post(
  '/login', 
  checkBody, 
  checkUsernameExists, 
  (req, res, next) => {
    let { username, password, id  } = req.user

    if (bcrypt.compareSync(req.newUser.password, password)) {
      const token = tokenBuilder({
        id,
        username
      })
      res.status(200).json({
        message: `welcome, ${username}`,
        token
      })
    } else {
      next({status: 401, message: 'invalid credentials'})
    }  
})

module.exports = router;