/** @typedef {import('../../../types/binary.mjs').param} param */
/** @typedef {import('../../../types/configuration.mjs').configuration} configuration */
/** @typedef {import('../../../types/ms.mjs').chromatogram} chromatogram */
/** @typedef {import('../../../types/ms.mjs').ms} ms */
/** @typedef {import('../../../types/ms.mjs').spectrum} spectrum */

import { appendChromatogram } from './chromatogram.js';
import { mapBinaryData, mapData } from './dataMap.js';

/**
 * Extract spectrum data.
 * @param {any} dataMap Parsed mzML spectrum data map
 * @param {ms} data MS data
 * @param {configuration} configuration User configuration
 * @returns {void}
 */
export function extractSpectrum(dataMap, data, configuration) {
  if (dataMap) {
    if (!Array.isArray(dataMap)) {
      dataMap = [dataMap];
    }

    for (const spectrumData of dataMap) {
      /** @type {spectrum} */
      const spectrum = {
        index: Number(spectrumData.$index),
        id: String(spectrumData.$id),
        msLevel: null,
        type: null,
        polarity: null,
        scan: {
          type: null,
          time: null,
          inverseReducedIonMobility: null,
          window: {
            lowerLimit: null,
            upperLimit: null,
          },
        },
        precursor: {
          mz: null,
          chargeState: null,
          isolationWindow: {
            mz: null,
            lowerOffset: null,
            upperOffset: null,
          },
        },
        collision: {
          type: null,
          energy: null,
        },
        totalIonCurrent: null,
        basePeak: {
          mz: null,
          intensity: null,
        },
        array: {
          length: Number(spectrumData.$defaultArrayLength),
          mz: [],
          intensity: [],
        },
      };

      // Spectrum properties
      mapData(spectrumData.cvParam, spectrum, configuration.precision);

      // Scan data
      mapData(
        spectrumData.scanList?.scan?.cvParam,
        spectrum,
        configuration.precision,
      );

      mapData(
        spectrumData.scanList?.scan?.scanWindowList?.scanWindow?.cvParam,
        spectrum,
        configuration.precision,
      );

      // Precursor data
      mapData(
        spectrumData.precursorList?.precursor?.isolationWindow?.cvParam,
        spectrum.precursor,
        configuration.precision,
      );

      mapData(
        spectrumData.precursorList?.precursor?.selectedIonList?.selectedIon
          ?.cvParam,
        spectrum,
        configuration.precision,
      );

      if (spectrum.precursor.mz === null) {
        spectrum.precursor.mz = spectrum.precursor.isolationWindow.mz;
      }

      // Collision data
      mapData(
        spectrumData.precursorList?.precursor?.activation?.cvParam,
        spectrum,
        configuration.precision,
      );

      // Binary data array
      mapBinaryData(
        spectrumData.binaryDataArrayList?.binaryDataArray,
        spectrum,
        configuration.precision,
      );

      // Extract base peak m/z?
      if (spectrum.basePeak.mz === null) {
        spectrum.basePeak.mz =
          spectrum.array.mz[
            spectrum.array.intensity.reduce(
              (max, intensity, current) =>
                intensity > spectrum.array.intensity[max] ? current : max,
              0,
            )
          ];
      }

      // Filter spectrum array?
      if (configuration.spectrumArrayTarget) {
        filterSpectrumArrayTarget(
          spectrum,
          // @ts-ignore
          configuration.targetList,
          configuration.targetTolerance,
          data.chromatogram,
          configuration.msLevel,
          configuration.spectrumType,
          configuration.spectrumPolarity,
        );
      } else if (configuration.spectrumArrayRange) {
        // @ts-ignore
        filterSpectrumArrayRange(spectrum, configuration.mzRange);
      }

      // Exclude spectrum array?
      if (configuration.metadata) {
        spectrum.array.mz = [];
        spectrum.array.intensity = [];
      }

      // Filter spectrum data?
      if (
        !configuration.filterSpectrumData ||
        // @ts-ignore
        ((isNaN(configuration.msLevel[0]) ||
          // @ts-ignore
          configuration.msLevel.includes(spectrum.msLevel)) &&
          // @ts-ignore
          configuration.spectrumType.includes(spectrum.type) &&
          // @ts-ignore
          configuration.spectrumPolarity.includes(spectrum.polarity))
      ) {
        spectrum.index = data.spectrum.length;
        data.spectrum.push(spectrum);

        // Append chromatogram data
        appendChromatogram(
          data.chromatogram,
          'TIC',
          // @ts-ignore
          spectrum.msLevel,
          spectrum.scan.time,
          spectrum.totalIonCurrent,
        );

        appendChromatogram(
          data.chromatogram,
          'BPC',
          // @ts-ignore
          spectrum.msLevel,
          spectrum.scan.time,
          spectrum.basePeak.intensity,
        );
      }
    }
  }
}

