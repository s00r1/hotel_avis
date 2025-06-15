const js = require('@eslint/js');

module.exports = [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        document: 'readonly',
        window: 'readonly',
        alert: 'readonly',
        localStorage: 'readonly',
        setTimeout: 'readonly',
        module: 'readonly',
        require: 'readonly',
        test: 'readonly',
        expect: 'readonly'
      }
    },
    rules: {}
  }
];
