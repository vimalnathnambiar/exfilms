/**
 * @typedef configuration
 * @property {string} inputDirectory Input directory path
 * @property {string[]} fileList MS data files to extract from
 * @property {string} outputDirectory Output directory path
 * @property {string} outputFormat Output format
 * @property {string} logFile Log file path
 * @property {number} precision Number of decimal places to round precision values to
 * @property {boolean} metadata Exclude spectrum array
 * @property {boolean} filterSpectrumData Filter spectrum data
 * @property {number[] | undefined} msLevel MS level to filter for
 * @property {string[] | undefined} spectrumType Spectrum type to filter for
 * @property {string[] | undefined} spectrumPolarity Spectrum polarity to filter for
 * @property {boolean | undefined} spectrumArrayTarget Filter spectrum array for a target list of m/z values
 * @property {string | undefined} targetFile TSV target file path (local or remote URL)
 * @property {[number, number] | undefined} targetTolerance Accepted m/z and ppm tolerance
 * @property {[number, number, string][] | undefined} targetList Target list of m/z values to filter for
 * @property {boolean | undefined} spectrumArrayRange Filter spectrum array for a range of m/z values
 * @property {[number, number] | undefined} mzRange Range of m/z values to filter for
 */
