const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
    const body = request.body


    if(body.username === undefined || body.password === undefined){
        return response.status(400).json({error: 'username or password missing'})
    }
    
    if(body.username.length<3 || body.password.length<3){
        return response.status(400).json({error: 'username or password too short'})
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(body.password, salt);

    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash,
    })

    try {
        const savedUser = await user.save()
        response.status(201).json(savedUser)    
    } catch (error) {
        if (error.name === 'ValidationError') {
            return response.status(400).json({ error: error.message })
          }
    }
})

usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', {title:1, author:1, url:1, likes:1})
    response.json(users.map(user => user.toJSON()))
})


module.exports = usersRouter