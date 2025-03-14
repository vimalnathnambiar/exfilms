import { basename, dirname, join } from 'node:path';

import { execa } from 'execa';

/**
 * Convert MS data file into mzML using msConvert by ProteoWizard.
 * @param {string} file File path
 * @param {string} outputDirectory Output directory path
 * @returns {Promise<void>}
 */
export async function msconvert(file, outputDirectory) {
  await execa('docker', [
    'run',
    '--rm',
    '-v',
    `${dirname(file)}:/inputDirectory`,
    '-v',
    `${outputDirectory}:/outputDirectory`,
    'proteowizard/pwiz-skyline-i-agree-to-the-vendor-licenses:latest',
    'wine',
    'msconvert',
    join('/inputDirectory', basename(file)),
    '-o',
    '/outputDirectory',
    '--zlib=off',
  ]);
}

/**
 * Delete file created by a Docker container.
 * @param {string} file File path
 * @returns {Promise<void>}
 */
export async function deleteDockerFile(file) {
  await execa('docker', [
    'run',
    '--rm',
    '-v',
    `${dirname(file)}:/directory`,
    'alpine:latest',
    'rm',
    '-rf',
    join('/directory', basename(file)),
  ]);
}
