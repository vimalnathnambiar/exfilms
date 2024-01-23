#!/usr/bin/env node

// @ts-nocheck
/* eslint-disable no-console */
/* eslint-disable func-names */

import { existsSync, mkdirSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

import chalk from 'chalk';
import clear from 'clear';
import figlet from 'figlet';
import inquirer from 'inquirer';
import ora from 'ora';

import { prompts } from '../src/inquirerPrompts.js';
import { parseMZML } from '../src/parseMZML.js';
import { parseTargetFile } from '../src/parseTargetFile.js';
import { roundDecimalPlace } from '../src/roundDecimalPlace.js';
import { setDefaults } from '../src/setDefaults.js';
import { writeLog } from '../src/writeLog.js';
import { argv } from '../src/yargsConfig.js';

const pkg = JSON.parse(
  readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), '..', 'package.json'),
    'utf-8',
  ),
);
const spinner = ora();
let configParam = {};

figlet('ExfilMS', async function (err, data) {
  if (err) {
    console.error(`${err.toString()}`);
  }

  try {
    clear();
    console.log(
      `${chalk.bold.yellowBright(data)}\n${chalk.grey(
        `Version ${pkg.version} ${pkg.author}\n${pkg.description}\n`,
      )}`,
    );

    // Initialise parameters
    if (argv.interactive) {
      configParam = await inquirer.prompt(prompts);
      if (configParam.msLevel) {
        configParam.msLevel = configParam.msLevel.split(' ').map(Number);
      }
      console.log('');
    } else if (!argv.inputDir) {
      throw new Error(
        '\n--inputDir (or -i) "/path/to/input/directory/" required',
      );
    } else if (argv.targetedAssay && argv.mzRange) {
      throw new Error(
        '\nUse one of the following options for m/z value range filtering:\n--targetedAssay (or -t) --targetFile "/path/or/URL/to/target/file.tsv" --mzTolerance <number> --ppm <number>\n--mzRange (or -r) --minMZ <number> --maxMZ <number>',
      );
    } else if (argv.targetedAssay && !argv.targetFile) {
      throw new Error('\n--targetFile "/path/to/target/file.tsv" required');
    } else if (
      !argv.targetedAssay &&
      (argv.targetFile || argv.mzTolerance !== 0.005 || argv.ppm !== 5)
    ) {
      throw new Error(
        '--targetedAssay (or -t) required to specify targetFile, mzTolerance or ppm',
      );
    } else if (!argv.mzRange && (argv.minMZ || argv.maxMZ)) {
      throw new Error('\n--mzRange required to specify minMZ or maxMZ');
    } else if (!isNaN(argv.maxMZ) && argv.maxMZ <= argv.minMZ) {
      throw new Error('\nmaxMZ needs to be greater than minMZ');
    } else if (
      !argv.filterSpectrum &&
      (argv.spectrumType.length !== 2 ||
        (argv.msLevel.length !== 2 &&
          argv.msLevel[0] !== 1 &&
          argv.msLevel[1] !== 2) ||
        argv.polarity.length !== 2 ||
        argv.excludeMzData)
    ) {
      throw new Error(
        '\n--filterSpectrum (or -f) required to specify spectrumType, msLevel, polarity or excludeMzData',
      );
    } else {
      configParam = await setDefaults(argv);
    }

    configParam.decimalPlace = Number(configParam.decimalPlace);
    if (configParam.targetedAssay) {
      const targetFile = await parseTargetFile();
      configParam.mzTargetList = targetFile.mzTargetList;
      configParam.minMZ = targetFile.minMZ;
      configParam.maxMZ = targetFile.maxMZ;
      configParam.mzTolerance = Number(configParam.mzTolerance);
      configParam.ppm = Number(configParam.ppm);
    }

    if (configParam.mzRange) {
      configParam.minMZ = Number(configParam.minMZ);
      configParam.maxMZ = Number(configParam.maxMZ);

      if (!isNaN(configParam.decimalPlace)) {
        configParam.minMZ = await roundDecimalPlace(
          configParam.minMZ,
          configParam.decimalPlace,
        );
        if (!isNaN(configParam.maxMZ)) {
          configParam.maxMZ = await roundDecimalPlace(
            configParam.maxMZ,
            configParam.decimalPlace,
          );
        }
      }
    }

    // Create output and log directory
    if (!existsSync(configParam.outputDir)) {
      mkdirSync(configParam.outputDir, { recursive: true });
    }
    if (!existsSync(configParam.logDir)) {
      mkdirSync(configParam.logDir, { recursive: true });
    }

    console.log('Parameters:');
    console.log(configParam);

    // Write parameters into log file
    await writeLog(`Parameters\n${JSON.stringify(configParam, null, '\t')}\n`);

    // Parse mzML data files for extraction
    await parseMZML();
  } catch (err) {
    console.error(`\n${err.toString()}\n`);
  } finally {
    console.log('exfilMS process complete');
  }
});

export { spinner, pkg, configParam };