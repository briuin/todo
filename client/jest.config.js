module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  testMatch: ["**/?(*.)+(spec|test).[tj]s?(x)"],
  globals: {
    "ts-jest": {
      isolatedModules: true,
    },
  },
  moduleNameMapper: {
    "^axios$": require.resolve("axios"),
  },
};
