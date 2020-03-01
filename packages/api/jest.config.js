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
    '^@entity(.*)$': '<rootDir>/src/entity$1',
    '^@typings(.*)$': '<rootDir>/src/types$1',
    '^@resolvers(.*)$': '<rootDir>/src/resolvers$1',
    '^@utils(.*)$': '<rootDir>/src/utils$1',
    '^@tests(.*)$': '<rootDir>/src/tests$1',
  },
};
