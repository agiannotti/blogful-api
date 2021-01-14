const { expect } = require('chai');
const knex = require('knex');
const ArticlesService = require('../src/articles-service');

const testArticles = [
  {
    id: 1,
    title: 'blog 1',
    content: 'this is some content',
    date_published: new Date('2021-01-12T17:38:14.049Z'),
  },
  {
    id: 2,
    title: 'blog 2',
    content: 'this is some content',
    date_published: new Date('2021-01-12T17:38:14.049Z'),
  },
  {
    id: 3,
    title: 'blog 3',
    content: 'this is some content',
    date_published: new Date('2021-01-12T17:38:14.049Z'),
  },
  {
    id: 4,
    title: 'blog 4',
    content: 'this is some content',
    date_published: new Date('2021-01-12T17:38:14.049Z'),
  },
];

describe('Articles Service', () => {
  let db;
  //hooks used to set state of db for testing purposes
  // before runs single time before
  before('setup db', () => {
    // create connection to database
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });
  });

  before('clean db tables', () => {
    return db('blogful_articles').truncate();
  });
  // runs single time after
  after('destroy conn', () => {
    // destroy conn to db
    return db.destroy();
  });
  //runs before each it()
  // beforeEach();
  // runs after each it()
  afterEach('clean db tables', () => {
    return db('blogful_articles').truncate();
  });
  describe('getAllArticles()', () => {
    context('when database is populated', () => {
      beforeEach('insert data', () => {
        return db('blogful_articles').insert(testArticles);
      });

      it('should return all articles when data populated', () => {
        // set state of db
        return ArticlesService.getAllArticles(db).then((actualData) =>
          expect(actualData).to.eql(testArticles)
        );
      });
    });

    it('should return all articles when data populated', () => {
      // set state of db
      return db('blogful_articles')
        .insert(testArticles)
        .then(() => {
          return ArticlesService.getAllArticles(db).then((actualData) =>
            expect(actualData).to.eql(testArticles)
          );
        });
    });

    it('should return empty array when database is empty', () => {
      return ArticlesService.getAllArticles(db).then((actualData) =>
        expect(actualData).to.eql([])
      );
    });
  });

  describe('insertArticles()', () => {
    it('should return new article when valid data is provided', () => {
      const inputArticle = {
        title: 'test blog 1',
        content: 'test content',
        date_published: new Date('2021-01-12T17:38:14.049Z'),
      };
      return ArticlesService.insertArticle(db, inputArticle).then(
        (newArticle) => {
          expect(newArticle).to.be.an('object');
          // console.log('new article', newArticle);
          expect(newArticle.id).to.exist;
          expect(newArticle.content).to.eql(inputArticle.content);
          expect(newArticle.title).to.eql(inputArticle.title);
          expect(newArticle.date_published).to.eql(inputArticle.date_published);
        }
      );
    });
  });
});
