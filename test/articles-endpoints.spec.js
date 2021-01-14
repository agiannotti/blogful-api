const { expect } = require('chai');
const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');
const { makeArticlesArray } = require('./articles.fixtures');

describe('Articles Endpoints', () => {
  const testArticles = makeArticlesArray();
  let db;
  before('setup db', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });

    app.set('db', db);
  });
  before('clean tables', () => db('blogful_articles').truncate());
  afterEach('clean tables', () => db('blogful_articles').truncate());

  after('destroy conn', () => db.destroy());
  describe('GET /articles', () => {
    it('should return 200 and empty array if db is empty', () => {
      return supertest(app).get('/articles').expect(200, []);
    });
    context('with articles populated', () => {
      beforeEach('insert articles', () =>
        db('blogful_articles').insert(testArticles)
      );
      it('should return 200 and article array when db populated', () => {
        return supertest(app).get('/articles').expect(200, testArticles);
      });
    });
  });

  describe('POST /articles', () => {
    it('should return 201 with new article when data is valid', () => {
      const validArticle = {
        title: 'New Blog',
        content: 'some content',
        style: 'Listicle',
      };

      return supertest(app)
        .post('/articles')
        .send(validArticle)
        .expect(201)
        .then((res) => {
          expect(res.body).to.be.an('object');
          expect(res.body.title).to.eql(validArticle.title);
          expect(res.body.content).to.eql(validArticle.content);
          expect(res.body.style).to.eql(validArticle.style);
          expect(res.body.id).to.exist;
          expect(res.headers.location).to.eql(`/articles/${res.body.id}`);
          const actualDate = new Date(res.body.date_published).toLocaleString();
          const expectedDate = new Date().toLocaleString();
          expect(actualDate).to.eql(expectedDate);
        });
    });
  });
});
