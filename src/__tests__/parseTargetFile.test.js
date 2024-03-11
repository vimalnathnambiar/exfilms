// @ts-nocheck

import { describe, test, expect } from 'vitest';

import { parseTargetFile } from '../parseTargetFile.js';

/**
 * To test parseTargetFile function
 * Input: configParam (Object)
 * Output: An object containing the m/z target list, minimum and maximum values (Object)
 */
describe('parseTargetFile', () => {
  // Dummy data
  const testConfigParam = {
    decimalPlace: NaN,
    targetFile: '',
    mzTolerance: 0.005,
    filterSpectrumData: false,
    msLevel: [1, 2],
  };
  const testMzTargetListDefault = [
    70.065, 90.76644, 110.071, 116.0499, 116.0709, 158.964068, 165.089, 171.055,
    175.119, 188.0705, 226.951491, 232.1081, 237.1008, 239.6092, 244.1081,
    246.0873, 248.1157, 249.0911, 260.103, 264.1101, 274.1186, 276.0979,
    280.105, 286.1186, 288.1343, 290.1135, 291.0672, 292.075, 292.1324,
    294.1481, 294.938915, 295.0743, 295.124, 296.07, 296.0821, 302.1135,
    302.1499, 303.1088, 304.0928, 306.0907, 309.1033, 309.1163, 309.1671,
    317.1244, 318.1084, 320.1063, 324.1223, 324.1353, 326.1201, 326.1248,
    332.1241, 335.136, 336.1343, 340.1404, 345.167, 346.151, 346.1615, 351.1678,
    352.1292, 355.1752, 362.1564, 362.926338, 375.1452, 388.1761, 430.913762,
    473.1932, 478.21, 487.2088, 498.901186, 501.2432, 566.888609, 634.876033,
    702.863456, 770.85088, 838.838303, 906.825727, 974.81315, 1042.800574,
    1110.787998, 1178.775421, 1246.762845, 1314.750268, 1382.737692,
    1450.725115, 1518.712539,
  ];
  const testMinMzDefault = 70.06;
  const testMaxMzDefault = 1518.7175390000002;
  const testMzTargetList = [
    70.065, 90.7664, 110.071, 116.0499, 116.0709, 158.9641, 165.089, 171.055,
    175.119, 188.0705, 226.9515, 232.1081, 237.1008, 239.6092, 244.1081,
    246.0873, 248.1157, 249.0911, 260.103, 264.1101, 274.1186, 276.0979,
    280.105, 286.1186, 288.1343, 290.1135, 291.0672, 292.075, 292.1324,
    294.1481, 294.9389, 295.0743, 295.124, 296.07, 296.0821, 302.1135, 302.1499,
    303.1088, 304.0928, 306.0907, 309.1033, 309.1163, 309.1671, 317.1244,
    318.1084, 320.1063, 324.1223, 324.1353, 326.1201, 326.1248, 332.1241,
    335.136, 336.1343, 340.1404, 345.167, 346.151, 346.1615, 351.1678, 352.1292,
    355.1752, 362.1564, 362.9263, 375.1452, 388.1761, 430.9138, 473.1932,
    478.21, 487.2088, 498.9012, 501.2432, 566.8886, 634.876, 702.8635, 770.8509,
    838.8383, 906.8257, 974.8132, 1042.8006, 1110.788, 1178.7754, 1246.7628,
    1314.7503, 1382.7377, 1450.7251, 1518.7125,
  ];
  const testMinMZ = 70.06;
  const testMaxMZ = 1518.7175;

  test('throw error: targetFile does not match TSV pattern check', async () => {
    await expect(parseTargetFile(testConfigParam)).rejects.toThrowError(
      '\nparseTargetFile() - targetFile does not match TSV pattern check',
    );
  });

  test('pass pattern checks', async () => {
    // Published to web URL
    testConfigParam.targetFile =
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vSeo31hlruA3QuwoESz5IDJ9Nu6ndSAgLTRn3uc45rOPO4BlksfHzh9xtNB22Oes9JOxhEbI4NK-zxl/pub?gid=0&single=true&output=tsv';
    let targetFile = await parseTargetFile(testConfigParam);
    expect(targetFile.mzTargetList).toStrictEqual(testMzTargetListDefault);
    expect(targetFile.minMZ).toStrictEqual(testMinMzDefault);
    expect(targetFile.maxMZ).toStrictEqual(testMaxMzDefault);

    // Local file path
    testConfigParam.targetFile = './data/testTargetFile_validLayout.tsv';
    targetFile = await parseTargetFile(testConfigParam);
    expect(targetFile.mzTargetList).toStrictEqual(testMzTargetListDefault);
    expect(targetFile.minMZ).toStrictEqual(testMinMzDefault);
    expect(targetFile.maxMZ).toStrictEqual(testMaxMzDefault);
  });

  test('round m/z target list if decimal place is defined', async () => {
    testConfigParam.decimalPlace = 4;
    const targetFile = await parseTargetFile(testConfigParam);
    expect(targetFile.mzTargetList).toStrictEqual(testMzTargetList);
    expect(targetFile.minMZ).toStrictEqual(testMinMZ);
    expect(targetFile.maxMZ).toStrictEqual(testMaxMZ);
  });

  test('throw error: roundDecimalPlace() invalid input type', async () => {
    // toRoundValue
    testConfigParam.decimalPlace = 4;
    testConfigParam.mzTolerance = testConfigParam.mzTolerance.toString();
    await expect(parseTargetFile(testConfigParam)).rejects.toThrowError(
      '\nroundDecimalPlace() - toRoundValue must be of type number',
    );
    testConfigParam.mzTolerance = 0.005;

    // decimalPlace
    testConfigParam.decimalPlace = testConfigParam.decimalPlace.toString();
    await expect(parseTargetFile(testConfigParam)).rejects.toThrowError(
      '\nroundDecimalPlace() - decimalPlace must be of type number',
    );
    testConfigParam.decimalPlace = 4;
  });

  test('throw error: no target m/z data found', async () => {
    // Filter from valid file with invalid spectrum msLevel filtering
    testConfigParam.filterSpectrumData = true;
    testConfigParam.msLevel = [3];
    await expect(parseTargetFile(testConfigParam)).rejects.toThrowError(
      '\nparseTargetFile() - Target m/z data not found',
    );

    // Extract from a a file with invalid layout (wrong header)
    testConfigParam.targetFile = './data/testTargetFile_invalidLayout.tsv';
    await expect(parseTargetFile(testConfigParam)).rejects.toThrowError(
      '\nparseTargetFile() - Target m/z data not found',
    );

    // Testing as the above but without filtering spectrum msLevel filtering
    testConfigParam.filterSpectrumData = false;
    await expect(parseTargetFile(testConfigParam)).rejects.toThrowError(
      '\nparseTargetFile() - Target m/z data not found',
    );

    // Extract from an empty file with just the header
    testConfigParam.filterSpectrumData = true;
    testConfigParam.msLevel = [1, 2];
    testConfigParam.targetFile = './data/testTargetFile_empty.tsv';
    await expect(parseTargetFile(testConfigParam)).rejects.toThrowError(
      '\nparseTargetFile() - Target m/z data not found',
    );

    // Testing as the above but without spectrum msLevel filtering
    testConfigParam.filterSpectrumData = false;
    await expect(parseTargetFile(testConfigParam)).rejects.toThrowError(
      '\nparseTargetFile() - Target m/z data not found',
    );
  });
});