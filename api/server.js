const express = require('express');
const app = express();
const userRouter = require('../users/usersRouter');
const authRouter = require('../auth/authRouter');
const eventsRouter = require('../events/eventsRouter');

app.use(express.json())
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/events', eventsRouter)

app.get('/api/test', (req, res, next)=>{
    res.json({message: 'affirmative'})
})

app.use((err, req, res, next)=>{
    res.status(err.code).json({message: err.message})
})

module.exports = app;