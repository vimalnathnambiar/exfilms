/**
 * @typedef Yargs
 * @property {boolean} interactive Interactive mode?
 * @property {undefined|string} inputDirectory Input directory path
 * @property {string[]} fileList File list to process
 * @property {string[]} outputFormat Output format
 * @property {string} outputDirectory Output directory path
 * @property {string} logDirectory Log directory path
 * @property {number} decimalPlace Number of decimal places to round precision values to
 * @property {boolean} targeted Filter spectra for targeted m/z values?
 * @property {undefined|string} targetFile Target file path
 * @property {number} mzTolerance Accepted m/z tolerance
 * @property {number} ppmTolerance Accepted mass accuracy (ppm) tolerance
 * @property {boolean} mzRange Filter spectra for specific m/z range?
 * @property {number} minMZ Minimum m/z
 * @property {number} maxMZ Maximum m/z
 * @property {boolean} filterSpectrum Filter spectrum based on type, MS level, and polarity?
 * @property {string[]} spectrumType Spectrum type to filter for
 * @property {number[]} msLevel MS level to filter for
 * @property {string[]} spectrumPolarity Spectrum polarity to filter for
 * @property {boolean} excludeSpectra Exclude spectra from output file?
 */

/**
 * @typedef Timestamp
 * @property {?string} date Date "YYYY-MM-DD"
 * @property {?string} time Time "HH:MM:SS"
 */

/**
 * @typedef Spectrum
 * @property {number} index Index
 * @property {string} id ID
 * @property {number} arrayLength Length of data stored in array
 * @property {?string} type Type
 * @property {?number} msLevel MS level
 * @property {?string} scanType Scan type
 * @property {?string} polarity Polarity
 * @property {?number} retentionTime Retention time
 * @property {?number} presetScanConfiguration Preset scan configuration
 * @property {?number} inverseReducedIonMobility Inverse reduced ion mobility
 * @property {?number} scanWindowLowerLimit Scan window lower limit
 * @property {?number} scanWindowUpperLimit Scan window upper limit
 * @property {?number} isolationWindowTarget Isolation window target
 * @property {?number} isolationWindowLowerOffset Isolation window lower offset
 * @property {?number} isolationWindowUpperOffset Isolation window upper offset
 * @property {?number} selectedIonMZ Selected ion m/z
 * @property {?string} collisionType Collision type
 * @property {?number} collisionEnergy Collision energy
 * @property {number} basePeakIntensity Base peak intensity
 * @property {number} basePeakMZ Base peak m/z
 * @property {number} totalIonCurrent Total ion current
 * @property {[]|number[]} mzArray m/z array
 * @property {[]|number[]} intensityArray Intensity array
 */

/**
 * @typedef Chromatogram
 * @property {number} index Index
 * @property {string} id ID
 * @property {?number} arrayLength Length of data stored in array
 * @property {?string} type Type
 * @property {?string} polarity Polarity
 * @property {?number} dwellTime Dwell time
 * @property {?number} precursorIsolationWindowTarget Precursor isolation window target
 * @property {?string} collisionType Collision type
 * @property {?number} collisionEnergy Collision energy
 * @property {?number} productIsolationWindowTarget Product isolation window target
 * @property {[]|number[]} timeArray Retention time array
 * @property {[]|number[]} intensityArray Intensity array
 * @property {[]|number[]} msLevelArray MS level array
 * @property {[]|number[]} mzArray m/z array
 */

/**
 * @typedef MS
 * @property {string} id ID
 * @property {?string} date Date
 * @property {?string} time Time
 * @property {number} spectrumCount Number of spectrum data stored
 * @property {Spectrum[]} spectrum An array of spectrum data
 * @property {number} chromatogramCount Number of chromatogram data stored
 * @property {Chromatogram[]} chromatogram An array of chromatogram data
 */
