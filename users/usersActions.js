const db = require('../data/config');

module.exports = {
    getUsers() {
        return db('users');
    },
    getUserById(id) {
        const promise = new Promise((resolve, reject)=>{
            db('users').where({id})
            .then(([user])=>{
                if (!user) {
                    reject('no user with that id')
                } else {
                    resolve(user)
                }
            })
            .catch(err=>{
                reject(err.message)
            })
        })
        return promise;
    },
    getUserByDisplayName(displayName) {
        const promise = new Promise((resolve, reject)=>{
            db('users').where({display_name: displayName})
            .then(([user])=>{
                if (!user) {
                    reject('no user with that id')
                } else {
                    resolve(user)
                }
            })
            .catch(err=>{
                reject(err.message)
            })
        })
    },
    async getUserByEmail(email) {
        const user = await db('users').where({email});
        return user;
    },
    async addUser(user) {
        console.log('woeifje')
        const [id] = await db('users').insert(user);
        const addedUser = await db('users').where({id}).first();
        console.log(id, addedUser)
        return addedUser;
    },
    async updateUser(id, changes) {
        const userId = await db('users').update(changes).where({id});
        console.log(userId)
        const user = await db('users').where({id}).first();
        console.log(user)
        return user;
    },
    async deleteUser(id) {
        const user = await db('users').where({id}).first();
        if (!user) {
            console.log('wow')
            return 'user with the id of ' + id + ' does not exist'
        }
        const num = await db('users').where({id}).delete();
        return ('user with the id of ' + id + ' was successfully deleted')
    }
}