const knex = require('knex');
const knexfile = require('../knexfile');
require('dotenv').config()

const env = process.env.DB_ENV || "development";

module.exports = knex(knexfile[env]);