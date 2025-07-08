import { describe, expect, test } from 'vitest';
import { getHead } from './server.models';

describe('server models', () => {
  describe('getHead', () => {
    test('it displays an ascii art with some information', () => {
      expect(getHead({ version: '1.0.0' })).toMatchInlineSnapshot(`
        "
                  ____
                 |  _ \\ __ _ _ __  _ __ __ _
          _____  | |_) / _\` | '_ | '__/ _\` |  _____
         |_____| |  __/ (_| | |_) | | | (_| | |_____|
                 |_|   \\__,_| .__/|_|  \\__,_|
                            |_|

        Papra v1.0.0 - https://papra.app - Support Papra: https://papra.app/support"
      `);
    });
  });
});
