module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  env: { node: true, es2020: true },
  ignorePatterns: ['dist', 'node_modules', 'frontend', 'nextsite'],
  overrides: [
    {
      files: ['packages/cli/bin/*.js'],     // keep the CJS launcher unchanged
      rules: { '@typescript-eslint/no-require-imports': 'off' },
    },
  ],
};
