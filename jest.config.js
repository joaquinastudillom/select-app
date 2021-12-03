module.exports = {
    roots: ['<rootDir>/src'],
    testRegex: '(/.*\\.test)\\.(ts|tsx)$',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    moduleNameMapper: {
        '^.+\\.(css|less|scss)$': 'babel-jest',
    },
};
