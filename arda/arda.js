// ARDA - Ansible Remote Deployment Admin

var express = require('express');
    passport = require('passport');
    LocalStrategy = require('passport-local').Strategy;
    flash = require('connect-flash');
    path = require('path');
    bodyparser = require('body-parser');
    validator = require('express-validator');
    cookie = require('cookie-parser');
    session = require('express-session');
    config = require('./config.json');
    logger = require('./logger.js');
    
var App = express();

App.use(express.static(__dirname + '/public'));
App.set('views', __dirname + '/views');
App.set('view engine', 'jade');i
App.use(bodyparser.urlencoded({ extended: true }));
App.use(validator([]));
App.use(cookie());
App.use(session({ secret: config.arda.session_secret }));
App.use(passport.initialize());
App.use(passport.session());

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

function restrict(req, res, next) {
  if(req.session.authenticated) {
    next();
  } else {
    res.redirect('/');
  }
}

require('./routes/main')(App);
require('./routes/auth')(App);



App.listen(config.arda.listen_port);
logger.info('arda.js - Server started on port ' + config.arda.listen_port);
