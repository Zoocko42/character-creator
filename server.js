const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const Model = require('./models')

const routes = require('./controllers')
const sequelize = require('./config/connection')
const helpers = require('./utils/helper');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const PORT = (process.env.PORT || 3001);

const hbs = exphbs.create({helpers});

const sess = {
  secret: 'Super secret secret',
  cookie: { maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: false,
    sameSite: 'strict',},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

app.use(session(sess));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});


