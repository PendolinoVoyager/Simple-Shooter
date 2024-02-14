const express = require('express');
const fs = require('fs');

const index = fs.readFileSync(
  `${__dirname}/../${
    process.env.NODE_ENV === 'production' ? 'public/build/' : ''
  }index.html`,
  'utf-8'
);

const app = express();

app.use(express.static(`public`));

if (process.env.NODE_ENV === 'development') {
  app.get('/', (req, res) => {
    res.send(index);
  });
} else if (process.env.NODE_ENV === 'production') {
  app.use(express.static('public/build'));
  app.get('/', (req, res) => {
    res.send(index);
  });
}

// No 404, just redirect
app.use('*', (request, response) => {
  response.redirect('/');
});

// Error route
app.use((error, request, response, next) => {
  console.error(`\x1b[0;31m${error}\n${error.stack}\x1b[0;m`);
  response
    .status(500)
    .send(
      `We have encountered a fatal error! Sorry for that, brb soon!<br/>${
        process.env.NODE_ENV === 'development'
          ? error.message + error.stack
          : ''
      }`
    );
});

module.exports = app;
