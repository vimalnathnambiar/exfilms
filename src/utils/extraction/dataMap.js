/** @typedef {import('../../../types/binary.mjs').param} param */
/** @typedef {import('../../../types/ms.mjs').chromatogram} chromatogram */
/** @typedef {import('../../../types/ms.mjs').ms} ms */
/** @typedef {import('../../../types/ms.mjs').precursor} precursor */
/** @typedef {import('../../../types/ms.mjs').product} product */
/** @typedef {import('../../../types/ms.mjs').spectrum} spectrum */

import { decoder } from '../base64.js';
import { roundValue } from '../calculator.js';

/**
 * Key map.
 */
const keyMap = {
  // softwareList.software
  pwiz_Reader_ABI: 'instrument.vendor',
  pwiz_Reader_Bruker: 'instrument.vendor',
  pwiz_Reader_Waters: 'instrument.vendor',
  pwiz_Reader_UNIFI: 'instrument.vendor',
  pwiz_Reader_ABI_T2D: 'instrument.vendor',
  // ? pwiz_Reader_Mobilion: 'instrument.vendor',

  // dataProcessingList.dataProcessing
  pwiz_Reader_ABI_conversion: 'instrument.vendor',
  pwiz_Reader_Bruker_conversion: 'instrument.vendor',
  pwiz_Reader_Shimadzu_conversion: 'instrument.vendor',
  pwiz_Reader_Waters_conversion: 'instrument.vendor',
  pwiz_Reader_UNIFI_conversion: 'instrument.vendor',
  pwiz_Reader_Thermo_conversion: 'instrument.vendor',
  pwiz_Reader_Agilent_conversion: 'instrument.vendor',
  pwiz_Reader_ABI_T2D_conversion: 'instrument.vendor',
  // ? pwiz_Reader_Mobilion_conversion: 'instrument.vendor',

  // instrumentConfigurationList.instrumentConfiguration.cvParam
  'instrument serial number': 'instrument.serialNumber', // MS:1000529, Value type: string

  // spectrumList.spectrum.cvParam
  'ms level': 'msLevel', // MS:1000511, Value type: integer

  'centroid spectrum': 'type', // MS:1000127
  'profile spectrum': 'type', // MS:1000128

  'negative scan': 'polarity', // MS:1000129
  'positive scan': 'polarity', // MS:1000130

  'MS1 spectrum': 'scan.type', // MS:1000579
  // ? 'enhanced multiply charged spectrum': 'scan.type', // MS:1000789

  'MSn spectrum': 'scan.type', // MS:1000580
  // ? 'time-delayed fragmentation spectrum': 'scan.type', // MS:1000790

  'CRM spectrum': 'scan.type', // MS:1000581
  'SIM spectrum': 'scan.type', // MS:1000582
  'SRM spectrum': 'scan.type', // MS:1000583

  // ? 'charge inversion mass spectrum': 'scan.type', // MS:1000322
  // ? 'constant neutral gain spectrum': 'scan.type', // MS:1000325
  // ? 'constant neutral loss spectrum': 'scan.type', // MS:1000326
  // ? 'e/2 mass spectrum': 'scan.type', // MS:1000328
  // ? 'precursor ion spectrum': 'scan.type', // MS:1000341
  // ? 'product ion spectrum': 'scan.type', // MS:1000343

  // ? 'electromagnetic radiation spectrum': 'scan.type', // MS:1000804
  // ? 'emission spectrum': 'scan.type', // MS:1000805
  // ? 'absorption spectrum': 'scan.type', // MS:1000806
  // ? 'calibration spectrum': 'scan.type', // MS:1000928

  'total ion current': 'totalIonCurrent', // MS:1000285, Value type: float

  'base peak m/z': 'basePeak.mz', // MS:1000504, Value type: float, Unit: m/z
  'base peak intensity': 'basePeak.intensity', // MS:1000505, Value type: float

  // spectrumList.spectrum.scanList.scan.cvParam
  'scan start time': 'scan.time', // MS:1000016, Value type: float, Unit: second, minute

  'inverse reduced ion mobility': 'scan.inverseReducedIonMobility', // MS:1002815, Value type: float, Unit: volt-second per square centimeter

  // spectrumList.spectrum.scanList.scan.scanWindowList.scanWindow.cvParam
  'scan window upper limit': 'scan.window.upperLimit', // MS:1000500, Value type: float, Unit: m/z
  'scan window lower limit': 'scan.window.lowerLimit', // MS:1000501, Value type: float, Unit: m/z

  // spectrumList.spectrum.precursorList.precursor.selectedIonList.selectedIon.cvParam
  'selected ion m/z': 'precursor.mz', // MS:1000744, Value type: float, Unit: m/z
  'selected precursor m/z': 'precursor.mz', // MS:1002234, Value type: float, Unit: m/z

  'charge state': 'precursor.chargeState', // MS:1000041, Value type: integer

  // spectrumList.spectrum.precursorList.precursor.isolationWindow.cvParam
  // chromatogramList.chromatogram.precursor.isolationWindow.cvParam
  'isolation window target m/z': 'isolationWindow.mz', // MS:1000827, Value type: float, Unit: m/z
  'isolation window lower offset': 'isolationWindow.lowerOffset', // MS:1000828, Value type: float, Unit: m/z
  'isolation window upper offset': 'isolationWindow.upperOffset', // MS:1000829, Value type: float, Unit: m/z

  // spectrumList.spectrum.precursorList.precursor.activation.cvParam
  'collision energy': 'collision.energy', // MS:1000045, Value type: float, Unit: electronvolt

  'collision-induced dissociation': 'collision.type', // MS:1000133
  'beam-type collision-induced dissociation': 'collision.type', // MS:1000422
  'trap-type collision-induced dissociation': 'collision.type', // MS:1002472
  'supplemental collision-induced dissociation': 'collision.type', // MS:1002679

  'electron capture dissociation': 'collision.type', // MS:1000250
  'electron activated dissociation': 'collision.type', // MS:1003294

  photodissociation: 'collision.type', // MS:1000435
  'infrared multiphoton dissociation': 'collision.type', // MS:1000262
  'ultraviolet photodissociation': 'collision.type', // MS:1003246

  'plasma desorption': 'collision.type', // MS:1000134
  'post-source decay': 'collision.type', // MS:1000135
  'surface-induced dissociation': 'collision.type', // MS:1000136
  'blackbody infrared radiative dissociation': 'collision.type', // MS:1000242
  'sustained off-resonance irradiation': 'collision.type', // MS:1000282
  'low-energy collision-induced dissociation': 'collision.type', // MS:1000433
  'electron transfer dissociation': 'collision.type', // MS:1000598
  'pulsed q dissociation': 'collision.type', // MS:1000599
  'in-source collision-induced dissociation': 'collision.type', // MS:1001880
  LIFT: 'collision.type', // MS:1002000
  'negative electron transfer dissociation': 'collision.type', // MS:1003247

  // spectrumList.spectrum.binaryDataArrayList.binaryDataArray.cvParam
  '32-bit float': 'base64.type', // MS:1000521
  '64-bit float': 'base64.type', // MS:1000523
  // ? '32-bit integer': 'base64.type', // MS:1000519
  // ? '64-bit integer': 'base64.type', // MS:1000522
  // ? 'null-terminated ASCII string': 'base64.type', // MS:1001479

  'zlib compression': 'base64.compression', // MS:1000574
  'no compression': 'base64.compression', // MS:1000576
  // ? 'MS-Numpress linear prediction compression': 'base64.compression' // MS:1002312
  // ? 'MS-Numpress positive integer compression': 'base64.compression', // MS:1002313
  // ? 'MS-Numpress short logged float compression': 'base64.compression', // MS:1002314
  // ? 'MS-Numpress linear prediction compression followed by zlib compression': 'base64.compression', // MS:1002746
  // ? 'MS-Numpress positive integer compression followed by zlib compression': 'base64.compression', // MS:1002747
  // ? 'MS-Numpress short logged float compression followed by zlib compression': 'base64.compression', // MS:1002748
  // ? 'truncation and zlib compression': 'base64.compression', // MS:1003088
  // ? 'truncation, delta prediction and zlib compression': 'base64.compression', // MS:1003089
  // ? 'truncation, linear prediction and zlib compression': 'base64.compression', // MS:1003090

  'm/z array': 'array', // MS:1000514
  'intensity array': 'array', // MS:1000515
  'time array': 'array', // MS:1000595
  // ? 'charge array': 'array', // MS:1000516
  // ? 'signal to noise array': 'array', // MS:1000517
  // ? 'wavelength array': 'array', // MS:1000617
  // ? 'non-standard data array': 'array', // MS:1000786
  // ? 'flow rate array': 'array', // MS:1000820
  // ? 'pressure array': 'array', // MS:1000821
  // ? 'temperature array': 'array', // MS:1000822
  // ? 'mean charge array': 'array', // MS:1002478
  // ? 'resolution array': 'array', // MS:1002529
  // ? 'baseline array': 'array', // MS:1002530
  // ? 'noise array': 'array', // MS:1002742
  // ? 'sampled noise m/z array': 'array', // MS:1002743
  // ? 'sampled noise intensity array': 'array', // MS:1002744
  // ? 'sampled noise baseline array': 'array', // MS:1002745
  // ? 'mass array': 'array', // MS:1003143
  // ? 'scanning quadrupole position lower bound m/z array': 'array', // MS:1003157
  // ? 'scanning quadrupole position upper bound m/z array': 'array', // MS:1003158

  // ? 'ion mobility array': 'array', // MS:1002893
  // ? 'mean ion mobility drift time array': 'array', // MS:1002477
  // ? 'mean ion mobility array': 'array', // MS:1002816
  // ? 'mean inverse reduced ion mobility array': 'array', // MS:1003006
  // ? 'raw ion mobility array': 'array', // MS:1003007
  // ? 'raw inverse reduced ion mobility array': 'array', // MS:1003008
  // ? 'raw ion mobility drift time array': 'array', // MS:1003153
  // ? 'deconvoluted ion mobility array': 'array', // MS:1003154
  // ? 'deconvoluted inverse reduced ion mobility array': 'array', // MS:1003155
  // ? 'deconvoluted ion mobility drift time array': 'array', // MS:1003156

  // chromatogramList.chromatogram.cvParam
  'total ion current chromatogram': 'type', // MS:1000235
  'selected ion current chromatogram': 'type', // MS:1000627
  'basepeak chromatogram': 'type', // MS:1000628
  'selected ion monitoring chromatogram': 'type', // MS:1001472
  'selected reaction monitoring chromatogram': 'type', // MS:1001473
  'consecutive reaction monitoring chromatogram': 'type', // MS:1001474
  // ? 'precursor ion current chromatogram': 'type', // MS:4000025

  // ? 'electromagnetic radiation chromatogram': 'type', // MS:1000811
  // ? 'absorption chromatogram': 'type', // MS:1000812
  // ? 'emission chromatogram': 'type', // MS:1000813

  // ? 'temperature chromatogram': 'type', // MS:1002715
  // ? 'pressure chromatogram': 'type', // MS:1003019
  // ? 'flow rate chromatogram': 'type', // MS:1003020

  // chromatogramList.chromatogram.userParam
  MS_dwell_time: 'dwellTime',
};

