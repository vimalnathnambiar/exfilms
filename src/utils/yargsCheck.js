/**
 * @typedef {import('../typedef/index.mjs').Yargs} Yargs
 */

import { setYargsConfig } from './setYargsConfig.js';

/**
 * Check if Yargs command line arguments (CLI mode) are used appropriately.
 * @param {Yargs} argv Yargs command line arguments.
 * @returns {Promise<Object>} A promise that resolves with the configuration parameters when all checks have been completed and the parameters are set appropriately.
 * @throws {Error} Throws error if yargsCheck() encounters issues in its process.
 */
export async function yargsCheck(argv) {
  // Check yargs command line arguments
  if (!argv.inputDirectory) {
    // If inputDirectory is not defined
    throw new Error(
      '-i (or --inputDirectory) "/path/to/input/directory/" required',
    );
  } else if (argv.targeted && argv.mzRange) {
    // If both targeted and mzRange is defined
    throw new Error(
      'Use one of the following options for spectra filtering:\n-t (or --targeted) --targetFile "/local/path/or/published/to/web/URL/to/target/tsv/file" --mzTolerance <number> --ppmTolerance <number>\n\nor\n\n-r (or --mzRange) --minMZ <number> --maxMZ <number>',
    );
  } else if (argv.targeted && !argv.targetFile) {
    // If targeted is defined but targetFile is not defined
    throw new Error('--targetFile "/path/to/target/file.tsv" required');
  } else if (
    !argv.targeted &&
    (argv.targetFile || argv.mzTolerance !== 0.005 || argv.ppmTolerance !== 5)
  ) {
    // If targetFile, mzTolerance and ppmTolerance defined (not default values) without targeted
    throw new Error(
      '-t (or --targeted) required to specify --targetFile, --mzTolerance and --ppmTolerance',
    );
  } else if (!argv.mzRange && (argv.minMZ !== 0 || argv.maxMZ)) {
    // If minMZ and maxMZ defined (not default values) without mzRange
    throw new Error(
      '-r (or --mzRange) required to specify --minMZ and --maxMZ',
    );
  } else if (!isNaN(argv.maxMZ) && argv.maxMZ <= argv.minMZ) {
    // If maxMZ defined (not default value) is smaller than minMZ
    throw new Error('maxMZ value needs to be greater than minMZ value');
  } else if (
    !argv.filterSpectrum &&
    (argv.spectrumType.length !== 2 ||
      !(
        argv.msLevel.length === 2 &&
        argv.msLevel[0] === 1 &&
        argv.msLevel[1] === 2
      ) ||
      argv.spectrumPolarity.length !== 2 ||
      argv.excludeSpectra)
  ) {
    // If spectrumType, msLevel, spectrumPolarity and excludeSpectra defined (not default values) without filterSpectrum
    throw new Error(
      '-s (or --filterSpectrum) required to specify --spectrumType, --msLevel, --spectrumPolarity and --excludeSpectra',
    );
  }

  // Set up configuration parameters received via Yargs appropriately
  return await setYargsConfig(argv);
}
