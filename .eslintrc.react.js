'use strict';

module.exports = {
  extends: ['plugin:react/recommended', './.eslintrc.base.js', 'airbnb/hooks'],
  rules: {
    'jsx-a11y/anchor-is-valid': 'warn',
    'react/prop-types': 'off',
    'react/require-default-props': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-filename-extension': 'warn',
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/function-component-definition': 'off',
    'no-param-reassign': ['error', { props: true, ignorePropertyModificationsFor: ['state', 'acc'] }],
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['@/features/*/*', '!@/features/*/types'],
          },
        ],
      },
    ],
  },
  settings: {
    react: {
      pragma: 'React',
      version: 'detect',
    },
  },
};
