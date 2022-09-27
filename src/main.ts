import 'dotenv/config';

import createServer from './utils/createServer';
import logger from './utils/logger';
import { HOST, PORT } from './constants';

async function main() {
  const server = createServer();

  try {
    const url = await server.listen({
      port: PORT,
      host: HOST,
    });
    logger.info(`Server running at url: ${url}`);
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
}
logger.debug('ENABLED');
main();
