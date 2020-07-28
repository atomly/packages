module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // Global beforeAll tests
  globalSetup: `${__dirname}/src/tests/globalSetup.ts`,
  // Global afterAll tests
  globalTeardown: `${__dirname}/src/tests/globalTeardown.ts`,
  // Module Aliases
  moduleNameMapper: {
    '^@root(.*)$': '<rootDir>/src/$1',
    '^@types(.*)$': '<rootDir>/src/types$1',
    '^@schema(.*)$': '<rootDir>/src/schema$1',
    '^@utils(.*)$': '<rootDir>/src/utils$1',
    '^@tests(.*)$': '<rootDir>/tests/$1',
  },
  // Only run TypeScript tests.
  testMatch: [
    '<rootDir>/src/tests/**/*.test.ts',
  ],
};
