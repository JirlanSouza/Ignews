module.exports = {
  testPathIgnorePatterns: ['/node_modules/', '/.next/', '/screenshorts/'],
  setupFilesAfterEnv: ['<rootDir>/src/tests/setupTests.ts'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/node_modules/babel-jest',
  },
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(scss|sass|css)': 'identity-obj-proxy',
  },
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.tsx',
    '!src/**/_*.tsx',
    '!src/**/*.spec.tsx',
    '!src/**/stripe-js.ts',
  ],
  coverageReporters: ['lcov', 'json'],
};
