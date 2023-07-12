const path = require('path');

module.exports = {
  settings: {
    'import/resolver': {
      typescript: {
        project: path.resolve(__dirname),
      },
    },
  },
  extends: [path.resolve(__dirname, '.eslintrc.react.js')],
  parserOptions: {
    project: path.resolve(__dirname, 'tsconfig.json'),
  },
  rules: {
    'func-names': 'off',
  },
  plugins: ['import'],
};
