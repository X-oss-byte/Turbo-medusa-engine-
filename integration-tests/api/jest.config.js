// API
process.chdir(__dirname)

module.exports = {
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.spec.json",
      isolatedModules: process.env.ISOLATED_MODULES,
    },
  },
  transform: {
    "^.+\\.[jt]s?$": "ts-jest",
  },
  name: "api",
  testEnvironment: `node`,
  rootDir: "./",
  testTimeout: 10000,
  testPathIgnorePatterns: [
    `/examples/`,
    `/www/`,
    `/dist/`,
    `/node_modules/`,
    `__tests__/fixtures`,
    `__testfixtures__`,
    `.cache`,
  ],
  transformIgnorePatterns: [
    `/dist`,
    "src/",
    `/examples/`,
    `/www/`,
    `/dist/`,
    `/node_modules/`,
    `__tests__/fixtures`,
    `__testfixtures__`,
    `.cache`,
  ],
  setupFiles: ["../setup-env.js"],
  setupFilesAfterEnv: ["../setup.js"],
  globalSetup: "../globalSetup.js",
  globalTeardown: "../globalTeardown.js",
}
