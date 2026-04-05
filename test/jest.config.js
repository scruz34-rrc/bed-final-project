module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: ["**/tests/unit/**/*.test.ts"],
    setupFiles: ["<rootDir>/tests/jest.setup.ts"],
    collectCoverageFrom: [
        "src/api/v1/controllers/**/*.ts",
        "src/api/v1/services/**/*.ts",
        "src/api/v1/middleware/**/*.ts",
        "src/api/v1/validations/**/*.ts",
        "!src/api/v1/**/index.ts",
    ],
};