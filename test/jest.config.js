module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: ["**/tests/unit/**/*.test.ts"],
    setupFilesAfterEnv: ["<rootDir>/tests/jest.setup.ts"], // Changed from setupFiles
    collectCoverageFrom: [
        "src/api/v1/controllers/**/*.ts",
        "src/api/v1/services/**/*.ts",
        "src/api/v1/middleware/**/*.ts",
        "src/api/v1/validations/**/*.ts",
        "!src/api/v1/**/index.ts",
    ],
};