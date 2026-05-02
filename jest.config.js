module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js', '**/?(*.)+(spec|test).js'],
  testPathIgnorePatterns: ['/node_modules/', '/frontend/'],
  collectCoverageFrom: ['index.js'],
  coveragePathIgnorePatterns: ['/node_modules/', '/frontend/']
};

