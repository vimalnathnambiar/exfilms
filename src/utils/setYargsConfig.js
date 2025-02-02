// @ts-nocheck

/**
 * @typedef {import('../typedef/index.mjs').Yargs} Yargs
 */

import { homedir } from 'os';
import { join, basename } from 'path';

import { listMZML } from './listMZML.js';

/**
 * Set the configuration parameters received via Yargs appropriately for execution.
 * @param {Yargs} argv Yargs command line arguments (configuration parameters).
 * @returns {Promise<Object>} A promise that resolves with the configuration parameters set in the required format for execution.
 * @throws {Error} Throws error if setYargsConfig() encounters issues in its process.
 */
export async function setYargsConfig(argv) {
  const configParam = {};

  // General config
  configParam.inputDirectory = argv.inputDirectory;
  configParam.fileList =
    argv.fileList[0] === '*'
      ? await listMZML(argv.inputDirectory)
      : argv.fileList;
  configParam.outputFormat = argv.outputFormat[0];
  configParam.outputDirectory =
    argv.outputDirectory ===
    join(homedir(), '/exfilms/outputFormat/inputDirectoryName/')
      ? join(
          homedir(),
          `/exfilms/${configParam.outputFormat}/${basename(
            configParam.inputDirectory,
          )}/`,
        )
      : argv.outputDirectory;
  configParam.logDirectory = argv.logDirectory;
  configParam.decimalPlace = argv.decimalPlace;

  // Targeted m/z filtering config
  configParam.targeted = argv.targeted;
  if (configParam.targeted) {
    configParam.targetFile = argv.targetFile;
    configParam.mzTolerance = argv.mzTolerance;
    configParam.ppmTolerance = argv.ppmTolerance;
  }

  // m/z range filtering config
  configParam.mzRange = argv.mzRange;
  if (configParam.mzRange) {
    configParam.minMZ = argv.minMZ;
    configParam.maxMZ = argv.maxMZ;
  }

  // Spectrum data filtering config
  configParam.filterSpectrum = argv.filterSpectrum;
  if (configParam.filterSpectrum) {
    configParam.spectrumType = argv.spectrumType;
    configParam.msLevel = argv.msLevel;
    configParam.spectrumPolarity = argv.spectrumPolarity;
    configParam.excludeSpectra = argv.excludeSpectra;
  }

  return configParam;
}
