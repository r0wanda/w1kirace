// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.strictTypeChecked,
    tseslint.configs.stylisticTypeChecked,
    {
        rules: {
            '@typescript-eslint/consistent-type-assertions': ['warn', {
                assertionStyle: 'angle-bracket'
            }],
            '@typescript-eslint/ban-ts-comment': 'off',
            'no-empty': 'warn',
            '@typescript-eslint/triple-slash-reference': 'off',
            '@typescript-eslint/consistent-indexed-object-style': 'off',
            '@typescript-eslint/prefer-nullish-coalescing': 'warn',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unsafe-assignment': 'warn',
            '@typescript-eslint/no-unused-vars': 'warn',
            '@typescript-eslint/no-empty-function': 'warn',
            '@typescript-eslint/restrict-template-expressions': 'off',
            '@typescript-eslint/unified-signatures': 'off',
            '@typescript-eslint/no-redundant-type-constituents': 'off',
            '@typescript-eslint/no-unnecessary-condition': 'off',
            '@typescript-eslint/no-unnecessary-type-assertion': 'off'
        }
    },
    {
        languageOptions: {
            parserOptions: {
                projectService: {
                    allowDefaultProject: ['eslint.config.js']
                },
                tsconfigRootDir: import.meta.dirname
            }
        }
    }
);