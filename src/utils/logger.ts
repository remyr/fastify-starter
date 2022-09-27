import pino from 'pino';
import { IS_PRODUCTION } from '../constants';

const logger = pino({
  level: IS_PRODUCTION ? 'info' : 'debug',
  transport: {
    target: 'pino-pretty',
    options: {
      ignore: 'pid,hostname',
    },
  },
});

export default logger;
