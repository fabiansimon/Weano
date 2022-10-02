module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'no-use-before-define': ['error', { variables: false }],
    'no-nested-ternary': 'off',
    'react/prop-types': 0,
    'react/jsx-props-no-spreading': 'off',
    'max-len': ['error', { code: 200 }],
    'consistent-return': 'off',
    'class-methods-use-this': 'off',
    'react/no-unstable-nested-components': 'off',
    'react/function-component-definition': 'off',
    'no-return-assign': 'off',
  },
};
