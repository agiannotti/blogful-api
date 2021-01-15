const express = require('express');
const xss = require('xss');

const ArticlesService = require('./articles-service');
const articlesRouter = express.Router();

articlesRouter.get('/', (req, res, next) => {
  ArticlesService.getAllArticles(req.app.get('db'))
    .then((articles) => {
      const sanitizeArticles = articles.map((article) => {
        return {
          article,
          title: xss(article.title),
          content: xss(article.content),
          style: xss(article.style),
        };
      });
      res.json(sanitizeArticles);
    })
    .catch(next);
});

articlesRouter.post('/', (req, res, next) => {
  const { title, content, style } = req.body;

  const newArticle = { title, content, style };

  ArticlesService.insertArticle(req.app.get('db'), newArticle)
    .then((article) => {
      res.status(201).location(`/articles/${article.id}`).json(article);
    })
    .catch(next);
});

// hacker mans danger str
//<p>Hello There!</p><img onerror='console.log(window.localStorage.getItem("secret_token"))' src='error.jpg'>
module.exports = articlesRouter;
