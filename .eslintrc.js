module.exports = {
  root: true,
  env: {
    node: true,
  },
  globals: {
    expect: 'readonly',
    test: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react-hooks', 'jest', 'testing-library'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  rules: {
    'import/no-webpack-loader-syntax': 0,
    'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks
    'react-hooks/exhaustive-deps': 'warn', // Checks effect dependencies
  },
  overrides: [
    {
      // For react component files, we want to allow types of the form `type Props = {}`
      // as Props is guaranteed to be an object by React. Without overriding this rule,
      // we would need to extend the Props generic from Record<string, unknown>
      // which causes issues when consumer props are defined as interface without an index signature.
      // Refer to react part of the comment for more details.
      // https://github.com/typescript-eslint/typescript-eslint/issues/2063#issuecomment-675156492
      excludedFiles: 'src/*.tsx',
      files: ['*.tsx'],
      rules: {
        '@typescript-eslint/ban-types': [
          'error',
          {
            extendDefaults: true,
            types: {
              '{}': false,
            },
          },
        ],
      },
    },
  ],
};
