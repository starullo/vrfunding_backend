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
    }
}