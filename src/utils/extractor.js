/** @typedef {import('../../types/configuration.mjs').configuration} configuration */

import { readFileSync } from 'node:fs';
import { basename, extname, join } from 'node:path';

import { parse } from 'arraybuffer-xml-parser';
import ora from 'ora';

import { deleteDockerFile, msconvert } from './docker.js';
import { extractMS } from './extraction/ms.js';
import {
  createDirectory,
  deleteDirectory,
  getDataFileList,
} from './fsManager.js';
import { writeTXT } from './writer.js';

/**
 * Process MS data file list for extraction.
 * @param {configuration} configuration User configuration
 * @return {Promise<void>}
 */
export async function processFileList(configuration) {
  const pwizDirectory = join(configuration.inputDirectory, 'pwiz');
  const spinner = ora();
  const failedFiles = [];
  let log;

  console.log(`File count: ${configuration.fileList.length}`);
  for (const file of configuration.fileList) {
    log = `${new Date()}\t${file}`;
    let filePath = join(configuration.inputDirectory, file);

    // Display file counter
    const fileCounter = `File ${
      configuration.fileList.indexOf(file) + 1
    }: ${file} `;

    spinner.text = fileCounter;
    spinner.start();

    // Process file
    try {
      // Convert file?
      if (!(extname(file).toLowerCase() === '.mzml')) {
        spinner.text = fileCounter.concat('(converting data file)');
        createDirectory(pwizDirectory);
        await msconvert(filePath, pwizDirectory);

        // Original file = WIFF?
        if (extname(file).toLowerCase() === '.wiff') {
          const files = getDataFileList(pwizDirectory);

          // No converted files?
          if (files.length === 0) {
            throw new Error('No data files available for extraction');
          }

          // Add converted files to list
          const message = `${files.length} additional data files queued for extraction`;

          configuration.fileList.push(
            ...files.map((file) => join('pwiz', file)),
          );

          log = log.concat(`\n${message}\n`);
          spinner.succeed(fileCounter.concat(`\n  ${message}\n`));
          continue;
        }

        filePath = join(pwizDirectory, `${basename(file, extname(file))}.mzML`);
      }

      // Extract MS data
      spinner.text = fileCounter.concat('(extracting MS data)');
      extractMS(
        // @ts-ignore
        parse(readFileSync(filePath)).indexedmzML?.mzML,
        configuration,
        spinner,
        fileCounter,
      );

      spinner.succeed(fileCounter);
    } catch (error) {
      failedFiles.push(file);
      log = log.concat(`\n${error.toString()}\n`);
      spinner.fail(fileCounter.concat(`\n  ${error.toString()}\n`));
    } finally {
      // Converted file?
      if (filePath.startsWith(pwizDirectory)) {
        await deleteDockerFile(filePath);
      }

      // Write log
      writeTXT(configuration.logFile, `${log}\n`);
    }
  }

  // Write log
  log = `\nFailed extraction: [${failedFiles}]\n`;

  console.log(log);
  writeTXT(configuration.logFile, log);

  // Converted files?
  deleteDirectory(pwizDirectory);
}
