// jest.config.ts
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      // Point ts-jest to your new Jest-specific tsconfig
      tsconfig: '<rootDir>/tsconfig.jest.json', // <--- IMPORTANT CHANGE HERE
    }],
  },
  // Remove the 'globals' section entirely if it only contained ts-jest config
  // globals: { /* ... */ },
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)',
  ],
};