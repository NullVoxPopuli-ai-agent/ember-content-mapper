import assert from 'node:assert/strict';
import { test } from 'node:test';

import { initialize } from '../src/requests/initialize.js';

test('initialize', () => {
  assert.deepEqual(initialize(), {
    protocolVersion: 1,
    positionEncoding: 'utf-16',
    diagnosticSource: 'glint',
  });
});
