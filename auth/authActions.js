const db = require('../data/config');

module.exports = {
    addUser(user) {
        const promise = new Promise((resolve, reject)=>{
            db('users').insert(user)
            .then(([id])=>{
                return db('users').where({id}).first()
            })
            .then(data=>{
                return data;
            })
            .catch(err=>{
                return err.message
            })
        })
        return promise;
    }
}