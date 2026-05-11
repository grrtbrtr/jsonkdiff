#!/usr/bin/env node
import { compareKeys } from './../src/index.js';

const STYLES = Object.freeze({
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
});

const files = process.argv.slice(2);

if (files.length < 2) {
  console.log(`\n${STYLES.bold}Usage:${STYLES.reset} jsonkdiff <file1.json> <file2.json> ...`);
  process.exit(1);
}

async function main() {
  try {
    const report = await compareKeys(files);
    
    console.log(`\n${STYLES.blue}${STYLES.bold}--- JSON Key Diff Report ---${STYLES.reset}\n`);

    let hasIssues = false;
    for (const [fileName, missing] of Object.entries(report)) {
      if (missing.length > 0) {
        hasIssues = true;
        console.log(`${STYLES.yellow}File: ${fileName}${STYLES.reset}`);
        missing.forEach(key => {
          console.log(`  ${STYLES.red}× Missing key:${STYLES.reset} ${key}`);
        });
        console.log(''); 
      }
    }

    if (!hasIssues) {
      console.log(`${STYLES.green}✔ All files share the exact same keys!${STYLES.reset}\n`);
      process.exit(0);
    } else {
      process.exit(1);
    }
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.error(`${STYLES.red}${STYLES.bold}Error:${STYLES.reset} Could not find file "${err.path}"`);
    } else if (err instanceof SyntaxError) {
      console.error(`${STYLES.red}${STYLES.bold}Error:${STYLES.reset} Invalid JSON in one of the files.`);
    } else if (err.code === 'EISDIR') {
      console.error(`${STYLES.red}${STYLES.bold}Error:${STYLES.reset} One of the given paths is a directory, not a file.`);
    } else {
      console.error(`${STYLES.red}${STYLES.bold}Error:${STYLES.reset} ${err.message}`);
    }
    process.exit(1);
  }
}

main();