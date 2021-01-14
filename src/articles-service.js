// //injecting knex dependency instance into service
// const knex = require('knex');
// // represents initial connection to db
// const db = knex({
//   client: 'pg',
//   // hostname: 'localhost'
//   // password: ''
//   // databaseName: 'c47_knex_practice
//   // port: 5432 ALTERNATIVELY WHEN DEPLOYED
//   // connection: protocol username:password @ domain name :port / path
//   connection: process.env.DB_URL,
// });

// module.exports = db;

const ArticlesService = {
  //dependency injection
  getAllArticles(db) {
    return db.select('*').from('blogful_articles');
    // return Promise.resolve();
  },

  insertArticle(db, data) {
    return db('blogful_articles')
      .insert(data)
      .returning('*')
      .then((rows) => rows[0]);
  },
};

module.exports = ArticlesService;
