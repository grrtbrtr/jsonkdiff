import assert from 'node:assert';
import test from 'node:test';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { compareKeys, computeKeyDiff } from './../src/index.js';

test('Unit: computeKeyDiff', async (t) => {
  await t.test('identifies missing keys between two files', () => {
    const datasets = [
      { name: 'A.json', object: { id: 1, name: 'test' } },
      { name: 'B.json', object: { id: 2 } }
    ];
    const result = computeKeyDiff(datasets);

    assert.deepStrictEqual(result['A.json'], []);
    assert.deepStrictEqual(result['B.json'], ['name']);
  });

  await t.test('identifies keys missing from both sides simultaneously', () => {
    const datasets = [
      { name: 'A.json', object: { onlyA: 1 } },
      { name: 'B.json', object: { onlyB: 1 } }
    ];
    const result = computeKeyDiff(datasets);

    assert.deepStrictEqual(result['A.json'], ['onlyB']);
    assert.deepStrictEqual(result['B.json'], ['onlyA']);
  });
});

test('Integration: compareKeys', async (t) => {
  const file1 = path.join(os.tmpdir(), `jsonkdiff_1_${Date.now()}.json`);
  const file2 = path.join(os.tmpdir(), `jsonkdiff_2_${Date.now()}.json`);

  try {
    await fs.writeFile(file1, JSON.stringify({ active: true, meta: { id: 1 } }));
    await fs.writeFile(file2, JSON.stringify({ active: true }));

    await t.test('reads files and returns correct diff', async () => {
      const report = await compareKeys([file1, file2]);
      assert.ok(report[file2].includes('meta'));
      assert.ok(report[file2].includes('meta.id'));
    });

    await t.test('throws error on invalid JSON', async () => {
      const brokenFile = path.join(os.tmpdir(), `jsonkdiff_broken_${Date.now()}.json`);
      await fs.writeFile(brokenFile, '{ invalid json }');
      
      await assert.rejects(
        async () => {
          await compareKeys([brokenFile]);
        },
        {
          name: 'SyntaxError'
        }
      );

      await fs.unlink(brokenFile);
    });
  } finally {
    await Promise.all([
      fs.unlink(file1).catch(() => {}),
      fs.unlink(file2).catch(() => {}),
    ]);
  }
});