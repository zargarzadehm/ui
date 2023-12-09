import { CardanoKoiosScanner } from '@rosen-bridge/scanner';
import WinstonLogger from '@rosen-bridge/winston-logger';

import dataSource from '../../data-source';

import { startScanner } from '../scanner-utils';

import config from '../../configs';

import {
  CARDANO_KOIOS_URL,
  CARDANO_SCANNER_INTERVAL,
  CARDANO_SCANNER_LOGGER_NAME,
  SCANNER_API_TIMEOUT,
} from '../../constants';

const logger = WinstonLogger.getInstance().getLogger(import.meta.url);
const scannerLogger = WinstonLogger.getInstance().getLogger(
  CARDANO_SCANNER_LOGGER_NAME
);

/**
 * create a cardano scanner, initializing it and calling its update method
 * periodically
 */
export const startCardanoScanner = async () => {
  const scanner = new CardanoKoiosScanner(
    {
      dataSource,
      initialHeight: config.cardano.initialHeight,
      koiosUrl: CARDANO_KOIOS_URL,
      timeout: SCANNER_API_TIMEOUT,
    },
    scannerLogger
  );

  await startScanner(scanner, import.meta.url, CARDANO_SCANNER_INTERVAL);

  logger.debug('cardano scanner started');

  return scanner;
};
