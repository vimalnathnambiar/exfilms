import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    testTimeout: 50000,
    coverage: {
      enabled: true,
      exclude: [
        'eslint.config.mjs',
        'scripts/',
        'src/utils/docker.js',
        'src/exfilms.js',
        'src/utils/inquirerParser.js',
        'src/utils/yargsParser.js',
        'types/',
        'vitest.config.js',
      ],
    },
    reporters: ['junit'],
    outputFile: {
      junit: 'vitest-report.junit.xml',
    },
  },
});
