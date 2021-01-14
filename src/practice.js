require('dotenv').config();
const knex = require('knex');
// represents initial connection to db

// essentially the equivalent of below, object directly from SQL. weak to SQL injects.
// db.raw(`SELECT * FROM amazong_products WHERE name = 'Flobulator 2000'`).then(
//   (data) => {
//     console.log(data);
//   }
// );

// represents initial connection to db
const db = knex({
  client: 'pg',
  // hostname: 'localhost'
  // password: ''
  // databaseName: 'c47_knex_practice
  // port: 5432 ALTERNATIVELY WHEN DEPLOYED
  // connection: protocol username:password @ domain name :port / path
  connection: process.env.DB_URL,
});

const ArticlesService = require('./articles-service');
ArticlesService.getAllArticles(db);
//building a query

// select * from products...

function exampleOfQuery(inputName) {
  //builder used to view SQL query
  const builder = db('amazong_products')
    .select('*')
    // parameter prevents overwrite of SQL
    .where({ name: inputName });

  builder
    .then((data) => {
      console.log(data);
    })
    // error necessary to console knex error
    .catch((err) => {
      console.log(err);
    })
    // explicitly state to end process if necessary using .finally() method

    .finally(() => {
      db.destroy();
      // log query as defined by builder, to see SQL
      console.log(builder.toQuery());
    });
}

exampleOfQuery('Flobulator 2000');

module.exports = db;
