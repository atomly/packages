module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // Global beforeAll tests
  globalSetup: '<rootDir>/tests/globalSetup.ts',
  // Global afterAll tests
  globalTeardown: '<rootDir>/tests/globalTeardown.ts',
  // Only run TypeScript tests.
  testMatch: [
    '<rootDir>/tests/**/*.test.ts',
  ],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.test.json',
      // tsConfig: {
      //   experimentalDecorators: true,
      // },
      diagnostics: false, // Disabling diagnostics
      // pathRegex: /\.(spec|test)\.ts$/, // Disabling by pathRegex
    },
  },
};
