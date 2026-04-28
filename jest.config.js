/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.js'],
  testTimeout: 15_000,
  watchman: false,
  clearMocks: true,
  resetMocks: true,
};
