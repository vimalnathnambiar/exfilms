/** @typedef {import('../../types/configuration.mjs').configuration} configuration */

import { existsSync, statSync } from 'node:fs';
import { homedir } from 'node:os';
import { basename, join } from 'node:path';

import inquirer from 'inquirer';

import { getDataFileList } from './fsManager.js';

/**
 * Inquirer.
 */
const questions = [
  {
    name: 'inputDirectory',
    message: 'Input directory path',
    type: 'input',
    validate: (input) => {
      // Undefined?
      if (!input || input.trim() === '') {
        return 'Requires a path';
      }

      // Does not exist?
      if (!existsSync(input)) {
        return 'Does not exist';
      }

      // Not a directory?
      if (!statSync(input).isDirectory()) {
        return 'Not a directory';
      }

      // No data files?
      if (getDataFileList(input).length === 0) {
        return 'No MS data files';
      }

      return true;
    },
  },
  {
    name: 'fileList',
    message: 'MS data files to extract from\n',
    type: 'checkbox',
    choices: (answers) => {
      return getDataFileList(answers.inputDirectory);
    },
    validate: (input) => {
      // No selection?
      if (input.length === 0) {
        return 'Requires at least one data file';
      }

      return true;
    },
  },
  {
    name: 'outputDirectory',
    message: 'Output directory path',
    type: 'input',
    default: (answers) => {
      return join(homedir(), 'exfilms', basename(answers.inputDirectory));
    },
    validate: (input) => {
      // Undefined?
      if (!input || input.trim() === '') {
        return 'Requires a path';
      }

      return true;
    },
  },
  {
    name: 'outputFormat',
    message: 'Output format',
    type: 'list',
    choices: ['JSON'],
  },
  {
    name: 'precision',
    message: 'Number of decimal places to round precision values to',
    type: 'input',
    default: 'original=NaN',
    validate: (input) => {
      input = Number(input);

      // Invalid value?
      if (!isNaN(input) && input < 0) {
        return 'Requires NaN or a numeric value greater than or equal to zero (>=0)';
      }

      return true;
    },
  },
  {
    name: 'metadata',
    message: 'Exclude spectrum array',
    type: 'confirm',
    default: false,
  },
  {
    name: 'filterSpectrumData',
    message: 'Filter spectrum data',
    type: 'confirm',
    default: false,
  },
  {
    name: 'msLevel',
    message: 'MS level to filter for (space-separated)',
    type: 'input',
    default: 'all=NaN',
    when: (answers) => answers.filterSpectrumData,
    validate: (input) => {
      input = [...new Set(String(input).split(/\s+/).map(Number))];

      // Default value?
      if (input.length === 1 && isNaN(input[0])) {
        return true;
      }

      // Invalid values?
      if (input.some((level) => isNaN(level) || level < 1)) {
        return 'Requires NaN or numeric values greater than zero (>0)';
      }

      return true;
    },
  },
  {
    name: 'spectrumType',
    message: 'Spectrum type to filter for',
    type: 'checkbox',
    choices: ['profile', 'centroid'],
    default: ['profile', 'centroid'],
    when: (answers) => answers.filterSpectrumData,
    validate: (input) => {
      // No selection?
      if (input.length === 0) {
        return 'Requires at least one type';
      }

      return true;
    },
  },
  {
    name: 'spectrumPolarity',
    message: 'Spectrum polarity to filter for',
    type: 'checkbox',
    choices: ['positive', 'negative'],
    default: ['positive', 'negative'],
    when: (answers) => answers.filterSpectrumData,
    validate: (input) => {
      // No selection?
      if (input.length === 0) {
        return 'Requires at least one polarity';
      }

      return true;
    },
  },
  {
    name: 'spectrumArrayTarget',
    message: 'Filter spectrum array for a target list of m/z values',
    type: 'confirm',
    default: false,
    when: (answers) => answers.filterSpectrumData,
  },
  {
    name: 'targetFile',
    message: 'TSV target file path (local or remote URL)',
    type: 'input',
    when: (answers) => answers.spectrumArrayTarget,
    validate: (input) => {
      // Undefined?
      if (!input || input.trim() === '') {
        return 'Requires a local path or remote URL';
      }

      // Does not match TSV file patterns?
      const localPattern = /\.tsv$/i;
      const urlPattern = /^(?:http|https):\/\/[^ "]+&output=tsv$/;

      if (!localPattern.test(input) && !urlPattern.test(input)) {
        return 'Does not match TSV file patterns';
      }

      // Local path?
      if (localPattern.test(input)) {
        // Does not exist?
        if (!existsSync(input)) {
          return 'Does not exist';
        }

        // Not a file?
        if (!statSync(input).isFile()) {
          return 'Not a file';
        }
      }

      return true;
    },
  },
  {
    name: 'targetTolerance',
    message: 'Accepted m/z and ppm tolerance (mz=? ppm=?)',
    type: 'input',
    default: 'mz=0.005 ppm=5',
    when: (answers) => answers.spectrumArrayTarget,
    validate: (input) => {
      input = [...new Set(String(input).toLowerCase().split(/\s+/))];

      // Invalid length?
      if (input.length > 2) {
        return 'Requires only two values: mz=? ppm=?';
      }

      // Valid length?
      if (input.length === 1) {
        // Missing key?
        if (!(input[0].includes('mz=') || input[0].includes('ppm='))) {
          return `Tolerance not defined: mz=${input[0]}? or ppm=${input[0]}?`;
        }

        // Missing value?
        input = input[0].includes('mz=')
          ? [input[0], 'ppm=5']
          : ['mz=0.005', input[0]];
      }

      if (input.length === 2) {
        // Missing keys?
        input[0] = isNaN(Number(input[0])) ? input[0] : `mz=${input[0]}`;
        input[1] = isNaN(Number(input[1])) ? input[1] : `ppm=${input[1]}`;

        if (!input.some((tolerance) => tolerance.includes('mz='))) {
          return 'Missing tolerance value: mz=?';
        }

        if (!input.some((tolerance) => tolerance.includes('ppm='))) {
          return 'Missing tolerance value: ppm=?';
        }

        // Incorrect position?
        if (input[0].includes('ppm=') && input[1].includes('mz=')) {
          input = [input[1], input[0]];
        }

        // Invalid values?
        input = [input[0].split('mz=')[1], input[1].split('ppm=')[1]].map(
          Number,
        );

        if (isNaN(input[0])) {
          return `mz=${input[0]}: Requires a numeric value`;
        }

        if (isNaN(input[1])) {
          return `ppm=${input[1]}: Requires a numeric value`;
        }
      }

      return true;
    },
  },
  {
    name: 'spectrumArrayRange',
    message: 'Filter spectrum array for a range of m/z values',
    type: 'confirm',
    default: false,
    when: (answers) =>
      answers.filterSpectrumData && !answers.spectrumArrayTarget,
  },
  {
    name: 'mzRange',
    message: 'Range of m/z values to filter for (min=? max=?)',
    type: 'input',
    default: 'min=0 max=NaN',
    when: (answers) => answers.spectrumArrayRange,
    validate: (input) => {
      input = [...new Set(String(input).toLowerCase().split(/\s+/))];

      // Invalid length?
      if (input.length > 2) {
        return 'Requires only two values: min=? max=?';
      }

      // Valid length?
      if (input.length === 1) {
        // Missing key?
        if (!(input[0].includes('min=') || input[0].includes('max='))) {
          return `Range not defined: min=${input[0]}? or max=${input[0]}?`;
        }

        // Missing value?
        input = input[0].includes('min=')
          ? [input[0], 'max=NaN']
          : ['min=0', input[0]];
      }

      if (input.length === 2) {
        // Missing keys?
        input[0] = isNaN(Number(input[0])) ? input[0] : `min=${input[0]}`;
        input[1] = isNaN(Number(input[1])) ? input[1] : `max=${input[1]}`;

        if (!input.some((range) => range.includes('min='))) {
          return 'Missing range value: min=?';
        }

        if (!input.some((range) => range.includes('ppm='))) {
          return 'Missing range value: max=?';
        }

        // Incorrect position?
        if (input[0].includes('max=') && input[1].includes('min=')) {
          input = [input[1], input[0]];
        }

        // Invalid values?
        input = [input[0].split('min=')[1], input[1].split('max=')[1]].map(
          Number,
        );

        if (isNaN(input[0]) || input[0] < 0) {
          return `min=${input[0]}: Requires a numeric value greater than or equal to zero (>=0)`;
        }

        if (!isNaN(input[1]) && input[1] <= input[0]) {
          return `max=${input[1]}: Requires NaN or a numeric value greater than ${input[0]}`;
        }
      }

      return true;
    },
  },
];

/**
 * User response from Inquirer.
 * @returns {Promise<configuration>} User configuration
 */
export async function inquirerResponse() {
  /** @type {configuration} */
  const response = await inquirer.prompt(questions);

  // Format response
  response.precision = Number(response.precision);

  if (response.msLevel) {
    response.msLevel = [
      ...new Set(String(response.msLevel).split(/\s+/).map(Number)),
    ];
  }

  if (response.targetTolerance) {
    let input = [
      ...new Set(String(response.targetTolerance).toLowerCase().split(/\s+/)),
    ];

    if (input.length === 1) {
      input = input[0].includes('mz=')
        ? [input[0], 'ppm=5']
        : ['mz=0.005', input[0]];
    }

    if (input.length === 2) {
      input[0] = isNaN(Number(input[0])) ? input[0] : `mz=${input[0]}`;
      input[1] = isNaN(Number(input[1])) ? input[1] : `ppm=${input[1]}`;

      if (input[0].includes('ppm=') && input[1].includes('mz=')) {
        input = [input[1], input[0]];
      }

      // @ts-ignore
      response.targetTolerance = [
        input[0].split('mz=')[1],
        input[1].split('ppm=')[1],
      ].map(Number);
    }
  }

  if (response.mzRange) {
    let input = [
      ...new Set(String(response.mzRange).toLowerCase().split(/\s+/)),
    ];

    if (input.length === 1) {
      input = input[0].includes('min=')
        ? [input[0], 'max=NaN']
        : ['min=0', input[0]];
    }

    if (input.length === 2) {
      input[0] = isNaN(Number(input[0])) ? input[0] : `min=${input[0]}`;
      input[1] = isNaN(Number(input[1])) ? input[1] : `max=${input[1]}`;

      if (input[0].includes('max=') && input[1].includes('min=')) {
        input = [input[1], input[0]];
      }

      // @ts-ignore
      response.mzRange = [
        input[0].split('min=')[1],
        input[1].split('max=')[1],
      ].map(Number);
    }
  }

  return response;
}