/**
 * Value map.
 */
const valueMap = {
  // softwareList.software
  pwiz_Reader_ABI: 'SCIEX',
  pwiz_Reader_Bruker: 'Bruker Daltonics',
  pwiz_Reader_Waters: 'Waters Corporation',
  pwiz_Reader_UNIFI: 'Waters Corporation',
  pwiz_Reader_ABI_T2D: 'Applied Biosystems',
  // ? pwiz_Reader_Mobilion: 'Mobilion',

  // dataProcessingList.dataProcessing
  pwiz_Reader_ABI_conversion: 'SCIEX',
  pwiz_Reader_Bruker_conversion: 'Bruker Daltonics',
  pwiz_Reader_Shimadzu_conversion: 'Shimadzu Corporation',
  pwiz_Reader_Waters_conversion: 'Waters Corporation',
  pwiz_Reader_UNIFI_conversion: 'Waters Corporation',
  pwiz_Reader_Thermo_conversion: 'Thermo Fisher Scientific',
  pwiz_Reader_Agilent_conversion: 'Agilent Technologies',
  pwiz_Reader_ABI_T2D_conversion: 'Applied Biosystems',
  // ? pwiz_Reader_Mobilion_conversion: 'Mobilion',

  // run.spectrumList.spectrum.cvParam
  'centroid spectrum': 'centroid', // MS:1000127
  'profile spectrum': 'profile', // MS:1000128

  'negative scan': 'negative', // MS:1000129
  'positive scan': 'positive', // MS:1000130

  'MS1 spectrum': 'MS1 spectrum', // MS:1000579
  // ? 'enhanced multiply charged spectrum': 'enhanced multiply charged spectrum', // MS:1000789

  'MSn spectrum': 'MSn spectrum', // MS:1000580
  // ? 'time-delayed fragmentation spectrum': 'time-delayed fragmentation spectrum', // MS:1000790

  'CRM spectrum': 'consecutive reaction monitoring spectrum', // MS:1000581
  'SIM spectrum': 'selected ion monitoring spectrum', // MS:1000582
  'SRM spectrum': 'selected reaction monitoring spectrum', // MS:1000583

  // ? 'charge inversion mass spectrum': 'charge inversion spectrum', // MS:1000322
  // ? 'constant neutral gain spectrum': 'constant neutral gain spectrum', // MS:1000325
  // ? 'constant neutral loss spectrum': 'constant neutral loss spectrum', // MS:1000326
  // ? 'e/2 mass spectrum': 'e/2 spectrum', // MS:1000328
  // ? 'precursor ion spectrum': 'precursor ion spectrum', // MS:1000341
  // ? 'product ion spectrum': 'product ion spectrum', // MS:1000343

  // ? 'electromagnetic radiation spectrum': 'electromagnetic radiation spectrum', // MS:1000804
  // ? 'emission spectrum': 'emission spectrum', // MS:1000805
  // ? 'absorption spectrum': 'absorption spectrum', // MS:1000806
  // ? 'calibration spectrum': 'calibration spectrum', // MS:1000928

  // spectrumList.spectrum.precursorList.precursor.activation.cvParam
  'collision-induced dissociation': 'collision-induced dissociation', // MS:1000133
  'beam-type collision-induced dissociation':
    'beam-type collision-induced dissociation', // MS:1000422
  'trap-type collision-induced dissociation':
    'trap-type collision-induced dissociation', // MS:1002472
  'supplemental collision-induced dissociation':
    'supplemental collision-induced dissociation', // MS:1002679

  'electron capture dissociation': 'electron capture dissociation', // MS:1000250
  'electron activated dissociation': 'electron activated dissociation', // MS:1003294

  photodissociation: 'photodissociation', // MS:1000435
  'infrared multiphoton dissociation': 'infrared multiphoton dissociation', // MS:1000262
  'ultraviolet photodissociation': 'ultraviolet photodissociation', // MS:1003246

  'plasma desorption': 'plasma desorption', // MS:1000134
  'post-source decay': 'post-source decay', // MS:1000135
  'surface-induced dissociation': 'surface-induced dissociation', // MS:1000136
  'blackbody infrared radiative dissociation':
    'blackbody infrared radiative dissociation', // MS:1000242
  'sustained off-resonance irradiation': 'sustained off-resonance irradiation', // MS:1000282
  'low-energy collision-induced dissociation':
    'low-energy collision-induced dissociation', // MS:1000433
  'electron transfer dissociation': 'electron transfer dissociation', // MS:1000598
  'pulsed q dissociation': 'pulsed q dissociation', // MS:1000599
  'in-source collision-induced dissociation':
    'in-source collision-induced dissociation', // MS:1001880
  LIFT: 'LIFT', // MS:1002000
  'negative electron transfer dissociation':
    'negative electron transfer dissociation', // MS:1003247

  // spectrumList.spectrum.binaryDataArrayList.binaryDataArray.cvParam
  '32-bit float': [32, 'float'], // MS:1000521
  '64-bit float': [64, 'float'], // MS:1000523
  // ? '32-bit integer': [32, 'integer'], // MS:1000519
  // ? '64-bit integer': [64, 'integer'], // MS:1000522
  // ? 'null-terminated ASCII string': [NaN, 'null-terminated ASCII string'], // MS:1001479

  'zlib compression': 'zlib', // MS:1000574
  'no compression': 'none', // MS:1000576
  // ? 'MS-Numpress linear prediction compression': '?', // MS:1002312
  // ? 'MS-Numpress positive integer compression': '?', // MS:1002313
  // ? 'MS-Numpress short logged float compression': '?', // MS:1002314
  // ? 'MS-Numpress linear prediction compression followed by zlib compression': '?', // MS:1002746
  // ? 'MS-Numpress positive integer compression followed by zlib compression': '?', // MS:1002747
  // ? 'MS-Numpress short logged float compression followed by zlib compression': '?', // MS:1002748
  // ? 'truncation and zlib compression': '?', // MS:1003088
  // ? 'truncation, delta prediction and zlib compression': '?', // MS:1003089
  // ? 'truncation, linear prediction and zlib compression': '?', // MS:1003090

  'm/z array': 'mz', // MS:1000514
  'intensity array': 'intensity', // MS:1000515
  'time array': 'time', // MS:1000595
  // ? 'charge array': '?', // MS:1000516
  // ? 'signal to noise array': '?', // MS:1000517
  // ? 'wavelength array': '?', // MS:1000617
  // ? 'non-standard data array': '?', // MS:1000786
  // ? 'flow rate array': '?', // MS:1000820
  // ? 'pressure array': '?', // MS:1000821
  // ? 'temperature array': '?', // MS:1000822
  // ? 'mean charge array': '?', // MS:1002478
  // ? 'resolution array': '?', // MS:1002529
  // ? 'baseline array': '?', // MS:1002530
  // ? 'noise array': '?', // MS:1002742
  // ? 'sampled noise m/z array': '?', // MS:1002743
  // ? 'sampled noise intensity array': '?', // MS:1002744
  // ? 'sampled noise baseline array': '?', // MS:1002745
  // ? 'mass array': '?', // MS:1003143
  // ? 'scanning quadrupole position lower bound m/z array': '?', // MS:1003157
  // ? 'scanning quadrupole position upper bound m/z array': '?', // MS:1003158

  // ? 'ion mobility array': '?', // MS:1002893
  // ? 'mean ion mobility drift time array': '?', // MS:1002477
  // ? 'mean ion mobility array': '?', // MS:1002816
  // ? 'mean inverse reduced ion mobility array': '?', // MS:1003006
  // ? 'raw ion mobility array': '?', // MS:1003007
  // ? 'raw inverse reduced ion mobility array': '?', // MS:1003008
  // ? 'raw ion mobility drift time array': '?', // MS:1003153
  // ? 'deconvoluted ion mobility array': '?', // MS:1003154
  // ? 'deconvoluted inverse reduced ion mobility array': '?', // MS:1003155
  // ? 'deconvoluted ion mobility drift time array': '?', // MS:1003156

  // chromatogramList.chromatogram.cvParam
  'total ion current chromatogram': 'total ion chromatogram', // MS:1000235
  'selected ion current chromatogram': 'selected ion chromatogram', // MS:1000627
  'basepeak chromatogram': 'base peak chromatogram', // MS:1000628
  'selected ion monitoring chromatogram': 'selected ion chromatogram', // MS:1001472
  'selected reaction monitoring chromatogram':
    'selected reaction monitoring chromatogram', // MS:1001473
  'consecutive reaction monitoring chromatogram':
    'consecutive reaction monitoring chromatogram', // MS:1001474
  // ? 'precursor ion current chromatogram': 'precursor ion chromatogram', // MS:4000025

  // ? 'electromagnetic radiation chromatogram': 'electromagnetic radiation chromatogram', // MS:1000811
  // ? 'absorption chromatogram': 'absorption chromatogram', // MS:1000812
  // ? 'emission chromatogram': 'emission chromatogram', // MS:1000813

  // ? 'temperature chromatogram': 'temperature chromatogram', // MS:1002715
  // ? 'pressure chromatogram': 'pressure chromatogram', // MS:1003019
  // ? 'flow rate chromatogram': 'flow rate chromatogram', // MS:1003020
};

