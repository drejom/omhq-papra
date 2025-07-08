import type { Logger } from '../shared/logger/logger';
import { stdout } from 'node:process';
import { getConsoleIntro } from './server.models';

export function logConsoleIntro({
  version,
  writeStdout = str => stdout.write(str),
}: { version: string; writeStdout?: (str: string) => void }) {
  writeStdout(getConsoleIntro({ version }));
}
