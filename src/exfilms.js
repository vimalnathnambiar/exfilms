#!/usr/bin/env node

import chalk from 'chalk';
import clear from 'clear';
import figlet from 'figlet';

import { processFileList } from './utils/extractor.js';
import { readPackage } from './utils/reader.js';
import { yargsResponse } from './utils/yargsParser.js';

/**
 * Entrypoint.
 */
figlet('ExfilMS', async (error, data) => {
  // Figlet error?
  if (error) {
    console.error(`${error.toString()}\n`);
  }

  try {
    // Display package information
    clear();
    console.log(
      chalk.bold.yellowBright(`${data}\n`),
      chalk.white(`Version ${readPackage('version')}\n`),
    );

    // User configuration
    const configuration = await yargsResponse();
    console.log('Configuration:', configuration, '\n');

    // Process MS data file list for extraction
    await processFileList(configuration);

    console.log('Complete!');
  } catch (error) {
    console.error(`${error.toString()}\n`);
  }
});
