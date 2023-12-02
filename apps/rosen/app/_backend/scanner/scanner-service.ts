import { startCardanoScanner } from './chains/cardano';
import { startErgoScanner } from './chains/ergo';

import observationService from '../observation/observation-service';

/**
 * start all scanners and register their extractors
 */
const start = async () => {
  console.debug('@@@@@@@@@@@ before starting scanners');
  const [ergoScanner] = await Promise.all([
    startErgoScanner(),
    // startCardanoScanner(),
  ]);
  console.debug('@@@@@@@@@@ scanners started. before registering extractors');

  observationService.registerErgoExtractor(ergoScanner);
  // observationService.registerCardanoExtractor(cardanoScanner);

  console.debug('@@@@@@@@@ extractors registered');
};

const scannerService = {
  start,
};

export default scannerService;
