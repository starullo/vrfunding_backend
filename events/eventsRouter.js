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

router.put('/:id', [secureLogin, verifyNewEventPost], (req, res, next)=>{
    Event.updateEvent(req.params.id, req.body)
    .then(data=>{
        res.json(data)
    })
    .catch(err=>{
        res.status(500).json({message: err.message})    })
})

router.delete('/:id', secureLogin, (req, res, next)=>{
    Event.deleteEvent(req.params.id)
    .then(data=>{
        res.json({message: 'fundraiser/event with the id of ' + req.params.id + ' was successfully deleted'})
    })
})

module.exports = router;