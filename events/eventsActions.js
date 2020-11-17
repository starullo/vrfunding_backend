const db = require('../data/config');

module.exports = {
    async getAllEvents() {
        return db('projects')
    },
    async getEventById(id) {
        return db('projects').where({id})
    },
    async getEventByCreator(id) {
        return db('projects').where({creator_id: id});
    },
    async addEvent(event) {
        const [id] = await db('projects').insert(event);
        return db('projects').where({id}).first();
    },
    async updateEvent(id, changes) {
        const x = await db('projects').update(changes).where({id});
        console.log(x);
        return db('projects').where({id}).first();
    },
    async deleteEvent(id) {
        return db('projects').where({id}).delete()
    },
    async getEventFunds(eventId) {
        const e = db('projects').where({project_id: eventId}).first();
        if (!e) {
            res.status(404).json({message: 'no project/event with that id'})
        }
        return await db('projects').sum({'amount_raised': 'donations.amount'}).groupBy('projects.id')
        .join('donations', 'donations.project_id', 'projects.id')
        .select('projects.project_name', 'projects.project_description', 'projects.funding_goal').where({'projects.id': eventId})
    },
    async getIndividualEventFunds(id) {
        return db('donations')
        .join('users', 'users.id', 'donations.donor_id')
        .join('projects', 'projects.id', 'donations.project_id')
        .select('users.display_name as donor', 'donations.amount', 'projects.project_name', 'projects.project_description', 'donations.id')
        .where({'donations.project_id': id})
    },
    async addFunds(fund) {
        const [id] = await db('donations').insert(fund);
        return db('donations').where({id}).first()
    },
    async getFundById(id) {
        return db('donations').where({id}).first();
    }
}