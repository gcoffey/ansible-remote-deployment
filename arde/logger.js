var winston = require('winston');
var config = require('./config.json');

var logger = new (winston.Logger) ({
  transports: [
    new (winston.transports.Console)({ json: false, timestamp: true }),
    new winston.transports.File({ 
          name: 'file.app',
          filename: config.logger.app_log,
          maxsize: 20971520,
          level: 'info',
          json: false
        }), 
    new winston.transports.File({
          name: 'file.error',
          filename: config.logger.error_log,
          maxsize: 20971520,
          level: 'error',
          json: false
        })
  ],
  exceptionHandlers: [
    new (winston.transports.Console)({ json:false, timestamp: true }),
    new winston.transports.File({ 
          filename: config.logger.debug_log,
          maxsize: 20971520,
          level: 'debug',
          handleExceptions: true, 
          json: false 
        })
  ],
  exitOnError: false
});

module.exports = logger;
