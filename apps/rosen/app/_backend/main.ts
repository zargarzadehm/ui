import './bootstrap';

const x = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../configs/tokensMap.json',
);

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
