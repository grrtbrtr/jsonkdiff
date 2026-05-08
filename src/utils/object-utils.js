/**
 * Recursively flattens an object into a list of key paths.
 * Example: { a: { b: 1 } } -> ["a", "a.b"]
 * @param {object} obj - The object to traverse and flatten.
 * @param {string} [prefix] - The prefix to append to the key (used for nesting).
 * 
 * @returns {Array.<string>} An array of keys.
 */
export function getDeepKeys(obj, prefix = '') {
  return Object.keys(obj).reduce((allKeys, key) => {
    const fullPath = prefix ? `${prefix}.${key}` : key;
    allKeys.push(fullPath);

    if (
      typeof obj[key] === 'object' &&
      obj[key] !== null &&
      !Array.isArray(obj[key])
    ) {
      allKeys.push(...getDeepKeys(obj[key], fullPath));
    }
    return allKeys;
  }, []);
}