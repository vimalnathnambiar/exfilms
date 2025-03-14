import { existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { homedir } from 'node:os';
import { extname, join } from 'node:path';

/**
 * Get MS data file list from directory.
 * @param {string} directory Directory path
 * @returns {string[]} MS data file list
 */
export function getDataFileList(directory) {
  return readdirSync(directory).filter(
    (file) =>
      ['.d', '.raw', '.wiff', '.mzml'].includes(extname(file).toLowerCase()) &&
      !file.startsWith('._'),
  );
}

/**
 * Create output directory and log file path.
 * @param {string} directory Directory path
 * @returns {string} Log file path
 */
export function createOutputPath(directory) {
  // Output directory
  createDirectory(directory);

  // Log file
  const logDirectory = join(homedir(), '.exfilms', 'logs');
  createDirectory(logDirectory);

  return join(
    logDirectory,
    `${new Date().toISOString().replace(/[:.]/g, '-')}.log`,
  );
}

/**
 * Create directory.
 * @param {string} directory Directory path
 * @returns {void}
 */
export function createDirectory(directory) {
  if (!existsSync(directory)) {
    mkdirSync(directory, { recursive: true });
  }
}

/**
 * Delete directory.
 * @param {string} directory Directory path
 * @returns {void}
 */
export function deleteDirectory(directory) {
  if (existsSync(directory)) {
    rmSync(directory, { recursive: true });
  }
}
