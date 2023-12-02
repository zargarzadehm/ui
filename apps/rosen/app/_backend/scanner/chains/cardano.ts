import { CardanoKoiosScanner } from '@rosen-bridge/scanner';
import WinstonLogger from '@rosen-bridge/winston-logger';

import dataSource from '@/_backend/dataSource';

import { startScanner } from '../scanner-utils';

import {
  CARDANO_KOIOS_URL,
  CARDANO_SCANNER_INTERVAL,
  CARDANO_SCANNER_LOGGER_NAME,
  SCANNER_API_TIMEOUT,
} from '@/_backend/constants';

const scannerLogger = WinstonLogger.getInstance().getLogger(
  CARDANO_SCANNER_LOGGER_NAME,
);

/**
 * create a cardano scanner, initializing it and calling its update method
 * periodically
 */
export const startCardanoScanner = async () => {
  console.debug('@@@@@@@@@@@@@@ before instantiating cardano scanner');
  const scanner = new CardanoKoiosScanner(
    {
      dataSource,
      initialHeight: Number(process.env.CARDANO_INITIAL_HEIGHT) || 0,
      koiosUrl: CARDANO_KOIOS_URL,
      timeout: SCANNER_API_TIMEOUT,
    },
    scannerLogger,
  );

  console.debug('@@@@@@@@@@@@@@@@ before starting cardano scanner');
  startScanner(scanner, import.meta.url, CARDANO_SCANNER_INTERVAL);

  return scanner;
};