/**
 * Map data from parsed mzML.
 * @param {any} dataMap Parsed mzML data map
 * @param {ms | spectrum | chromatogram | precursor | product | param} data Data object to map to
 * @param {number} precision Number of decimal places to round precision values to
 * @returns {void}
 */
export function mapData(dataMap, data, precision) {
  if (dataMap) {
    if (!Array.isArray(dataMap)) {
      dataMap = [dataMap];
    }

    for (const param of dataMap) {
      if (keyMap[param.$id || param.$name]) {
        // Identify object property
        let obj = data;
        const key = keyMap[param.$id || param.$name].split('.');

        for (let i = 0; i < key.length - 1; i++) {
          obj = obj[key[i]];
        }

        // Format value
        let value =
          valueMap[param.$id || param.$name] ||
          (param.$value === '' ? null : param.$value) ||
          null;

        if (value !== null) {
          if (
            [
              'instrument.vendor',
              'instrument.serialNumber',
              'type',
              'polarity',
              'scan.type',
              'collision.type',
              'base64.compression',
              'array',
            ].includes(keyMap[param.$id || param.$name])
          ) {
            value = String(value);
          } else if (
            ['msLevel', 'precursor.chargeState', 'dwellTime'].includes(
              keyMap[param.$id || param.$name],
            )
          ) {
            value = Number(value);
          } else if (
            [
              'scan.time',
              'scan.inverseReducedIonMobility',
              'scan.window.lowerLimit',
              'scan.window.upperLimit',
              'precursor.mz',
              'isolationWindow.mz',
              'isolationWindow.lowerOffset',
              'isolationWindow.upperOffset',
              'collision.energy',
              'totalIonCurrent',
              'basePeak.mz',
              'basePeak.intensity',
            ].includes(keyMap[param.$id || param.$name])
          ) {
            if (keyMap[param.$id || param.$name] === 'scan.time') {
              value =
                param.$unitName === 'second'
                  ? Number(value) / 60
                  : Number(value);
            }

            value = !isNaN(precision)
              ? roundValue(Number(value), precision)
              : Number(value);
          } else if (keyMap[param.$id || param.$name] === 'base64.type') {
            value = [Number(value[0]), String(value[1])];
          }
        }

        // Map value
        if (obj[key[key.length - 1]] === null) {
          obj[key[key.length - 1]] = value;
        }
      }
    }
  }
}

/**
 * Map binary data array from parsed mzML.
 * @param {any} dataMap Parsed mzML binary data array map
 * @param {spectrum | chromatogram} data Data object to map to
 * @param {number} precision Number of decimal places to round precision values to
 * @returns {void}
 */
export function mapBinaryData(dataMap, data, precision) {
  if (dataMap) {
    if (!Array.isArray(dataMap)) {
      dataMap = [dataMap];
    }

    for (const binaryData of dataMap) {
      // Decoder configuration
      /** @type {param} */
      const param = {
        base64: {
          type: null,
          compression: null,
        },
        array: null,
      };

      mapData(binaryData.cvParam, param, NaN);

      // Decode data array
      if (
        param.base64.type !== null &&
        param.base64.compression !== null &&
        param.array !== null
      ) {
        data.array[param.array] = Array.from(
          decoder(param.base64, binaryData.binary),
        ).map((value) =>
          // @ts-ignore
          ['mz', 'intensity', 'time'].includes(param.array) && !isNaN(precision)
            ? roundValue(Number(value), precision)
            : Number(value),
        );
      }
    }
  }
}
