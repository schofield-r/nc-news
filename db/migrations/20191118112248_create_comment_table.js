
exports.up = function(knex) {
  //console.log('creating comments table');
  return knex.schema.createTable('comments',(commentsTable)=>{
    commentsTable.increments('comment_id').primary();
    commentsTable.string('author').references('users.username').onDelete('CASCADE').notNullable();
    commentsTable.integer('article_id').references('articles.article_id').onDelete('CASCADE').notNullable();
    commentsTable.integer('votes').defaultTo(0).notNullable();
    commentsTable.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    commentsTable.text('body').notNullable();
  })
};

exports.down = function(knex) {
  //console.log('dropping comments table');
  return knex.schema.dropTable('comments');
};