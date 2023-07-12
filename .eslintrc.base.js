'use strict';
// move to common library?
module.exports = {
  root: true,
  extends: ['plugin:jest/recommended', 'airbnb', 'airbnb-typescript', 'prettier'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'jest'],
  ignorePatterns: ['.eslintrc.js', '.eslint.react.js', 'babel.config.js', 'jest.config.js', 'webpack.*.js'],
  rules: {
    'import/prefer-default-export': 'off',
    'import/no-default-export': 'warn',
    'import/order': ['error', { 'newlines-between': 'always' }],
    'consistent-return': 'warn',
    'import/extensions': 'off',
    'padding-line-between-statements': ['warn', { blankLine: 'always', prev: '*', next: 'return' }],
    'space-before-function-paren': 'off',
    'object-curly-newline': 'off',
    'operator-linebreak': 'off',
    curly: ['error', 'all'],
    indent: 'off',
    'no-restricted-syntax': ['error', 'ForInStatement', 'WithStatement'],
    'no-continue': 'off',
    'no-console': 'warn',
    'no-await-in-loop': 'off',
    'jest/no-standalone-expect': ['error', { additionalTestBlockFunctions: ['beforeAll', 'afterAll'] }],
    'jest/no-mocks-import': 'warn',
    '@typescript-eslint/indent': 'off',
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'variable',
        format: ['camelCase', 'snake_case', 'PascalCase', 'UPPER_CASE'],
      },
      {
        selector: 'function',
        format: ['camelCase', 'PascalCase'],
      },
      {
        selector: 'typeLike',
        format: ['PascalCase'],
      },
    ],
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/comma-dangle': 'off',
    '@typescript-eslint/array-type': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
    semi: ['error', 'always'],
    'no-unused-vars': [
      'error',
      { vars: 'all', args: 'all', argsIgnorePattern: '^_', ignoreRestSiblings: true },
    ],
    'linebreak-style': 'off',
    'implicit-arrow-linebreak': 'off',
    'max-len': 'off',
    'import/no-cycle': 'off', // 07.07.2023 - temporarily disabled due to a bug in eslint-plugin-import
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
};
