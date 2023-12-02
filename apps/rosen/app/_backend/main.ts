import './bootstrap';

path.resolve(process.cwd(), './configs/tokensMap.json');

import WinstonLogger from '@rosen-bridge/winston-logger';

import scannerService from './scanner/scanner-service';

import dataSource from './dataSource';
import path from 'path';
import { fileURLToPath } from 'url';

const logger = WinstonLogger.getInstance().getLogger(import.meta.url);

await dataSource.initialize();
logger.info('data source initialized successfully');

await dataSource.runMigrations();

scannerService.start();

fetch('https://api.koios.rest/api/v1/blocks?block_height=eq.9558336')
  .then((data) => console.info('@@@@@@@@@@@@@@@ koios data', data))
  .catch((error) => console.error('@@@@@@@@@@@@@ koios error', error));

process.on('unhandledRejection', (reason, promise) => {
  console.warn('@@@@@@@@@@@@@@@@@@@@ unhandled: ', reason, promise);
});
