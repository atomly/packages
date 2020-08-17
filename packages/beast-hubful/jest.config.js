module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // Global beforeAll tests
  // globalSetup: `${__dirname}/src/tests/globalSetup.ts`,
  // Global afterAll tests
  // globalTeardown: `${__dirname}/src/tests/globalTeardown.ts`,
  // Only run TypeScript tests.
  testMatch: [
    '<rootDir>/tests/**/*.test.ts',
  ],
  globals: {
    'ts-jest': {
      diagnostics: false, // Disabling diagnostics
      // pathRegex: /\.(spec|test)\.ts$/, // Disabling by pathRegex
    },
  },
};
