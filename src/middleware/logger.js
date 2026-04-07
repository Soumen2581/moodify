const { createLogger, transports, format } = require('winston');
const LokiTransport = require('winston-loki');

const logger = createLogger({
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.Console(),
    new LokiTransport({
      host: 'http://loki:3100',
      labels: { app: 'moodify' },
      json: true,
      batching: true,
      interval: 5,
    }),
  ],
});

module.exports = logger;