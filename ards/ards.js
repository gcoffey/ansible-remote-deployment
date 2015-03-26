// ARDS - Ansible Remote Deployment Scheduler

var express = require('express');
    bodyParser = require('body-parser');
    ansible = require('./routes/ansible');
    config = require('./config.json');
    logger = require('./logger.js');

var App = express();

App.use(bodyParser.json());

App.get('/ards/bootstrap-script', ansible.bootstrapScript);
App.get('/ards/ansible-ssh-key', ansible.ansibleSshKey);
App.post('/ards/add-server', ansible.addServer);

App.listen(config.ards.listen_port, '0.0.0.0');
logger.info('ards.js - Server started on port ' + config.ards.listen_port);
