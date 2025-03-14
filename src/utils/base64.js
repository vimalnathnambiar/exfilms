/** @typedef {import('../../types/binary.mjs').base64} base64 */

import { decode } from 'base64-arraybuffer';
import { inflate } from 'pako';

/**
 * Base64 decoder to decode binary data array.
 * @param {base64} configuration Decoder configuration
 * @param {string} data Encoded data
 * @returns {Float32Array | Float64Array} Binary data array
 */
export function decoder(configuration, data) {
  const dataBuffer =
    configuration.compression === 'zlib'
      ? inflate(decode(data)).buffer
      : decode(data);

  // @ts-ignore
  return configuration.type[0] === 64
    ? new Float64Array(dataBuffer)
    : new Float32Array(dataBuffer);
}
