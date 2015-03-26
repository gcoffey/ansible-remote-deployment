// ARDE - Ansible Remote Deployment Executor 

var kue = require('kue');
var fs = require('fs');
var config = require('./config.json');
var logger = require('./logger.js');
var process = require('child_process').spawn;
var util = require('util');
var sys = require('sys');
var exec = require('exec');

var buildQueue = kue.createQueue({ 
  redis: {
    port: config.queue.port,
    host: config.queue.server
  }
});

buildQueue.process('build', config.queue.concurrency, function(job, done) {
  var formatArgs = util.format(config.ansible.args, job.data.client_ip, job.data.ssh_port, job.data.hostname, job.data.host_group);
  var job_progress = 0;

  logger.info('arde.js - Processing job ' + job.data.id);
  job.log('Executing Ansible');
  job.log('ansible-playbook ' + config.ansible.playbook + ' ' + formatArgs);

  var proc = spawn('ansible-playbook ' + config.ansible.playbook + ' ' + formatArgs);

    proc.stdout.on('data', function (data) {
      job.progress(job_progress, 100);
      job.state('active');
      job.log('<pre>'+data+'</pre>');
      job_progress++;
    });

    proc.on('error', function (data) {
      job.progress(100, 100);
      job.state('failed');
      job.log('<pre>'+data+'</pre>');
      logger.error('arde.js - Error processing ' + job.data.id);
      job_progress++;
    });

    proc.on('close', function (code) {
      logger.error('arde.js - Child process exited with status ' + code);
      if (code > 0) {
        job.progress(100,100);
        job.state('failed');
        job.log('BUILD FAILED');
        logger.info('arde.js - Failed when processing ' + job.data.id);
      } else{ 
        job.progress(100,100);
        job.state('complete');
        job.log('BUILD COMPLETE');
        logger.info('arde.js - Finished processing ' + job.data.id);
      }
    });

});

kue.app.listen(config.arde.listen_port);
kue.app.set('title', config.arde.admin_page_title);
logger.info('arde.js - Server started on port ' + config.arde.listen_port);
