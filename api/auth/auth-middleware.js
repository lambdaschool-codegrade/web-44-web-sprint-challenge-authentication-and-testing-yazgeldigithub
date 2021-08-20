const Users = require('../users/users-model')

const checkBody = (req, res, next) => {
    const { username, password } = req.body
    if (!username || !password || username.trim() === '') {
        next({
            status: 400,
            message: 'username and password required'
        })
    } else {
       req.newUser = {
           username: username.trim(),
           password
       } 
        next()
    }
}

const checkUsernameUnique = async (req, res, next) => {
    const { username } = req.newUser || req.body
    const userTaken = await Users.getBy({ username }) 
    if (userTaken) {
        next({
            status: 401,
            message: 'username taken'
        })
    } else {
        next()
    }
}

const checkUsernameExists = async (req, res, next) => {
  const { username } = req.newUser || req.body
  const user = await Users.getBy({ username })
  if (user) {
    req.user = user
    next()
  } else {
    next({
      status: 401,
      message: 'invalid credentials'
    })
  }
}

module.exports = {
    checkBody,
    checkUsernameUnique,
    checkUsernameExists
}