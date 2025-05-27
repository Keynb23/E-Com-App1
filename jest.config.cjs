// jest.config.cjs
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        // Point to your application's tsconfig. This ensures consistent type checking.
        tsconfig: '<rootDir>/tsconfig.app.json',
        // --- CRITICAL OVERRIDES FOR JEST TESTING ---
        compilerOptions: {
          // Override module output for tests to CommonJS, which Jest expects
          module: 'commonjs',
          // Explicitly ensure esModuleInterop is true for ts-jest
          esModuleInterop: true,
          // Keep jsx mode consistent if tsconfig.app.json also defines it
          jsx: 'react-jsx',
          // Keep moduleResolution consistent with Node's for tests
          moduleResolution: 'node'
        },
        // --- END CRITICAL OVERRIDES ---
      },
    ],
  },
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
  },
  testMatch: [
    '<rootDir>/src/**/*.test.(ts|tsx|js|jsx)',
    '<rootDir>/src/**/__tests__/**/*.(ts|tsx|js|jsx)',
  ],
  // Adjust transformIgnorePatterns if you have specific node_modules that need Jest transformation
  transformIgnorePatterns: [
    'node_modules/(?!(@smastrom/react-rating)/)' // Example, adjust if needed
  ],
};