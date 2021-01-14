const express = require('express');

const ArticlesService = require('./articles-service');
const articlesRouter = express.Router();

// articlesRouter.get('/', (req, res, next) => {
//   JSON.parse('{"key" : "value"}');

//   res.json({ message: 'Hello, world!' });
// });

articlesRouter.get('/', (req, res, next) => {
  ArticlesService.getAllArticles(req.app.get('db'))
    .then((articles) => {
      res.json(articles);
    })
    .catch(next);
});

articlesRouter.post('/', (req, res, next) => {
  const { title, content, style } = req.body;
  const newArticle = { title, content, style };
  ArticlesService.insertArticle(req.app.get('db'), newArticle).then(
    (article) => {
      res.status(201).location(`/articles/${article.id}`).json(article);
    }
  );
});

module.exports = articlesRouter;
