const express = require('express');
const User = require('./usersActions');
const Event = require('../events/eventsActions');
const {verifyPutRequest} = require('./usersMiddleware');
const {getEventByCreator} = require('../events/eventsActions');
const {secureLogin, secureId} = require('../auth/authMiddleware');
const {verifyNewEventPost, verifyFunder, verifyFundraiser} = require('../events/eventsMiddleware');

const router = express.Router();



router.get('/', secureLogin, (req, res, next)=>{
    User.getUsers()
    .then(data=>{
        res.json(data)
    })
    .catch(err=>{
        res.status(400).json({message: err.message})
    })
})

router.get('/:userId', secureLogin, (req, res, next)=>{
    User.getUserById(req.params.userId)
    .then(data=>{
        if (!data) {
            res.status(400).json({message: 'no user with that id'})
        }
        res.json(data)
    })
    .catch(err=>{
        res.status(404).json({message: err.message})
    })
})

router.get('/:userId/projects', [secureLogin, secureId], (req, res, next)=>{
    getEventByCreator(req.params.userId)
    .then(data=>{
        console.log(data)
        res.json(data)
    })
    .catch(err=>{
        res.status(500).json({message: 'something went wrong'})
    })
})

router.get('/:userId/funds')

router.post('/:userId/projects', [secureLogin, secureId, verifyFundraiser, verifyNewEventPost], (req, res, next)=>{
    console.log('hi')
    console.log(req.params.userId)
    Event.addEvent({...req.body, creator_id: req.params.userId})
    .then(data=>{
        res.status(201).json(data);
    })
    .catch(err=>{
        res.status(500).json({message: err.message})
    })
})

router.put('/:userId', [secureLogin, secureId, verifyPutRequest], (req, res, next)=>{
    User.updateUser(req.params.id, req.body)
    .then(data=>{
        res.json(data)
    })
    .catch(err=>{
        res.status(400).json({message: err.message})
    })
})

router.delete('/:userId', secureLogin, (req, res, next)=>{
    User.deleteUser(req.params.id)
    .then(data=>{
        res.json({message: data})
    })
    .catch(err=>{
        res.status(500).json({message: err.message})
    })
})








module.exports = router;