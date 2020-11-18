const express = require('express');
const {verifyNewUser, verifyLogin} = require('./authMiddleware');
const User = require('../users/usersActions');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../data/config');
require('dotenv').config();

const router = express.Router();

router.post('/register', verifyNewUser, (req, res, next)=>{
    const {display_name, password, role, email, photo_src} = req.body;
    const hash = bcrypt.hashSync(password, 10);
    const newUser = {display_name, password: hash, role, email, photo_src};
    User.addUser(newUser)
    .then(user=>{
        res.status(201).json(user)
    })
    .catch(err=>{
        res.status(500).json({message: err.message})
    })
})

router.post('/login', verifyLogin, async (req, res, next)=>{
    try {
    const {email, password} = req.body;
    console.log(req.body)
    let user = await db('users').where({email}).first();
    console.log(user)
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
        res.status(400).json({message: 'incorrect password'})
    }
    console.log(valid)
    const token = jwt.sign({
        userId: user.id,
        role: user.role
    }, process.env.SECRET_STRING);
    console.log(user)
    res.json({message: 'welcome back, ' + user.display_name, role: user.role, token})
} catch(err) {
    res.status(500).json({message: err.message})
}
})




module.exports = router;