const express = require('express');
const User = require('./usersActions');
const {verifyPutRequest} = require('./usersMiddleware');

const router = express.Router();



router.get('/', (req, res, next)=>{
    User.getUsers()
    .then(data=>{
        res.json(data)
    })
    .catch(err=>{
        res.status(400).json({message: err.message})
    })
})

router.get('/:id', (req, res, next)=>{
    User.getUserById(req.params.id)
    .then(data=>{
        res.json(data)
    })
    .catch(err=>{
        res.status(404).json({message: err.message})
    })
})

router.put('/:id', verifyPutRequest, (req, res, next)=>{
    User.updateUser(req.params.id, req.body)
    .then(data=>{
        res.json(data)
    })
    .catch(err=>{
        res.status(400).json({message: err.message})
    })
})

router.delete('/:id', (req, res, next)=>{
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