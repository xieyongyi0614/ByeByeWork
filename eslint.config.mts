import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import { defineConfig } from 'eslint/config';
import pluginReactHooks from 'eslint-plugin-react-hooks';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    plugins: { js, 'react-hooks': pluginReactHooks, react: pluginReact },
    extends: ['js/recommended', pluginReact.configs.flat.recommended],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: './tsconfig.json',
      },
    },
  },
  tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      'react/react-in-jsx-scope': 'off',
      semi: 'warn',
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      'react/display-name': 'off',
    },
  },
]);
