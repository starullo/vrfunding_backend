const db = require('../data/config');
const jwt = require('jsonwebtoken');
require('dotenv').config()

module.exports = {
    async verifyNewUser(req, res, next) {
        if (!req.body.display_name || !req.body.password || !req.body.email || !req.body.role) {
            next({code: 404, message: 'display name, password, email, and role are all required fields'})
        } else if (req.body.role != 'fundraiser' && req.body.role != 'funder') {
            
            next({code: 404, message: "role must be either 'fundraiser' or 'funder'"})
        }
       
            const user = await db('users').where({email: req.body.email}).first();
            console.log('hi')
            if (!user) {
                console.log(user)
                next()
            } else {
                console.log(user)
                next({code: 404, message: 'already a user with that email'});
            }
    },
    async verifyLogin(req, res, next) {
        const user = await db('users').where({email: req.body.email});
        if (!user) {
            next({code: 404, message: 'invalid username'});
        } else {
            next();
        }
    },
    async secureLogin(req, res, next) {
        const token = req.headers.authorization;
        if (!token) {
            next({code: 401, message: 'must be logged in to do that'})
        }
        jwt.verify(token, process.env.SECRET_STRING, (err, decoded) => {
            if (err) {
                next({code: 500, message: err.message})
            } else {
                next();
            }
        })
    },
    async secureId(req, res, next) {
        const token = req.headers.authorization;
        jwt.verify(token, process.env.SECRET_STRING, (err, decoded)=>{
            console.log(decoded.userId, req.params.userId)
            if (decoded.userId == req.params.userId || decoded.role === 'admin') {
                next();
            } else {
                next({code: 404, message: 'must be the correct user to perform that action'})
            }
        })
    }
}