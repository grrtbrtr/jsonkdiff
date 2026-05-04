/**
 * Recursively flattens an object into a list of key paths.
 * Example: { a: { b: 1 } } -> ["a", "a.b"]
 * @param {object} obj - The object to traverse and flatten.
 * @param {string} [prefix] - The prefix to append to the key (used for nesting).
 * 
 * @returns {Array.<string>} An array of keys.
 */
export function getDeepKeys(obj, prefix = '') {
  let keys = [];
  for (const key in obj) {
    const fullPath = prefix ? `${prefix}.${key}` : key;
    keys.push(fullPath);
    
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys = keys.concat(getDeepKeys(obj[key], fullPath));
    }
  }
  return keys;
}