module.exports = {
    root: true,
    env: {
      browser: true,
      es2021: true,
      node: true,
    },
    extends: [
      'plugin:vue/vue3-recommended',
      'plugin:@typescript-eslint/recommended',
      'eslint:recommended',
    ],
    parser: 'vue-eslint-parser',
    parserOptions: {
      parser: '@typescript-eslint/parser',
      ecmaVersion: latest,
      sourceType: 'module',
    },
    rules: {
      // Отключаем ошибку о default export для .vue файлов
      'import/no-default-export': 'off',
      // Можно добавить свои правила
    },
    overrides: [
      {
        files: ['*.vue'],
        rules: {
          // Отключаем ошибку о default export для .vue файлов
          '@typescript-eslint/no-var-requires': 'off',
        },
      },
    ],
  }