const express = require('express');
const Event = require('./eventsActions');
const {secureLogin, secureId} = require('../auth/authMiddleware')
const {verifyNewEventPost, verifyNewFund, verifyFunder, verifyFundraiser} = require('../events/eventsMiddleware');
const jwt = require('jsonwebtoken');
const db = require('../data/config');

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

router.post('/', [secureLogin,verifyNewEventPost, verifyFundraiser], (req, res, next)=>{
    const token = req.headers.authorization;
    let theId;
    jwt.verify(token, process.env.SECRET_STRING, (err, decoded)=>{
        theId = decoded.userId;
    })
    Event.addEvent({...req.body, creator_id: theId})
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

router.get('/:projectId/totalfunds', (req, res, next)=>{
    Event.getEventFunds(req.params.projectId)
    .then(data=>{
        res.json(data)
    })
    .catch(err=>{
        res.status(500).json({message: err.message})
    })
})

router.get('/:projectId/funds', (req, res, next)=>{
    Event.getIndividualEventFunds(req.params.projectId)
    .then(data=>{
        res.json(data)
    })
    .catch(err=>{
        res.status(500).json({message: err.message})
    })
})

router.get('/:projectId/funds/:fundId', async (req, res, next)=>{
    const x = await db('donations').where({id: req.params.fundId}).first();
    console.log(req.params.fundId)
    console.log(x)
    if (!x) {
        res.status(401).json({message: 'no fund with that id'})
    }
    res.json(x)
})

router.post('/:projectId/funds', [verifyNewFund, verifyFunder], (req, res, next)=>{
    const token = req.headers.authorization;
    let theId;
    jwt.verify(token, process.env.SECRET_STRING, (err, decoded)=>{
        theId = decoded.userId;
    })
    Event.addFunds({...req.body, project_id: req.params.projectId, donor_id: theId})
    .then(data=>{
        res.status(201).json(data)
    })
    .catch(err=>{
        res.status(500).json({message: err.message})
    })
})

router.delete('/:projectId/funds/:fundId', async (req, res, next)=>{
    const x = await db('donations').where({id: req.params.fundId}).first();
    if (!x) {
        res.status(404).json({message: 'no fund with that id'})
    }
    Event.deleteFund(req.params.fundId)
    .then(data=>{
        res.json({message: 'fund with the id of ' + req.params.fundId + ' was deleted'})
    })
})

module.exports = router;