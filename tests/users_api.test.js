const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcryptjs')
const app = require('../app')
const api = supertest(app)

const User = require('../models/user')


beforeEach(async () => {
    await User.deleteMany({})


    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync('root', salt);

    const user = new User({ username: 'root', passwordHash })

    await user.save()

})

const user = {username:"ben", name:"sen", password:"uff"}
const root = {username:"root", name:"sen", password:"uff"}
const shortuser = {username:"b", name:"sen", password:"uff"}
const shortpwd = {username:"ben", name:"sen", password:"u"}
const missingusername = {name:"sen", password:"uff"}
const missingpwd = {username:"ben", name:"sen"}

describe('post', () => {

    test('only root', async () => {
        const response = await api.get('/api/users')

        expect(response.body).toHaveLength(1)
    })

})


describe('post', () => {
    test('a new user', async () => {
        await api
            .post('/api/users')
            .send(user)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/users')

        const titles = response.body.map(r => r.username)

        expect(titles).toContain(
            user.username
        )
    })

    test('root again', async () => {
        await api
            .post('/api/users')
            .send(missingusername)
            .expect(400)
    })

    test('missing username', async () => {
        await api
            .post('/api/users')
            .send(missingusername)
            .expect(400)
    })

    test('missing pwd', async () => {
        await api
            .post('/api/users')
            .send(missingpwd)
            .expect(400)
    })

    test('short pwd', async () => {
        await api
            .post('/api/users')
            .send(shortpwd)
            .expect(400)
    })
    test('short username', async () => {
        await api
            .post('/api/users')
            .send(shortuser)
            .expect(400)
    })


})

afterAll(() => {
    mongoose.connection.close()
})


