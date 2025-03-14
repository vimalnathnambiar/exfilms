/** @typedef {import('../../types/configuration.mjs').configuration} configuration */

import { existsSync, statSync } from 'node:fs';
import { homedir } from 'node:os';
import { basename, join } from 'node:path';

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { roundValue } from './calculator.js';
import { createOutputPath, getDataFileList } from './fsManager.js';
import { inquirerResponse } from './inquirerParser.js';
import { readPackage, readTargetFile } from './reader.js';
import { writeTXT } from './writer.js';

/**
 * Yargs.
 */
const defaultError = 'Invalid values:\n  ';
let inputDirectory, filterSpectrumData, spectrumArrayTarget, spectrumArrayRange;

/** @type {configuration} */
// @ts-ignore
let response = yargs(hideBin(process.argv))
  .usage('Usage: exfilms <options> <suboptions>')
  .alias('help', 'h')
  .alias('version', 'v')
  .option('interactive', {
    alias: 'x',
    description: 'Run in interactive mode',
    type: 'boolean',
    default: false,
  })
  .option('input-directory', {
    alias: 'i',
    description: 'Set input directory path',
    type: 'string',
    coerce: (input) => {
      const error = defaultError.concat(
        'Argument: input-directory, ',
        `Given: "${input}", `,
      );

      // Undefined?
      if (!input || input.trim() === '') {
        throw new Error(error.concat('Requires a path'));
      }

      // Does not exist?
      if (!existsSync(input)) {
        throw new Error(error.concat('Does not exist'));
      }

      // Not a directory?
      if (!statSync(input).isDirectory()) {
        throw new Error(error.concat('Not a directory'));
      }

      // No data files?
      if (getDataFileList(input).length === 0) {
        throw new Error(error.concat('No MS data files'));
      }

      return (inputDirectory = input);
    },
  })
  .option('file-list', {
    description: 'MS data files to extract from (space-separated)',
    type: 'array',
    default: 'all',
    coerce: (input) => {
      if (inputDirectory) {
        const error = defaultError.concat(
          'Argument: file-list, ',
          `Given: [${input}], `,
        );

        input = [...new Set(input.map((file) => String(file).toLowerCase()))];
        const fileList = getDataFileList(inputDirectory);

        // Default value?
        if (input.length === 1 && input[0] === 'all') {
          return fileList;
        }

        // Invalid data files?
        const invalidFiles = input.filter(
          (file) => !fileList.map((list) => list.toLowerCase()).includes(file),
        );

        if (invalidFiles.length > 0) {
          throw new Error(
            error.concat(
              `Non-existing and/or unsupported data files: [${invalidFiles}]`,
            ),
          );
        }

        return input.map((file) =>
          fileList.find((list) => list.toLowerCase() === file),
        );
      }
    },
  })
  .option('output-directory', {
    alias: 'o',
    description: 'Set output directory path',
    type: 'string',
    default: join(homedir(), 'exfilms', 'input directory name'),
    coerce: (input) => {
      const error = defaultError.concat(
        'Argument: output-directory, ',
        `Given: "${input}", `,
      );

      // Undefined?
      if (!input || input.trim() === '') {
        throw new Error(error.concat('Requires a path'));
      }

      return input;
    },
  })
  .option('output-format', {
    alias: 'f',
    description: 'Set output format',
    type: 'string',
    choices: ['JSON'],
    default: 'JSON',
    coerce: (input) => {
      return input.toUpperCase();
    },
  })
  .option('precision', {
    alias: 'p',
    description: 'Set number of decimal places to round precision values to',
    type: 'number',
    default: 'original=NaN',
    coerce: (input) => {
      const error = defaultError.concat(
        'Argument: precision, ',
        `Given: ${input}, `,
      );

      input = Number(input);

      // Invalid value?
      if (!isNaN(input) && input < 0) {
        throw new Error(
          error.concat(
            'Requires NaN or a numeric value greater than or equal to zero (>=0)',
          ),
        );
      }

      return input;
    },
  })
  .option('metadata', {
    alias: 'm',
    description: 'Exclude spectrum array',
    type: 'boolean',
    default: false,
  })
  .option('filter-spectrum-data', {
    alias: 's',
    description: 'Filter spectrum data',
    type: 'boolean',
    default: false,
    coerce: (input) => {
      return (filterSpectrumData = input);
    },
  })
  .option('ms-level', {
    description: 'Set MS level to filter for (space-separated)',
    type: 'array',
    default: 'all=NaN',
    coerce: (input) => {
      if (filterSpectrumData) {
        const error = defaultError.concat(
          'Argument: ms-level, ',
          `Given: [${input}], `,
        );

        input = [...new Set(input.map(Number))];

        // Default value?
        if (input.length === 1 && isNaN(input[0])) {
          return input;
        }

        // Invalid values?
        if (input.some((level) => isNaN(level) || level < 1)) {
          throw new Error(
            error.concat(
              'Requires NaN or numeric values greater than zero (>0)',
            ),
          );
        }

        return input;
      }
    },
  })
  .option('spectrum-type', {
    description: 'Set spectrum type to filter for (space-separated)',
    type: 'array',
    choices: ['profile', 'centroid'],
    default: ['profile', 'centroid'],
    coerce: (input) => {
      if (filterSpectrumData) {
        return [...new Set(input.map((type) => String(type).toLowerCase()))];
      }
    },
  })
  .option('spectrum-polarity', {
    description: 'Set spectrum polarity to filter for (space-separated)',
    type: 'array',
    choices: ['positive', 'negative'],
    default: ['positive', 'negative'],
    coerce: (input) => {
      if (filterSpectrumData) {
        return [
          ...new Set(input.map((polarity) => String(polarity).toLowerCase())),
        ];
      }
    },
  })
  .option('spectrum-array-target', {
    description: 'Filter spectrum array for a target list of m/z values',
    type: 'boolean',
    default: false,
    coerce: (input) => {
      if (filterSpectrumData) {
        return (spectrumArrayTarget = input);
      }
    },
  })
  .option('target-file', {
    description: 'Set TSV target file path (local or remote URL)',
    type: 'string',
    default: '',
    coerce: (input) => {
      if (spectrumArrayTarget) {
        const error = defaultError.concat(
          'Argument: target-file, ',
          `Given: "${input}", `,
        );

        // Undefined?
        if (!input || input.trim() === '') {
          throw new Error(error.concat('Requires a local path or remote URL'));
        }

        // Does not match TSV file patterns?
        const localPattern = /\.tsv$/i;
        const urlPattern = /^(?:http|https):\/\/[^ "]+&output=tsv$/;

        if (!localPattern.test(input) && !urlPattern.test(input)) {
          throw new Error(error.concat('Does not match TSV file patterns'));
        }

        // Local path?
        if (localPattern.test(input)) {
          // Does not exist?
          if (!existsSync(input)) {
            throw new Error(error.concat('Does not exist'));
          }

          // Not a file?
          if (!statSync(input).isFile()) {
            throw new Error(error.concat('Not a file'));
          }
        }

        return input;
      }
    },
  })
  .option('target-tolerance', {
    description: 'Set accepted m/z and ppm tolerance (mz=? ppm=?)',
    type: 'array',
    default: ['mz=0.005', 'ppm=5'],
    coerce: (input) => {
      if (spectrumArrayTarget) {
        const error = defaultError.concat(
          'Argument: target-tolerance, ',
          `Given: [${input}], `,
        );

        input = [
          ...new Set(input.map((tolerance) => String(tolerance).toLowerCase())),
        ];

        // Invalid length?
        if (input.length > 2) {
          throw new Error(error.concat('Requires only two values: mz=? ppm=?'));
        }

        // Valid length?
        if (input.length === 1) {
          // Missing key?
          if (!(input[0].includes('mz=') || input[0].includes('ppm='))) {
            throw new Error(
              error.concat(
                `Tolerance not defined: mz=${input[0]}? or ppm=${input[0]}?`,
              ),
            );
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
            throw new Error(error.concat('Missing tolerance value: mz=?'));
          }

          if (!input.some((tolerance) => tolerance.includes('ppm='))) {
            throw new Error(error.concat('Missing tolerance value: ppm=?'));
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
            throw new Error(
              error.concat(`mz=${input[0]}: Requires a numeric value`),
            );
          }

          if (isNaN(input[1])) {
            throw new Error(
              error.concat(`ppm=${input[1]}: Requires a numeric value`),
            );
          }
        }

        return input;
      }
    },
  })
  .option('spectrum-array-range', {
    description: 'Filter spectrum array for a range of m/z values',
    type: 'boolean',
    default: false,
    coerce: (input) => {
      if (filterSpectrumData && !spectrumArrayTarget) {
        return (spectrumArrayRange = input);
      }
    },
  })
  .option('mz-range', {
    description: 'Set range of m/z values to filter for (min=? max=?)',
    type: 'array',
    default: ['min=0', 'max=NaN'],
    coerce: (input) => {
      if (spectrumArrayRange) {
        const error = defaultError.concat(
          'Argument: mz-range, ',
          `Given: [${input}], `,
        );

        input = [...new Set(input.map((range) => String(range).toLowerCase()))];

        // Invalid length?
        if (input.length > 2) {
          throw new Error(
            error.concat('Requires only two values: min=? max=?'),
          );
        }

        // Valid length?
        if (input.length === 1) {
          // Missing key?
          if (!(input[0].includes('min=') || input[0].includes('max='))) {
            throw new Error(
              error.concat(
                `Range not defined: min=${input[0]}? or max=${input[0]}?`,
              ),
            );
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
            throw new Error(error.concat('Missing range value: min=?'));
          }

          if (!input.some((range) => range.includes('max='))) {
            throw new Error(error.concat('Missing range value: max=?'));
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
            throw new Error(
              error.concat(
                `min=${input[0]}: Requires a numeric value greater than or equal to zero (>=0)`,
              ),
            );
          }

          if (!isNaN(input[1]) && input[1] <= input[0]) {
            throw new Error(
              error.concat(
                `max=${input[1]}: Requires NaN or a numeric value greater than ${input[0]}`,
              ),
            );
          }
        }

        return input;
      }
    },
  })
  .example('exfilms -x', 'Run in interactive mode')
  .example(
    'exfilms -i "input directory path"',
    'Run with default configuration',
  )
  .example(
    'exfilms -i "input directory path" -s --ms-level 1 --spectrum-type centroid --spectrum-polarity positive',
    'Filter for centroided MS level 1 spectrum data with positive polarity',
  )
  .example(
    'exfilms -i "input directory path" -s --spectrum-array-target --target-file "example.tsv" --target-tolerance mz=0.005 ppm=5',
    'Filter the spectrum array for a target list of m/z values with a tolerance of 0.005 m/z and 5 ppm',
  )
  .example(
    'exfilms -i "input directory path" -s --spectrum-array-range --mz-range min=230 max=510',
    'Filter the spectrum array for m/z values ranging from 230 m/z to 510 m/z',
  )
  .epilogue(
    `If you encounter any issues, please report them here:\n${readPackage(
      'bugs',
    )}\n`,
  )
  .epilogue(`For more information:\n${readPackage('homepage')}`)
  .parse();

/**
 * User response from Yargs.
 * @returns {Promise<configuration>} User configuration
 */
export async function yargsResponse() {
  // Running interactive mode?
  // @ts-ignore
  if (response.interactive) {
    response = await inquirerResponse();
  } else {
    // Validate response
    if (!response.inputDirectory || response.inputDirectory.trim() === '') {
      throw new Error(
        defaultError.concat(
          'Argument: input-directory, ',
          `Given: ${response.inputDirectory}, `,
          'Requires a path',
        ),
      );
    }

    // Format response
    response = (({
      inputDirectory,
      fileList,
      outputDirectory,
      outputFormat,
      logFile,
      precision,
      metadata,
      filterSpectrumData,
      msLevel,
      spectrumType,
      spectrumPolarity,
      spectrumArrayTarget,
      targetFile,
      targetTolerance,
      targetList,
      spectrumArrayRange,
      mzRange,
    }) => ({
      inputDirectory,
      fileList,
      outputDirectory,
      outputFormat,
      logFile,
      precision,
      metadata,
      filterSpectrumData,
      msLevel,
      spectrumType,
      spectrumPolarity,
      spectrumArrayTarget,
      targetFile,
      targetTolerance,
      targetList,
      spectrumArrayRange,
      mzRange,
    }))(response);

    if (
      response.outputDirectory ===
      join(homedir(), 'exfilms', 'input directory name')
    ) {
      response.outputDirectory = join(
        homedir(),
        'exfilms',
        basename(response.inputDirectory),
      );
    }
  }

  // Extract target list?
  if (response.targetFile) {
    response.targetList = await readTargetFile(
      response.targetFile,
      // @ts-ignore
      response.msLevel,
      response.spectrumPolarity,
      response.precision,
    );
  }

  // Format m/z range?
  if (response.mzRange && !isNaN(response.precision)) {
    response.mzRange[0] = roundValue(response.mzRange[0], response.precision);
    if (!isNaN(response.mzRange[1])) {
      response.mzRange[1] = roundValue(response.mzRange[1], response.precision);
    }
  }

  // Create output directory and log file path
  response.logFile = createOutputPath(response.outputDirectory);

  // Write log
  writeTXT(
    response.logFile,
    `Configuration: ${JSON.stringify(response, null, '\t')}\n\n`,
  );

  return response;
}
