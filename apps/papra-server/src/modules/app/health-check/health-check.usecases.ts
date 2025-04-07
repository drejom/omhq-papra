import type { Config } from '../../config/config.types';
import type { Logger } from '../../shared/logger/logger';
import type { Database } from '../database/database.types';
import { exit } from 'node:process';
import { createLogger } from '../../shared/logger/logger';
import { HEALTH_CHECK_ERROR_EXIT_CODE } from './health-check.constants';
import { isDatabaseHealthy, isDocumentStoreHealthy } from './health-check.repository';

export async function ensureServicesAreHealthy({ config, db, logger = createLogger({ namespace: 'health-check' }) }: { config: Config; db: Database; logger?: Logger }) {
  const isDbHealthy = await isDatabaseHealthy({ db });
  const isDocStoreHealthy = await isDocumentStoreHealthy({ config });

  if (!isDbHealthy) {
    logger.error('Unable to connect to database');
  }

  if (!isDocStoreHealthy) {
    logger.error('Document store is not healthy');
  }

  if (!isDbHealthy || !isDocStoreHealthy) {
    logger.error({ isDbHealthy, isDocStoreHealthy }, 'Some app services are not available, exiting');
    exit(HEALTH_CHECK_ERROR_EXIT_CODE);
  }
}
