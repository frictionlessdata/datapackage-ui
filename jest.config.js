const jestConfig = {
  projects: ['node', 'jsdom'].map((env) => {
    return {
      roots: ['src'],
      displayName: env,
      testEnvironment: env,
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
  }),
}

module.exports = jestConfig
