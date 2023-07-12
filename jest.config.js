const { defaults } = require('jest-config');
const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  roots: ['<rootDir>/src'],
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest-setup.js'],
  transform: {
    '^.+\\.([tj]s|tsx|jsx)$': 'ts-jest',
    '^.+\\.css$': '<rootDir>/config/cssTransform.js',
    '^(?!.*\\.(js|jsx|mjs|cjs|ts|tsx|css|json)$)': '<rootDir>/config/fileTransform.js',
  },
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(?!(lodash-es|nanoid|@carrier-io/fds-react|@carrier-io/lynx-fleet-data-lib|@carrier-io/lynx-fleet-common|@carrier-io/lynx-fleet-types))',
  ],
  setupFiles: ['<rootDir>/config/jestSetup.js'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx', 'scss', 'css'],
  moduleNameMapper: {
    ...pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
  },
  globals: {
    'ts-jest': {
      isolatedModules: true,
      tsconfig: 'tsconfig.spec.json',
    },
  },
  collectCoverage: true,
  coverageReporters: ['text', 'lcov'],
  collectCoverageFrom: ['src/**/*.{ts,js}'],
};
