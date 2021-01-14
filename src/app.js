require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const ArticlesService = require('./articles-service');
const knex = require('knex');

const { NODE_ENV } = require('./config');

const app = express();
//PIPELINE begins
// Standard middleware
app.use(cors());
app.use(helmet());
// invoking for POST endpoint to parse req body
app.use(express.json());

const morganOption = NODE_ENV === 'production' ? 'tiny' : 'common';
app.use(morgan(morganOption));

//Routes
app.get('/', (req, res, next) => {
  JSON.parse('{"key" : "value"}');

  res.json({ message: 'Hello, world!' });
});

app.get('/articles', (req, res, next) => {
  ArticlesService.getAllArticles(req.app.get('db'))
    .then((articles) => {
      res.json(articles);
    })
    .catch(next);
});

app.post('/articles', (req, res, next) => {
  const { title, content, style } = req.body;
  const newArticle = { title, content, style };
  ArticlesService.insertArticle(req.app.get('db'), newArticle).then(
    (article) => {
      res.status(201).location(`/articles/${article.id}`).json(article);
    }
  );
});

// Error handlers
app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    response = { message: 'Internal server error' };
  } else {
    console.error(error);
    response = { error, message: error.message };
  }
  res.status(500).json(response);
});

//PIPELINE ends

module.exports = app;
