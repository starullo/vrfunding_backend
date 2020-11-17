const db = require('../data/config');
const jwt = require('jsonwebtoken')

module.exports = {
    async verifyNewEventPost(req, res, next) {
        const {project_name, project_description, funding_goal} = req.body;

        if (!project_name || !project_description || !funding_goal) {
            next({code: 404, message: 'project_name, project_description, funding_goal, and creator_id are required fields'})
        } else {
            next();
        }
    },
    async verifyNewFund(req, res, next) {
        const {amount} = req.body;
        if (!amount) {
            next({code: 400, message: 'must enter an amount'})
        } else {
            next();
        }
    },
    async verifyFunder(req, res, next) {
        const token = req.headers.authorization;
        jwt.verify(token, process.env.SECRET_STRING, (err, decoded)=>{
            console.log(decoded.userId, req.params.userId)
            if (decoded.role === 'funder' || decoded.role === 'admin') {
                req.headers.id === decoded.userId
                console.log('hi', decoded.userId)
                next();
            } else {
                console.log(decoded.role)
                next({code: 404, message: 'only "funders" can perform this action'})
            }
        })
    },
    async verifyFundraiser(req, res, next) {
        const token = req.headers.authorization;
        jwt.verify(token, process.env.SECRET_STRING, (err, decoded)=>{
            console.log(decoded.userId, req.params.userId)
            if (decoded.role === 'fundraiser' || decoded.role === 'admin') {
                req.headers.id === decoded.userId
                console.log('hi', decoded.userId)
                next();
            } else {
                next({code: 404, message: 'only "fundraisers" can perform this action'})
            }
        })
    }
}