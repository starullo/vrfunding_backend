const db = require('../data/config');

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
    }
}