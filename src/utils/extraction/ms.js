/** @typedef {import('ora').Ora} ora */
/** @typedef {import('../../../types/configuration.mjs').configuration} configuration */
/** @typedef {import('../../../types/ms.mjs').ms} ms */

import { writeJSON } from '../writer.js';
import { extractChromatogram, initialiseChromatogram } from './chromatogram.js';
import { mapData } from './dataMap.js';
import { extractSpectrum } from './spectrum.js';

/**
 * Extract MS data.
 * @param {any} dataMap Parsed mzML data map
 * @param {configuration} configuration User configuration
 * @param {ora} spinner Ora spinner
 * @param {string} spinnerText Spinner text
 * @returns {void}
 */
export function extractMS(dataMap, configuration, spinner, spinnerText) {
  // No data map?
  if (!dataMap) {
    throw new Error('Unable to map parsed mzML data');
  }

  // Data mapping
  /** @type {ms} */
  const data = {
    id: String(dataMap.$id),
    timestamp: String(dataMap.run.$startTimeStamp),
    instrument: {
      vendor: null,
      serialNumber: null,
    },
    spectrumCount: 0,
    spectrum: [],
    chromatogramCount: 0,
    chromatogram: [],
  };

  // Instrument data
  mapData(dataMap.softwareList?.software, data, NaN);
  mapData(dataMap.dataProcessingList?.dataProcessingList, data, NaN);
  mapData(
    dataMap.instrumentConfigurationList?.instrumentConfiguration?.cvParam,
    data,
    NaN,
  );

  // Spectrum data exist?
  if (dataMap.run?.spectrumList?.spectrum) {
    // Spectrum and chromatogram data
    initialiseChromatogram(
      data,
      configuration.spectrumArrayTarget,
      configuration.targetList,
    );

    extractSpectrum(dataMap.run?.spectrumList?.spectrum, data, configuration);
  } else {
    // Chromatogram data
    extractChromatogram(
      dataMap.run?.chromatogramList?.chromatogram,
      data,
      configuration,
    );
  }

  // Number of spectrum and chromatogram data
  data.spectrumCount = data.spectrum.length;
  data.chromatogramCount = data.chromatogram.length;

  // Write output file
  spinner.text = spinnerText.concat('(writing output file)');
  if (configuration.outputFormat === 'JSON') {
    writeJSON(configuration.outputDirectory, data);
  }
}
