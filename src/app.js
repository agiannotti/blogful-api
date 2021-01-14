require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const articlesRouter = require('./articles/articles-router');

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

app.get('/', (req, res) => {
  res.json({ message: 'Hello, world!' });
});

app.use('/articles', articlesRouter);

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
