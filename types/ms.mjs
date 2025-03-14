/**
 * @typedef ms
 * @property {string} id File name
 * @property {string} timestamp Acquisition timestamp
 * @property {instrument} instrument Instrument data
 * @property {number} spectrumCount Number of spectrum data
 * @property {spectrum[]} spectrum Spectrum data
 * @property {number} chromatogramCount Number of chromatogram data
 * @property {chromatogram[]} chromatogram Chromatogram data
 */

/**
 * @typedef instrument
 * @property {string | null} vendor Instrument vendor
 * @property {string | null} serialNumber Instrument serial number
 */

/**
 * @typedef spectrum
 * @property {number} index Spectrum index
 * @property {string} id Spectrum ID
 * @property {number | null} msLevel MS level
 * @property {string | null} type Spectrum type
 * @property {string | null} polarity Spectrum polarity
 * @property {scan} scan Scan data
 * @property {precursor} precursor Precursor data
 * @property {collision} collision Collision data
 * @property {number | null} totalIonCurrent Total ion current
 * @property {basePeak} basePeak Base peak data
 * @property {spectrumArray} array Spectrum array
 */

/**
 * @typedef scan
 * @property {string | null} type Scan type
 * @property {number | null} time Scan time point
 * @property {number | null} inverseReducedIonMobility Inverse reduced ion mobility
 * @property {scanWindow} window Scan window data
 */

/**
 * @typedef scanWindow
 * @property {number | null} lowerLimit Lower scan m/z limit
 * @property {number | null} upperLimit Upper scan m/z limit
 */

/**
 * @typedef precursor
 * @property {number | null} mz Precursor m/z
 * @property {number | null} chargeState Precursor charge state
 * @property {isolationWindow} isolationWindow Isolation data
 */

/**
 * @typedef isolationWindow
 * @property {number | null} mz Isolation reference m/z
 * @property {number | null} lowerOffset Isolation lower offset
 * @property {number | null} upperOffset Isolation upper offset
 */

/**
 * @typedef collision
 * @property {string | null} type Collision type
 * @property {number | null} energy Collision energy
 */

/**
 * @typedef basePeak
 * @property {number | null} mz Base peak m/z
 * @property {number | null} intensity Base peak intensity
 */

/**
 * @typedef spectrumArray
 * @property {number} length Array length
 * @property {number[]} mz m/z values
 * @property {number[]} intensity Intensity values
 */

/**
 * @typedef chromatogram
 * @property {number} index Chromatogram index
 * @property {string} id Chromatogram ID
 * @property {string | null} type Chromatogram type
 * @property {string | null} polarity Chromatogram polarity
 * @property {number | null} dwellTime Dwell time
 * @property {precursor} precursor Precursor data
 * @property {collision} collision Collision data
 * @property {product} product Product data
 * @property {chromatogramArray} array Chromatogram array
 */

/**
 * @typedef product
 * @property {number | null} mz Product m/z
 * @property {isolationWindow} isolationWindow Isolation data
 */

/**
 * @typedef chromatogramArray
 * @property {number} length Array length
 * @property {number[]} time Scan time points
 * @property {number[]} intensity Intensity values
 * @property {number[]} msLevel MS levels
 */
