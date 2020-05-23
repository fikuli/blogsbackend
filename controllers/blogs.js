
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')



  blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', {username:1, name:1})
    response.json(blogs.map(blog=>blog.toJSON()))
  })
  



  blogsRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body)

    const users = await User.find({})

    const currentUser = users[0]

    const eklenecek = {
      user: currentUser._id,
      ...request.body
    }


    if(blog.title===undefined){
      response.status(400).json({error: 'title missing'})
    }
    else if(blog.url===undefined){
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
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  })




  blogsRouter.put('/:id', async (request, response) => {

    const aa = {
      title: request.body.title,
      author: request.body.author,
      url: request.body.url,
      likes: request.body.likes
    }

    const result = await Blog.findByIdAndUpdate(request.params.id, aa, { new: true})
    response.json(result.toJSON())

})


  module.exports = blogsRouter
  