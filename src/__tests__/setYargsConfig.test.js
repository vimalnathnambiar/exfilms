// @ts-nocheck

/**
 * @typedef {import('../typedef/index.mjs').Yargs} Yargs
 */

import { existsSync, mkdirSync, rmSync, writeFileSync } from 'fs';
import { homedir } from 'os';
import { join, basename } from 'path';

import { describe, test, expect, beforeAll, afterAll } from 'vitest';

import { setYargsConfig } from '../utils/setYargsConfig.js';

/**
 * To test setYargsConfig()
 * Input: argv (Yargs)
 * Output: configParam (Object) || Error message (Error)
 */
describe('setYargsConfig', () => {
  // Dummy data
  /**
   * @type {Yargs}
   */
  const testArgv = {
    interactive: false,
    inputDirectory: './.tmp/setYargsConfig/inputDirectory/',
    fileList: ['*'],
    outputFormat: ['JSON'],
    outputDirectory: join(
      homedir(),
      '/exfilms/outputFormat/inputDirectoryName/',
    ),
    logDirectory: './.tmp/setYargsConfig/logDirectory/',
    decimalPlace: NaN,
    targeted: false,
    targetFile: './.tmp/setYargsConfig/targetFile.tsv',
    mzTolerance: 0.005,
    ppmTolerance: 5,
    mzRange: false,
    minMZ: 0,
    maxMZ: NaN,
    filterSpectrum: false,
    spectrumType: ['profile', 'centroid'],
    msLevel: [1, 2],
    spectrumPolarity: ['positive', 'negative'],
    excludeSpectra: false,
  };
  const testFile1 = join(testArgv.inputDirectory, 'testFile1.mzML');
  const testFile2 = join(testArgv.inputDirectory, 'testFile2.mzML');

  // Setting up test environment before tests
  beforeAll(() => {
    if (!existsSync(testArgv.inputDirectory)) {
      mkdirSync(testArgv.inputDirectory, { recursive: true });
    }
    writeFileSync(testFile1, 'Test file 1');
    writeFileSync(testFile2, 'Test file 2');
  });

  // Tests
  test('return configParam: using default values', async () => {
    const configParam = await setYargsConfig(testArgv);
    expect(configParam.inputDirectory).toStrictEqual(testArgv.inputDirectory);
    expect(configParam.fileList).toStrictEqual([
      'testFile1.mzML',
      'testFile2.mzML',
    ]);
    expect(configParam.outputFormat).toStrictEqual(testArgv.outputFormat[0]);
    expect(configParam.outputDirectory).toStrictEqual(
      join(
        homedir(),
        `/exfilms/${testArgv.outputFormat[0]}/${basename(
          testArgv.inputDirectory,
        )}/`,
      ),
    );
    expect(configParam.logDirectory).toStrictEqual(testArgv.logDirectory);
    expect(configParam.decimalPlace).toStrictEqual(testArgv.decimalPlace);
    expect(configParam.targeted).toStrictEqual(testArgv.targeted);
    expect(configParam).not.toHaveProperty('targetFile');
    expect(configParam).not.toHaveProperty('mzTolerance');
    expect(configParam).not.toHaveProperty('ppmTolerance');
    expect(configParam.mzRange).toStrictEqual(testArgv.mzRange);
    expect(configParam).not.toHaveProperty('minMZ');
    expect(configParam).not.toHaveProperty('maxMZ');
    expect(configParam.filterSpectrum).toStrictEqual(testArgv.filterSpectrum);
    expect(configParam).not.toHaveProperty('spectrumType');
    expect(configParam).not.toHaveProperty('msLevel');
    expect(configParam).not.toHaveProperty('spectrumPolarity');
    expect(configParam).not.toHaveProperty('excludeSpectra');
  });

  test('return configParam: using defined values', async () => {
    testArgv.fileList = ['testFile1.mzML'];
    testArgv.outputDirectory = './.tmp/setYargsConfig/outputDirectory/';
    testArgv.targeted = true;
    testArgv.mzRange = true;
    testArgv.filterSpectrum = true;
    const configParam = await setYargsConfig(testArgv);
    expect(configParam.fileList).toStrictEqual(testArgv.fileList);
    expect(configParam.outputDirectory).toStrictEqual(testArgv.outputDirectory);
    expect(configParam.targetFile).toStrictEqual(testArgv.targetFile);
    expect(configParam.mzTolerance).toStrictEqual(testArgv.mzTolerance);
    expect(configParam.ppmTolerance).toStrictEqual(testArgv.ppmTolerance);
    expect(configParam.minMZ).toStrictEqual(testArgv.minMZ);
    expect(configParam.maxMZ).toStrictEqual(testArgv.maxMZ);
    expect(configParam.spectrumType).toStrictEqual(testArgv.spectrumType);
    expect(configParam.msLevel).toStrictEqual(testArgv.msLevel);
    expect(configParam.spectrumPolarity).toStrictEqual(
      testArgv.spectrumPolarity,
    );
    expect(configParam.excludeSpectra).toStrictEqual(testArgv.excludeSpectra);
  });

  test('throw error: listMZML() input type check', async () => {
    testArgv.inputDirectory = 0;
    testArgv.fileList = ['*'];
    await expect(setYargsConfig(testArgv)).rejects.toThrowError(
      'listMZML(): directory must be of type string',
    );
  });

  // Clean up test environment after tests
  afterAll(() => {
    rmSync('./.tmp/setYargsConfig/', { recursive: true });
  });
});
