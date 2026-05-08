import fs from 'node:fs/promises';
import path from 'node:path';

import { getDeepKeys } from './utils/object-utils.js';

/**
 * Identify missing keys across multiple datasets.
 * It aggregates all unique keys found across all objects and identifies
 * which specific keys are absent from each individual object.
 * 
 * @param {Array.<{name: string, object: object}>} datasets - An array of objects containing a name and the actual object.
 * @returns {Object.<string, string[]>} A report where keys are the object names and values are arrays of missing key paths.
 */
export function computeKeyDiff(datasets) {
  const allKeys = new Set();

  const processedData = datasets.map(ds => {
    const keys = getDeepKeys(ds.object);
    keys.forEach(k => allKeys.add(k));

    return {
      name: ds.name,
      keySet: new Set(keys),
    };
  });

  const report = {};
  for (const item of processedData) {
    report[item.name] = [...allKeys].filter(k => !item.keySet.has(k));
  }
  return report;
}

/**
 * Reads multiple JSON files and performs a key-level diff.
 * @async
 * 
 * @param {string[]} filePaths - An array of relative or absolute paths to JSON files.
 * @returns {Promise<Object.<string, string[]>>} A promise that resolves to the diff report.
 * @throws {Error} Throws an error if any file cannot be read or parsed as valid JSON.
 */
export async function compareKeys(filePaths) {
  const datasets = await Promise.all(filePaths.map(async (filePath) => {
    const absPath = path.resolve(filePath);
    const file = await fs.readFile(absPath, 'utf-8');
    return {
      name: filePath,
      object: JSON.parse(file)
    };
  }));

  return computeKeyDiff(datasets);
}