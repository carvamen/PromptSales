// .eslintrc.cjs
module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    // ejemplo: permitir argumentos sin usar que empiecen con _
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'no-console': 'off'
  },
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'coverage/'
  ]
};
