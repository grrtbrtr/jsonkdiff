# jsonkdiff

![NPM version](https://img.shields.io/npm/v/@grrtbrtr/jsonkdiff?color=blue) ![License](https://img.shields.io/github/license/grrtbrtr/jsonkdiff) ![Build](https://img.shields.io/github/actions/workflow/status/grrtbrtr/jsonkdiff/test.yml) ![Bundle size](https://img.shields.io/bundlephobia/min/@grrtbrtr/jsonkdiff)

A lightweight, zero-dependency CLI tool to compare multiple JSON files and identify missing (non-common) keys.
It generates a per-file report of unique keys to help identify schema drift.

### Why jsonkdiff?
Standard diff tools (like `git diff`) show line-by-line changes. `@grrtbrtr/jsonkdiff` focuses on **structural completeness**. It answers the question: *"I added a new key to my English translation file; did I forget to add it to the other 5 languages?"*

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

## Usage example: auditing i18n files

**file-a.json (English)**
```JSON
{ "nav": { "home": "Home", "about": "About" }, "logout": "Log Out" }
```

**file-b.json (French)**
```JSON
{ "nav": { "home": "Accueil" } }
```

**Running:**
```bash
npx @grrtbrtr/jsonkdiff file-a.json file-b.json
```

**Output:**
```
--- JSON Key Diff Report ---

File: b.json
  × Missing key: nav.about
  × Missing key: logout
```

## CI/CD integration

`jsonkdiff` follows standard Unix exit codes, making it usable in CI/CD pipelines (GitHub Actions, GitLab CI, etc.):

- **Exit code `0`**: No missing keys found (Success).
- **Exit code `1`**: Missing keys detected or an error occurred (Failure).

**Example: failing a GitHub Action if keys are missing**

```yaml
- name: Audit JSON Schemas
  run: npx @grrtbrtr/jsonkdiff locales/en.json locales/fr.json
```

## License
[GPL-3.0-only](./LICENSE)