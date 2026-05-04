# jsonkdiff

![NPM version](https://img.shields.io/npm/v/@grrtbrtr/jsonkdiff?color=blue) ![License](https://img.shields.io/github/license/grrtbrtr/jsonkdiff) ![Build](https://img.shields.io/github/actions/workflow/status/grrtbrtr/jsonkdiff/test.yml) ![Bundle size](https://img.shields.io/bundlephobia/min/@grrtbrtr/jsonkdiff)

A lightweight, zero-dependency CLI tool to compare multiple JSON files and identify missing (non-common) keys.
It generates a per-file report of unique keys to help identify schema drift.

Perfect for auditing translation files, config sets, or API mocks.

## Features

- **Deep comparison**: Recursively traverses objects to find missing keys at any nesting level.
- **Compare many files**: Compares 2 or more files, using the union of all keys as the "master" schema.
- **Per-file reports**: Aggregates all unique keys and tells you exactly what is missing from each file.
- **Zero dependencies**: Built with pure Node.js.

## Installation & usage

### Run without installing

```bash
npx @grrtbrtr/jsonkdiff file1.json file2.json file3.json
```

### Global installation

```bash
npm install -g @grrtbrtr/jsonkdiff
jsonkdiff file1.json file2.json file3.json
```

## Example output

If `en.json` has `{"auth": {"login": "Log In"}}` and `es.json` is empty, `jsonkdiff` will report:
```JSON
{
  "es.json": [
    "auth",
    "auth.login"
  ]
}
```

## License
[GPL-3.0-only](./LICENSE)