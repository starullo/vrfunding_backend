const express = require('express');
const app = express();
const userRouter = require('../users/usersRouter');
const authRouter = require('../auth/authRouter');
const eventsRouter = require('../events/eventsRouter');
const cors = require('cors');

app.use(express.json());
app.use(cors());
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/projects', eventsRouter)

app.get('/api/test', (req, res, next)=>{
    res.json({message: 'affirmative'})
})

app.use((err, req, res, next)=>{
    const status = err.code || 500;
    res.status(status).json({message: err.message})
})

module.exports = app;