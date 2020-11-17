const express = require('express');
const Event = require('./eventsActions');
const {secureLogin} = require('../auth/authMiddleware')
const {verifyNewEventPost} = require('../events/eventsMiddleware')

const router = express.Router();

router.get('/', secureLogin, (req, res, next)=>{
    Event.getAllEvents()
    .then(data=>{
        res.json(data)
    })
    .catch(err=>{
        res.status(500).json({message: err.message})
    })
})

router.post('/', [secureLogin,verifyNewEventPost], (req, res, next)=>{
    Event.addEvent(req.body)
    .then(data=>{
        res.json(data)
    })
    .catch(err=>{
        res.status(500).json({message: err.message})
    })
})

module.exports = router;