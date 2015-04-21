// ARDA - Ansible Remote Deployment Admin

var express = require('express');
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
App.set('view engine', 'jade');
App.use(bodyparser.urlencoded({ extended: true }));
App.use(validator([]));

App.use(cookie());
App.use(session({ secret: config.arda.session_secret }));

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
