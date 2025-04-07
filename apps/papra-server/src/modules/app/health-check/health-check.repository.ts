import type { Config } from '../../config/config.types';
import type { Database } from '../database/database.types';
import { safely } from '@corentinth/chisels';
import { sql } from 'drizzle-orm';
import { joinStorageKeyParts } from '../../documents/documents.models';
import { createDocumentStorageService } from '../../documents/storage/documents.storage.services';
import { collectReadableStreamToString } from '../../shared/streams/readable-stream';

export async function isDatabaseHealthy({ db }: { db: Database }) {
  const [result, error] = await safely(db.run(sql`SELECT 1;`));

  return error === null && result.rows.length > 0 && result.rows[0]['1'] === 1;
}

export async function isDocumentStoreHealthy({ config, now = new Date() }: { config: Config; now?: Date }) {
  const storage = await createDocumentStorageService({ config });
  const fileContent = 'test';

  const file = new File([fileContent], 'test.txt', { type: 'text/plain' });

  const storageKey = joinStorageKeyParts('health-check', `${now.getTime()}.txt`);

  const [, uploadError] = await safely(storage.saveFile({ file, storageKey }));

  if (uploadError !== null) {
    return false;
  }

  const [result, downloadError] = await safely(storage.getFileStream({ storageKey }));

  if (downloadError !== null) {
    return false;
  }

  const retrievedFileContent = await collectReadableStreamToString({ stream: result.fileStream });

  if (retrievedFileContent !== fileContent) {
    return false;
  }

  const [, deleteError] = await safely(storage.deleteFile({ storageKey }));

  return deleteError === null;
}
