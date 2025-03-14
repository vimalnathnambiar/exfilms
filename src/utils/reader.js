import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import fetch from 'node-fetch';
import papa from 'papaparse';

import { roundValue } from './calculator.js';

/**
 * Read package.json file for property information.
 * @param {string} property Package property to search for
 * @returns {any} Property information
 */
export function readPackage(property) {
  return property
    .replace(/\[(\d+)\]/g, '.$1')
    .replace(/\[(['"])(.*?)\1\]/g, '.$2')
    .split('.')
    .reduce(
      (accumulator, element) =>
        accumulator && element in accumulator
          ? accumulator[element]
          : undefined,
      JSON.parse(
        readFileSync(
          join(import.meta.dirname, '..', '..', 'package.json'),
        ).toString(),
      ),
    );
}

/**
 * Read target file for list of m/z values to filter for.
 * @param {string} file TSV target file path (local or remote URL)
 * @param {number[]} msLevel MS level to filter for
 * @param {string[]} polarity Polarity to filter for
 * @param {number} precision Number of decimal places to round m/z values to
 * @returns {Promise<[number, number, string][]>} Target list of m/z values to filter for
 */
export async function readTargetFile(file, msLevel, polarity, precision) {
  // Parse data
  const localPattern = /\.tsv$/i;
  let data = [];

  if (localPattern.test(file)) {
    try {
      ({ data } = papa.parse(readFileSync(file).toString(), {
        delimiter: '\t',
        header: true,
      }));
    } catch (error) {
      throw new Error('Unable to parse data from local path');
    }
  } else {
    await fetch(file)
      .then((response) => response.text())
      .then((content) => {
        ({ data } = papa.parse(content, { delimiter: '\t', header: true }));
      })
      .catch(() => {
        throw new Error('Unable to parse data from remote URL');
      });
  }

  // No data?
  if (data.length === 0) {
    throw new Error('Target file is empty');
  }

  // Missing data headers?
  const missingHeaders = [
    'Compound Type',
    'Compound Name',
    'Polarity',
    'Mass-to-Charge Ratio (m/z)',
    'Retention Time (min)',
    'MS Level',
    'Internal Standards',
    'Products',
  ].filter(
    (header) => !(data.length > 0 ? Object.keys(data[0]) : []).includes(header),
  );

  if (missingHeaders.length > 0) {
    throw new Error(`Missing data headers (${missingHeaders})`);
  }

  // Extract target list
  const targetList = [
    ...new Set(
      data
        .filter((row) =>
          isNaN(msLevel[0])
            ? (polarity.includes('positive') &&
                String(row['Polarity']) === '+') ||
              (polarity.includes('negative') && String(row['Polarity']) === '-')
            : msLevel.includes(Number(row['MS Level'])) &&
              ((polarity.includes('positive') &&
                String(row['Polarity']) === '+') ||
                (polarity.includes('negative') &&
                  String(row['Polarity']) === '-')),
        )
        .map((row) => [
          !isNaN(precision)
            ? roundValue(Number(row['Mass-to-Charge Ratio (m/z)']), precision)
            : Number(row['Mass-to-Charge Ratio (m/z)']),
          Number(row['MS Level']),
          String(row['Polarity']),
        ])
        // @ts-ignore
        .sort((a, b) => a[0] - b[0])
        .map((item) => item.join(',')),
    ),
  ].map((target) =>
    target
      .split(',')
      .map((item) => (isNaN(Number(item)) ? String(item) : Number(item))),
  );

  // No target list?
  if (targetList.length === 0) {
    throw new Error('Target list is empty');
  }

  // @ts-ignore
  return targetList;
}
