
exports.up = function(knex) {
  //console.log('creating articles table');
  return knex.schema.createTable('articles',(articlesTable)=>{
    articlesTable.increments('article_id').primary();
    articlesTable.string('title').notNullable();
    articlesTable.text('body').notNullable();
    articlesTable.integer('votes').defaultTo(0).notNullable();
    articlesTable.string('topic').references('topics.slug').onDelete('CASCADE').notNullable();
    articlesTable.string('author').references('users.username').onDelete('CASCADE').notNullable();
    articlesTable.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
  })
};

exports.down = function(knex) {
  //console.log('dropping articles table');
  return knex.schema.dropTable('articles');
};
