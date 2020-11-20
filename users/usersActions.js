const db = require('../data/config');

module.exports = {
    getUsers() {
        return db('users');
    },
    async getUserById(id) {
      return db('users').where({id}).first();
      
    },
    async getUserByDisplayName(displayName) {
        return db('users').where({display_name: displayName}).first()
    },
    async getUserByEmail(email) {
        return db('users').where({email}).first();
    },
    async addUser(user) {
        const [id] = await db('users').insert(user);
        const addedUser = await db('users').where({id}).first();
        return addedUser;
    },
    async updateUser(id, changes) {
        let wow = await db('users').update(changes).where({id});
        return db('users').where({id}).first()
    },
    async deleteUser(id) {
        const [user] = await db('users').where({id})
        if (!user) {
            console.log('wow')
            return 'user with the id of ' + id + ' does not exist'
        }
        const num = await db('users').where({id}).delete();
        return ('user with the id of ' + id + ' was successfully deleted')
    }
}