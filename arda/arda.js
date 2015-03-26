// ARDA - Ansible Remote Deployment Admin
 
var express = require('express');
    bodyParser = require('body-parser');
    ansible = require('./routes/ansible');
    config = require('./config.json');
    logger = require('./logger.js');
 
var App = express();

App.use(bodyParser.json());

App.get('/arda/admin', ansible.adminView);
App.post('/arda/report', ansible.adminReport);
App.post('/arda/check-in', ansible.checkIn);

App.listen(config.arda.listen_port);
logger.info('arda.js - Server started on port ' + config.arda.listen_port);
