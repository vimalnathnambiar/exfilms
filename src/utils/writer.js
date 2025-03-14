/** @typedef {import('../../types/ms.mjs').ms} ms */

import { appendFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Write log data into TXT file.
 * @param {string} file File path
 * @param {string} data Log data
 * @returns {void}
 */
export function writeTXT(file, data) {
  appendFileSync(file, data);
}

/**
 * Write MS data into JSON file.
 * @param {string} directory Directory path
 * @param {ms} data MS data
 * @returns {void}
 */
export function writeJSON(directory, data) {
  const file = join(directory, `${data.id}.json`);

  writeFileSync(file, '{\n');
  jsonObjectHelper(data, 1, false, file);
  appendFileSync(file, '}');
}

/**
 * Format and write MS data object into JSON file.
 * @param {any} data MS data object
 * @param {number} indentationLevel JSON indentation level for formatting
 * @param {boolean} arrayStatus Data array status
 * @param {string} file File path
 * @returns {void}
 */
function jsonObjectHelper(data, indentationLevel, arrayStatus, file) {
  const indentation = '\t'.repeat(indentationLevel);

  Object.entries(data).forEach(([key, value], index) => {
    if (
      [
        'id',
        'timestamp',
        'vendor',
        'serialNumber',
        'id',
        'type',
        'polarity',
      ].includes(key) &&
      value !== null
    ) {
      appendFileSync(file, `${indentation}"${key}": "${value}"`);
    } else if (
      [
        'instrument',
        'scan',
        'precursor',
        'collision',
        'product',
        'basePeak',
        'array',
        'window',
        'isolationWindow',
      ].includes(key)
    ) {
      appendFileSync(file, `${indentation}"${key}": {\n`);
      key === 'array'
        ? jsonObjectHelper(data[key], indentationLevel + 1, true, file)
        : jsonObjectHelper(data[key], indentationLevel + 1, false, file);
      appendFileSync(file, `${indentation}}`);
    } else if (['spectrum', 'chromatogram'].includes(key)) {
      appendFileSync(file, `${indentation}"${key}": [\n`);
      jsonArrayHelper(value, indentationLevel + 1, file);
      appendFileSync(file, `${indentation}]`);
    } else {
      ['mz', 'intensity', 'time', 'msLevel'].includes(key) && arrayStatus
        ? appendFileSync(file, `${indentation}"${key}": [${value}]`)
        : appendFileSync(file, `${indentation}"${key}": ${value}`);
    }

    appendFileSync(file, index < Object.keys(data).length - 1 ? ',\n' : '\n');
  });
}

/**
 * Format and write MS data array into JSON file.
 * @param {any} data Data array
 * @param {number} indentationLevel JSON indentation level for formatting
 * @param {string} file File path
 * @returns {void}
 */
function jsonArrayHelper(data, indentationLevel, file) {
  const indentation = '\t'.repeat(indentationLevel);
  Object.entries(data).forEach(([key, value], index) => {
    appendFileSync(file, `${indentation}{\n`);
    jsonObjectHelper(value, indentationLevel + 1, false, file);
    appendFileSync(file, `${indentation}}`);
    appendFileSync(file, index < Object.keys(data).length - 1 ? ',\n' : '\n');
  });
}
