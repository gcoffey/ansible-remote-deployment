var fileSystem = require('fs');
    config = require('../config.json');
    logger = require('../logger.js');
   
var db = require('nosql').load(config.database.file);

exports.checkIn = function(req, res) {
  var remote_ip = req.connection.remoteAddress;
  var raw_payload = JSON.stringify(req.body);
  var payload = JSON.parse(raw_payload);
  var now = new Date();

  // Check for a server reoord
  // Create a new server status record

  // Check-In cannot occur if no server record
  // Return a 404

  var build_job = {
        id: uuid.v4(),
        type: 'build',
        job_create: now.toJSON(),
        hostname: payload.data.hostname,
        client_ip: payload.data.ip_address,
        remote_ip: remote_ip,
        ssh_port: payload.data.ssh_port,
        host_group: payload.data.host_group,
        title: 'Ansible Run On ' + remote_ip
  };

  if (remote_ip == build_job.client_ip) {
    Port.probe(build_job.client_ip, build_job.ssh_port, function(err, valid) {
      if (valid) {
        buildQueue.create('build', build_job).save(); 
        res.status(202).send();
        logger.info('routes/ansible.js - Client placed in build queue ' + build_job.hostname + ' (' + build_job.id + ')' );
        logger.debug('routes/ansible.js - Client request ' + build_job.id + ' remote_ip: ' + build_job.remote_ip  + ' payload: ' + raw_payload);
      } else {
        res.status(500).send();
        logger.error('routes/ansible.js - Client SSH port is not accessible ' + build_job.hostname + ' (' + build_job.id + ') remote_ip: ' + build_job.remote_ip + ' payload: ' + raw_payload); 
      }  
    });

  } else {
    res.status(500).send();
    logger.error('routes/ansible.js - Remote IP and client IP are different ' + build_job.hostname + ' (' + build_job.id + ') remote_ip: ' + build_job.remote_ip + ' payload: ' + raw_payload);
  }
}

exports.fileDownload = function(req, res, file) {
  var stat = fileSystem.statSync(file);
 
  if (stat.isFile()) {
    res.writeHead(200, {
      'Content-Type': 'text/plain',
      'Content-Length': stat.size
    });
    var readStream = fileSystem.createReadStream(file);
    readStream.pipe(res);
  } else {
    res.writeHead(404, {
      'Content-Type': 'text/plain',
      'Content-Length': 0
    });
  }
}
