const db = require('../data/config');

module.exports = {
    verifyPutRequest(req, res, next) {
        if (!req.body.display_name || !req.body.password || !req.body.email || !req.body.role) {
            next({code: 404, message: 'display name, password, email, and role are all required fields'})
        } else if (req.body.role != 'fundraiser' && req.body.role != 'funder') {
            
            next({code: 404, message: "role must be either 'fundraiser' or 'funder'"})
        } else {
            next();
        }
    }
}