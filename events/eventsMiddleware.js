const db = require('../data/config');

module.exports = {
    async verifyNewEventPost(req, res, next) {
        const {project_name, project_description, funding_goal, creator_id} = req.body;

        if (!project_name || !project_description || !funding_goal || !creator_id) {
            next({code: 404, message: 'project_name, project_description, funding_goal, and creator_id are required fields'})
        } else {
            next();
        }
    }
}