const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

const initialBlogs = [
    { title: "React patterns", author: "Michael Chan", url: "https://reactpatterns.com/", likes: 7 },
    { title: "Go To Statement Considered Harmful", author: "Edsger W. Dijkstra", url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html", likes: 5 }
]

const checkBlogs = [
    { title: "Canonical string reduction", author: "Edsger W. Dijkstra", url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html", likes: 12 },
    { title: "First class tests", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll", likes: 10 },
    { title: "TDD harms architecture", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html", likes: 0 },
    { title: "Type wars", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html", likes: 2 }
]

beforeEach(async () => {
    await Blog.deleteMany({})

    let blogObject = new Blog(initialBlogs[0])
    await blogObject.save()

    blogObject = new Blog(initialBlogs[1])
    await blogObject.save()
})


describe('initials', () => {

    test('notes are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })


    test('all notes are returned', async () => {
        const response = await api.get('/api/blogs')

        expect(response.body).toHaveLength(initialBlogs.length)
    })



    test('a specific author', async () => {
        const response = await api.get('/api/blogs')

        const authors = response.body.map(r => r.author)

        expect(authors).toContain(
            'Michael Chan'
        )
    })
})
describe('field check', () => {

    test('id is defined', async () => {
        const response = await api.get('/api/blogs')

        expect(response.body[0].id).toBeDefined()
    })
})

describe('missing params', () => {

    test('a new blog without title', async () => {

        const ekle = { author: "dene", url: "dene" }

        const response = await api
            .post('/api/blogs')
            .send(ekle)
            .expect(400)

    })

    test('a new blog without url', async () => {

        const ekle = { title: "dene", author: "dene", likes: 4 }

        const response = await api
            .post('/api/blogs')
            .send(ekle)
            .expect(400)

    })


    test('a new blog without likes', async () => {

        const ekle = { title: "dene", author: "dene", url: "dene" }

        const response = await api
            .post('/api/blogs')
            .send(ekle)

        expect(ekle.likes).toBeUndefined()
        expect(response.body.likes).toEqual(0)
    })
})

describe('post', () => {
    test('a new blog', async () => {

        await api
            .post('/api/blogs')
            .send(checkBlogs[0])
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs')

        const titles = response.body.map(r => r.title)

        expect(response.body).toHaveLength(initialBlogs.length + 1)
        expect(titles).toContain(
            checkBlogs[0].title
        )
    })
})
describe('remove', () => {
    test('delete', async () => {

        const ekle = { title: "sil", author: "sil", url: "sil" }

        const response = await api
            .post('/api/blogs')
            .send(ekle)

        const id = response.body.id

        await api
            .delete(`/api/blogs/${id}`)
            .expect(204)

    })
})

describe('put', () => {
    test('update', async () => {

        const ekle = { title: "sil", author: "sil", url: "sil" }
        const updated = { title: "sil", author: "sil", url: "sil", likes: 5 }

        const response = await api
            .post('/api/blogs')
            .send(ekle)

        const id = response.body.id

        const result = await api
            .put(`/api/blogs/${id}`)
            .send(updated)

        expect(result.body.likes).toBe(updated.likes)

    })
})

afterAll(() => {
    mongoose.connection.close()
})



