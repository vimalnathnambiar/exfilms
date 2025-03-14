/** @typedef {import('../../../types/binary.mjs').param} param */
/** @typedef {import('../../../types/configuration.mjs').configuration} configuration */
/** @typedef {import('../../../types/ms.mjs').chromatogram} chromatogram */
/** @typedef {import('../../../types/ms.mjs').ms} ms */
/** @typedef {import('../../../types/ms.mjs').spectrum} spectrum */

import { mapBinaryData, mapData } from './dataMap.js';

/**
 * Initialise chromatogram data for extraction.
 * @param {ms} data MS data
 * @param {boolean | undefined} spectrumArrayTarget Filter spectrum array for a target list of m/z values
 * @param {[number, number, string][] | undefined} targetList Target list of m/z values to filter for
 * @returns {void}
 */
export function initialiseChromatogram(data, spectrumArrayTarget, targetList) {
  /** @type {chromatogram[]} */
  const chromatogram = [
    {
      index: 0,
      id: 'TIC',
      type: 'total ion chromatogram',
      polarity: null,
      dwellTime: null,
      precursor: {
        mz: null,
        chargeState: null,
        isolationWindow: { mz: null, lowerOffset: null, upperOffset: null },
      },
      collision: {
        type: null,
        energy: null,
      },
      product: {
        mz: null,
        isolationWindow: { mz: null, lowerOffset: null, upperOffset: null },
      },
      array: {
        length: 0,
        time: [],
        intensity: [],
        msLevel: [],
      },
    },
    {
      index: 1,
      id: 'BPC',
      type: 'base peak chromatogram',
      polarity: null,
      dwellTime: null,
      precursor: {
        mz: null,
        chargeState: null,
        isolationWindow: { mz: null, lowerOffset: null, upperOffset: null },
      },
      collision: {
        type: null,
        energy: null,
      },
      product: {
        mz: null,
        isolationWindow: { mz: null, lowerOffset: null, upperOffset: null },
      },
      array: {
        length: 0,
        time: [],
        intensity: [],
        msLevel: [],
      },
    },
  ];

  data.chromatogram = spectrumArrayTarget
    ? [
        ...chromatogram,
        // @ts-ignore
        ...targetList.map((target, index) => ({
          index: chromatogram.length + index,
          id: `SIC ${target[0]}`,
          type: 'selected ion chromatogram',
          polarity: null,
          dwellTime: null,
          precursor: {
            mz: target[0],
            chargeState: null,
            isolationWindow: {
              mz: target[0],
              lowerOffset: null,
              upperOffset: null,
            },
          },
          collision: {
            type: null,
            energy: null,
          },
          product: {
            mz: null,
            isolationWindow: { mz: null, lowerOffset: null, upperOffset: null },
          },
          array: {
            length: 0,
            time: [],
            intensity: [],
            msLevel: [],
          },
        })),
      ]
    : chromatogram;
}

/**
 * Extract chromatogram data.
 * @param {any[]} dataMap Parsed mzML chromatogram data map
 * @param {ms} data MS data
 * @param {configuration} configuration User configuration
 * @returns {void}
 */
export function extractChromatogram(dataMap, data, configuration) {
  if (dataMap) {
    if (!Array.isArray(dataMap)) {
      dataMap = [dataMap];
    }

    for (const chromatogramData of dataMap) {
      /** @type {chromatogram} */
      const chromatogram = {
        index: Number(chromatogramData.$index),
        id: String(chromatogramData.$id),
        type: null,
        polarity: null,
        dwellTime: null,
        precursor: {
          mz: null,
          chargeState: null,
          isolationWindow: { mz: null, lowerOffset: null, upperOffset: null },
        },
        collision: {
          type: null,
          energy: null,
        },
        product: {
          mz: null,
          isolationWindow: { mz: null, lowerOffset: null, upperOffset: null },
        },
        array: {
          length: Number(chromatogramData.$defaultArrayLength),
          time: [],
          intensity: [],
          msLevel: [],
        },
      };

      // Chromatogram properties
      mapData(chromatogramData.cvParam, chromatogram, configuration.precision);
      mapData(
        chromatogramData.userParam,
        chromatogram,
        configuration.precision,
      );

      // Precursor data
      mapData(
        chromatogramData.precursor?.isolationWindow?.cvParam,
        chromatogram.precursor,
        configuration.precision,
      );

      if (chromatogram.precursor.mz === null) {
        chromatogram.precursor.mz = chromatogram.precursor.isolationWindow.mz;
      }

      // Collision data
      mapData(
        chromatogramData.precursor?.activation?.cvParam,
        chromatogram,
        configuration.precision,
      );

      // Product data
      mapData(
        chromatogramData.product?.isolationWindow?.cvParam,
        chromatogram.product,
        configuration.precision,
      );

      if (chromatogram.product.mz === null) {
        chromatogram.product.mz = chromatogram.product.isolationWindow.mz;
      }

      // Binary data array
      mapBinaryData(
        chromatogramData.binaryDataArrayList?.binaryDataArray,
        chromatogram,
        configuration.precision,
      );

      data.chromatogram.push(chromatogram);
    }
  }
}

/**
 * Append chromatogram data.
 * @param {chromatogram[]} chromatogram Chromatogram data
 * @param {string} id Chromatogram ID
 * @param {number} msLevel MS level
 * @param {number} time Scan time point
 * @param {number} intensity Intensity value
 */
export function appendChromatogram(chromatogram, id, msLevel, time, intensity) {
  const idx = chromatogram.findIndex((chromatogram) => chromatogram.id === id);

  chromatogram[idx].array.length++;
  chromatogram[idx].array.msLevel.push(msLevel);
  chromatogram[idx].array.time.push(time);
  chromatogram[idx].array.intensity.push(intensity);
}
