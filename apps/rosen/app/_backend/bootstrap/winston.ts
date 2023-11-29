import WinstonLogger from '@rosen-bridge/winston-logger';

WinstonLogger.init([
  {
    type: 'console',
    level: process.env.CONSOLE_LOG_LEVEL || 'info',
  }
]);