/**
 * Filter spectrum array for a target list of m/z values.
 * @param {spectrum} data Spectrum data
 * @param {[number, number, string][]} targetList Target list of m/z values to filter for
 * @param {[number, number]} targetTolerance Accepted m/z and ppm tolerance
 * @param {chromatogram[]} chromatogram Chromatogram data
 * @param {number[]} msLevel MS level to filter for
 * @param {string[]} spectrumType Spectrum type to filter for
 * @param {string[]} spectrumPolarity Spectrum polarity to filter for
 * @returns {void}
 */
function filterSpectrumArrayTarget(
  data,
  targetList,
  targetTolerance,
  chromatogram,
  msLevel,
  spectrumType,
  spectrumPolarity,
) {
  data.totalIonCurrent = 0;
  data.basePeak.mz = 0;
  data.basePeak.intensity = 0;
  data.array.length = 0;
  const array = {
    mz: [],
    intensity: [],
  };

  // Filter target list
  targetList = targetList.filter(
    (target) =>
      target[1] === data.msLevel &&
      ((target[2] === '+' && data.polarity === 'positive') ||
        (target[2] === '-' && data.polarity === 'negative')),
  );

  // Filter for target m/z
  for (const target of targetList) {
    // Set m/z tolerance and range
    const tolerance = Math.max(
      Math.abs((targetTolerance[1] / 1e6) * target[0]),
      targetTolerance[0],
    );

    const mzRange = [target[0] - tolerance, target[0] + tolerance];

    // Identify m/z value closest to 0 ppm mass error
    let { mz, intensity } = data.array.mz.reduce(
      (obj, mz, current) => {
        if (mz >= mzRange[0] && mz <= mzRange[1]) {
          const ppm = Math.abs(((mz - target[0]) / target[0]) * 1e6);
          if (ppm < obj.ppm) {
            obj.mz = mz;
            obj.intensity = data.array.intensity[current];
            obj.ppm = ppm;
          }
        }

        return obj;
      },
      {
        mz: 0,
        intensity: 0,
        ppm: Infinity,
      },
    );

    // Update spectrum data and array
    mz = mz === 0 ? target[0] : mz;

    data.array.length++;
    // @ts-ignore
    array.mz.push(mz);
    // @ts-ignore
    array.intensity.push(intensity);

    data.totalIonCurrent += intensity;
    if (intensity > data.basePeak.intensity) {
      data.basePeak.mz = mz;
      data.basePeak.intensity = intensity;
    }

    // Append chromatogram data
    if (
      (isNaN(msLevel[0]) ||
        // @ts-ignore
        msLevel.includes(data.msLevel)) &&
      // @ts-ignore
      spectrumType.includes(data.type) &&
      // @ts-ignore
      spectrumPolarity.includes(data.polarity)
    ) {
      appendChromatogram(
        chromatogram,
        `SIC ${target[0]}`,
        // @ts-ignore
        data.msLevel,
        data.scan.time,
        intensity,
      );
    }
  }

  // Update spectrum array
  data.array.mz = array.mz;
  data.array.intensity = array.intensity;
}

/**
 * Filter spectrum array for a range of m/z values.
 * @param {spectrum} data Spectrum data
 * @param {[number, number]} mzRange Range of m/z values to filter for
 * @returns {void}
 */
function filterSpectrumArrayRange(data, mzRange) {
  mzRange[1] = isNaN(mzRange[1])
    ? data.array.mz[data.array.mz.length - 1]
    : mzRange[1];

  const { tic, bpi, bpmz, counter, mz, intensity } = data.array.mz.reduce(
    (obj, mz, current) => {
      if (mz >= mzRange[0] && mz <= mzRange[1]) {
        obj.counter++;
        // @ts-ignore
        obj.mz.push(mz);
        // @ts-ignore
        obj.intensity.push(data.array.intensity[current]);

        obj.tic += data.array.intensity[current];
        if (data.array.intensity[current] > obj.bpi) {
          obj.bpi = data.array.intensity[current];
          obj.bpmz = mz;
        }
      }

      return obj;
    },
    {
      counter: 0,
      mz: [],
      intensity: [],
      tic: 0,
      bpi: 0,
      bpmz: 0,
    },
  );

  // Update spectrum data and array
  data.totalIonCurrent = tic;
  data.basePeak.mz = bpmz;
  data.basePeak.intensity = bpi;
  data.array.length = counter;
  data.array.mz = mz;
  data.array.intensity = intensity;
}
