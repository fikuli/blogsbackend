
const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')
const config = require('../utils/config')



blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', {username:1, name:1})
    response.json(blogs.map(blog=>blog.toJSON()))
})
  

blogsRouter.post('/', async (request, response) => {
    const secret = config.SECRET
    let decodedToken = ''
    console.log(request.token)
    try {
        decodedToken = jwt.verify(request.token, secret)
    } catch (e) {
        return response.status(401).json({
            error: 'invalid token'
        })
    }

    if (!request.token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    const currentUser = await User.findById(decodedToken.id)
  
    const blog = new Blog(request.body)

    const eklenecek = {
        user: currentUser._id,
        ...request.body
    }


    if(blog.title===undefined || blog.title.length===0){
        response.status(400).json({error: 'title missing'})
    }
    else if(blog.url===undefined|| blog.url.length===0){
        response.status(400).json({error: 'url missing'})
    }
    else if(blog.likes===undefined){
        const aa = new Blog({
            likes: 0, ...eklenecek
        })
        const result = await aa.save()
        currentUser.blogs = currentUser.blogs.concat(result._id)
        await currentUser.save()

        response.status(201).json(result)
    }
    else{
        const xxx = new Blog(eklenecek)
        const result = await xxx.save()

        currentUser.blogs = currentUser.blogs.concat(result._id)
        await currentUser.save()
        response.status(201).json(result)
    }
})


blogsRouter.delete('/:id', async (request, response) => {

    const secret = config.SECRET
    let decodedToken = ''
    console.log(request.token)
    try {
        decodedToken = jwt.verify(request.token, secret)
    } catch (e) {
        return response.status(401).json({
            error: 'invalid token'
        })
    }

    if (!request.token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    const bb = await Blog.findById(request.params.id)

    if(decodedToken.id.toString()===bb.user.toString()){
        await Blog.findByIdAndRemove(request.params.id)
        return response.status(204).end()
    }
    else{
        return response.status(401).json({ error: 'invalid user' })
    }
})




blogsRouter.put('/:id', async (request, response) => {

    const secret = config.SECRET
    let decodedToken = ''
    console.log(request.token)
    try {
        decodedToken = jwt.verify(request.token, secret)
    } catch (e) {
        return response.status(401).json({
            error: 'invalid token'
        })
    }

    if (!request.token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }


    const bb = await Blog.findById(request.params.id)

    if(decodedToken.id.toString()===bb.user.toString()){
        const aa = {
            title: request.body.title,
            author: request.body.author,
            url: request.body.url,
            likes: request.body.likes
        }

        const result = await Blog.findByIdAndUpdate(request.params.id, aa, { new: true})
        response.json(result.toJSON())
    }
    else{
        return response.status(401).json({ error: 'invalid user' })
    }
})


module.exports = blogsRouter
  