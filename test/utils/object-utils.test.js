import test from 'node:test';
import assert from 'node:assert';

import { getDeepKeys } from './../../src/utils/object-utils.js';

test('Unit: getDeepKeys', async (t) => {
  await t.test('flattens nested objects', () => {
    const input = { a: { b: { c: 1 } } };
    const expected = ['a', 'a.b', 'a.b.c'];
    assert.deepStrictEqual(getDeepKeys(input), expected);
  });

  await t.test('handles empty objects', () => {
    assert.deepStrictEqual(getDeepKeys({}), []);
  });

  await t.test('handles null values without crashing', () => {
    const input = { a: null, b: { c: null } };
    const expected = ['a', 'b', 'b.c']; 
    assert.deepStrictEqual(getDeepKeys(input), expected);
  });

  await t.test('treats arrays as leaf nodes (values)', () => {
    const input = { list: [1, 2, 3] };
    const expected = ['list'];
    assert.deepStrictEqual(getDeepKeys(input), expected);
  });
});