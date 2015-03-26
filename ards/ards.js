// ARDS - Ansible Remote Deployment Scheduler
 
var express = require('express');
    bodyParser = require('body-parser');
    ansible = require('./routes/ansible');
    config = require('./config.json');
    logger = require('./logger.js');
 
var App = express();

App.use(bodyParser.json());

App.get('/ards/bootstrap-script', ansible.bootstrapScript(file: config.ards.bootstrap_script));
App.get('/ards/ansible-ssh-key', ansible.ansibleKey(file: config.ards.ansible_ssh_key));
App.post('/ards/add-server', ansible.addServer);

App.listen(config.ards.listen_port);
logger.info('ards.js - Server started on port ' + config.ards.listen_port);
