const request = require('supertest')
const db = require('../data/dbConfig')
const server = require('./server')

const user = {
    username: "Guy Sensei",
    password: "1234"
}

beforeAll(async () => {
	await db.migrate.rollback()
	await db.migrate.latest()
});
beforeEach(async () => {
	await db('users').truncate()
});
afterAll(async () => {
	await db.destroy()
});

test('sanity', () => {
  expect(false).toBe(false)
})

describe('[POST] Register new user', () => {
  it('returns status 201', async () => {
    const res = await request(server).post('/api/auth/register').send(user)
    expect(res.status).toBe(201)
  })
  it('returns new user Obj', async () => {
    const res = await request(server).post('/api/auth/register').send(user)
    expect(res.body.username).toBe('Guy Sensei')
  })
}) 
describe('[POST] LOGIN user', () => {
  it('returns status 200', async () => {
    await request(server).post('/api/auth/register').send(user)
    const res = await request(server).post('/api/auth/login').send(user)
    expect(res.status).toBe(200)
  })
  it('returns new user Obj', async () => {
    await request(server).post('/api/auth/register').send(user)
    const res = await request(server).post('/api/auth/login').send(user)
    expect(res.body.message).toBe('welcome, Guy Sensei')
  })
}) 

describe('[GET] /api/jokes', () => {
  it('returns status 200', async () => {
    await request(server).post('/api/auth/register').send(user)
    const res = await request(server).post('/api/auth/login').send(user)
    const jokes = await request(server).get('/api/jokes').set('Authorization', res.body.token)
    expect(jokes.status).toBe(200)
  })
  it('returns array of jokes', async () => {
    await request(server).post('/api/auth/register').send(user)
    const res = await request(server).post('/api/auth/login').send(user)
    const jokes = await request(server).get('/api/jokes').set('Authorization', res.body.token)
    expect(jokes.body).toHaveLength(3)
  })
})