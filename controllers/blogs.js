
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')



  blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs.map(blog=>blog.toJSON()))
  })
  
  blogsRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body)

    if(blog.title===undefined){
      response.status(400).json('title missing')
    }
    else if(blog.url===undefined){
      response.status(400).json('url missing')
    }
    else if(blog.likes===undefined){
      const aa = new Blog({
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: 0
      })
      const result = await aa.save()
      response.status(201).json(result)
    }
    else{
      const result = await blog.save()
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
  