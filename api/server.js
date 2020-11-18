const express = require('express');
const app = express();
const userRouter = require('../users/usersRouter');
const authRouter = require('../auth/authRouter');
const eventsRouter = require('../events/eventsRouter');
const db = require('../data/config');
const cors = require('cors');
const {secureLogin} = require('../auth/authMiddleware');

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

app.use((err, req, res, next)=>{
    const status = err.code || 500;
    res.status(status).json({message: err.message})
})

module.exports = app;