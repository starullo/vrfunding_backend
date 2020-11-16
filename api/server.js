const express = require('express');
const app = express();

app.use(express.json())

app.get('/api/test', (req, res, next)=>{
    res.json({message: 'affirmative'})
})

module.exports = app;