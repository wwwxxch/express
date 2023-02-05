const express = require('express');
const session = require('express-session');

const app = express();
const port = 5000;

const memberRoute = require('./routes/member');

app.use(express.static('./public'));
app.set('view engine', 'pug');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({
  name: 'member',
  secret: 'testauth',
  resave: false,
  saveUninitialized: false,
  cookie: { SameSite: 'lax', maxAge: 5 * 60 * 1000 }
}));

app.use(memberRoute);

// --------------------------------------------------------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
