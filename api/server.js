const express = require('express');
const app = express();
const userRouter = require('../users/usersRouter');
const authRouter = require('../auth/authRouter');
const eventsRouter = require('../events/eventsRouter');
const db = require('../data/config');
const cors = require('cors');
const {secureLogin} = require('../auth/authMiddleware');
const jwt = require('jsonwebtoken');

app.use(express.json());
app.use(cors()) 
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/projects', eventsRouter)

app.get('/api/test', (req, res, next)=>{
    res.json({message: 'affirmative'})
})

app.get('/api/funds', secureLogin, async (req, res, next)=>{
    const funds = await db('donations');
    res.json(funds)
})

app.get('/api/funds/:id', secureLogin, async (req, res, next)=>{
    const funds = await db('donations').where({id: req.params.id});
    if (!funds) {
        res.status(404).json({message: 'no fund with that id'})
    } else {
        res.json(funds)
    }
})

app.put('/api/funds/:id', secureLogin, async (req, res, next)=>{
    if (!req.body.amount) {
        res.status(400).json({message: '"amount" is a required field'})
    }

    const x = await db('donations').update(req.body).where({id: req.params.id});
    const newDonation = await db('donations').where({id: req.params.id});
    res.json(newDonation);
})

app.delete('/api/funds/:id', secureLogin, async (req, res, next)=>{


    const wow = await db('donations').where({id: req.params.id});
    res.json({message: 'donation with the id of ' + req.params.id + ' was successfully deleted'})
})

app.use((err, req, res, next)=>{
    const status = err.code || 500;
    res.status(status).json({message: err.message})
})

module.exports = app;