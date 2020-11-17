const express = require('express');
const User = require('./usersActions');
const {verifyPutRequest} = require('./usersMiddleware');
const {getEventByCreator} = require('../events/eventsActions');
const {secureLogin, secureId} = require('../auth/authMiddleware')

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






router.use((err, req, res, next)=>{
    res.status(err.code).json({message: err.message})
})


module.exports = router;