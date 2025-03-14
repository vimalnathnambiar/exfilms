/** @typedef {import('../types/configuration.mjs').configuration} configuration */

import { existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';

import { afterAll, afterEach, describe, expect, test } from 'vitest';

import { processFileList } from '../src/utils/extractor.js';
import { createOutputPath, getDataFileList } from '../src/utils/fsManager.js';
import { readPackage, readTargetFile } from '../src/utils/reader.js';

describe('Integration Test', () => {
  /**@type {configuration} */
  let configuration = {
    inputDirectory: join(import.meta.dirname, '..', 'resources', 'data'),
    fileList: [],
    outputDirectory: join('.', '.vitest'),
    outputFormat: 'JSON',
    logFile: '',
    precision: NaN,
    metadata: false,
    filterSpectrumData: false,
    msLevel: [NaN],
    spectrumType: ['profile', 'centroid'],
    spectrumPolarity: ['positive', 'negative'],
    spectrumArrayTarget: undefined,
    targetFile: join(
      import.meta.dirname,
      '..',
      'resources',
      'target-files',
      'HCOONa.tsv',
    ),
    targetTolerance: [0.005, 5],
    targetList: undefined,
    spectrumArrayRange: undefined,
    mzRange: [0, NaN],
  };

  test('default', async () => {
    readPackage('version');
    configuration.fileList = getDataFileList(configuration.inputDirectory);
    configuration.logFile = createOutputPath(configuration.outputDirectory);

    await processFileList(configuration);
  });

  test('precision and metadata', async () => {
    readPackage('version');
    configuration.fileList = getDataFileList(configuration.inputDirectory);
    configuration.logFile = createOutputPath(configuration.outputDirectory);
    configuration.precision = 4;
    configuration.metadata = true;

    await processFileList(configuration);
  });

  test('spectrum data filtering', async () => {
    readPackage('version');
    configuration.fileList = getDataFileList(configuration.inputDirectory);
    configuration.logFile = createOutputPath(configuration.outputDirectory);
    configuration.filterSpectrumData = true;

    await processFileList(configuration);
  });

  test('spectrum array target filtering', async () => {
    readPackage('version');
    configuration.fileList = getDataFileList(configuration.inputDirectory);
    configuration.logFile = createOutputPath(configuration.outputDirectory);
    configuration.spectrumArrayTarget = true;
    configuration.spectrumArrayRange = false;

    // Filter default MS level
    configuration.targetList = await readTargetFile(
      // @ts-ignore
      configuration.targetFile,
      configuration.msLevel,
      configuration.spectrumPolarity,
      configuration.precision,
    );

    await processFileList(configuration);

    // Filter specific MS level
    configuration.msLevel = [1];
    configuration.targetList = await readTargetFile(
      // @ts-ignore
      configuration.targetFile,
      configuration.msLevel,
      configuration.spectrumPolarity,
      configuration.precision,
    );

    await processFileList(configuration);
  });

  test('spectrum array range filtering', async () => {
    readPackage('version');
    configuration.fileList = getDataFileList(configuration.inputDirectory);
    configuration.logFile = createOutputPath(configuration.outputDirectory);
    configuration.spectrumArrayTarget = false;
    configuration.spectrumArrayRange = true;

    await processFileList(configuration);
  });

  afterEach(() => {
    if (existsSync(configuration.logFile)) {
      rmSync(configuration.logFile, { recursive: true });
    }
  });

  afterAll(() => {
    if (existsSync(configuration.outputDirectory)) {
      rmSync(configuration.outputDirectory, { recursive: true });
    }
  });
});
