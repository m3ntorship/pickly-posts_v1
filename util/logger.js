const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.Console({ colorize: true }),
    new winston.transports.File({
      filename: './logs/error.log',
      level: 'error',
      maxsize: '100000000' // 100 mb in bytes
    }),
    new winston.transports.File({
      filename: './logs/combined.log',
      maxsize: '100000000' // 100 mb in bytes
    })
  ]
});

module.exports = logger;
