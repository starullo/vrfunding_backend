const express = require('express');
const app = express();
const userRouter = require('../users/usersRouter');
const authRouter = require('../auth/authRouter');

app.use(express.json())
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);

app.get('/api/test', (req, res, next)=>{
    res.json({message: 'affirmative'})
})

module.exports = app;