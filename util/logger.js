const config = require('config');
const winston = require('winston');

const devMode = config.get('dev_mode');

const developmentLogger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service-development' },
  transports: [
    new winston.transports.Console({ colorize: true }),
    new winston.transports.File({
      filename: './logs/error.log',
      level: 'error',
      maxsize: '100000000' //100 mb in bytes
    }),
    new winston.transports.File({
      filename: './logs/combined.log',
      maxsize: '100000000' //100 mb in bytes
    })
  ]
});

const productionLogger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.Console({ colorize: true }),
    new winston.transports.File({
      filename: './logs/error.log',
      level: 'error',
      maxsize: '100000000' //100 mb in bytes
    }),
    new winston.transports.File({
      filename: './logs/combined.log',
      maxsize: '100000000' //100 mb in bytes
    })
  ]
});

module.exports = devMode ? developmentLogger : productionLogger;
