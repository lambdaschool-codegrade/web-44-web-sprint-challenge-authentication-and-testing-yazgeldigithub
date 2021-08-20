const db = require('../../data/dbConfig')

function getUsers() {
    return db('users')
}

function getBy(filter) {
    return db('users').where(filter).first()
}

function getUserById(id) {
    return db('users').where({ id }).first()
}

async function addUser(user) {
    const [id] = await db('users').insert(user)
    return getUserById(id)
}

async function deleteUser(id) {
    const user = await getUserById(id)
    db('users').delete().where({id})

    return user
}

module.exports = {
    getUsers,
    getBy,
    getUserById,
    addUser,
    deleteUser
}