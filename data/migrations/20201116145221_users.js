
exports.up = function(knex) {
  return knex.schema
  .createTable('users', tbl=>{
      tbl.increments()
      tbl.string('display_name', 128).notNullable()
      tbl.string('email', 128).unique().notNullable()
      tbl.string('password', 128).notNullable()
      tbl.string('role', 128).notNullable()
      tbl.string('photo_src', 500)
  })
  .createTable('projects', tbl=>{
      tbl.increments()
      tbl.string('project_name', 128).notNullable()
      tbl.string('project_description', 128).notNullable()
      tbl.string('photo_src', 500)
      tbl.float('funding_goal').notNullable()
      tbl.integer('creator_id').notNullable()
      .unsigned()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
  })
  .createTable('donations', tbl=>{
      tbl.increments()
      tbl.float('amount').notNullable()
      tbl.integer('donor_id').notNullable()
      .unsigned()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
      tbl.integer('project_id').notNullable()
      .unsigned()
      .references('id')
      .inTable('projects')
      .onDelete('CASCADE')
      .onDelete('CASCADE')
  })
};

exports.down = function(knex) {
  return knex.schema
  .dropTableIfExists('donations')
  .dropTableIfExists('projects')
  .dropTableIfExists('users')
};
