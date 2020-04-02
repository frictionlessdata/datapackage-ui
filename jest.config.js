const jestConfig = {
  roots: ['src'],
  displayName: process.env.JEST_ENV || 'node',
  testEnvironment: process.env.JEST_ENV || 'node',
  collectCoverage: false,
  coverageReporters: ['text-summary', 'html', 'lcov'],
  coverageThreshold: {
    global: {
      branches: 40,
      functions: 40,
      statements: 40,
      lines: 40,
    },
  },
}

module.exports = jestConfig
