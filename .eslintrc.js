/** @type {import('eslint').Linter.Config} */
module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 6,
        ecmaFeatures: {
            jsx: true,
        },
        project: './tsconfig.json',
        tsconfigRootDir: './',
    },
    settings: {
        react: {
            pragma: 'React',
            version: 'detect',
        },
        linkComponents: [
            { name: 'Link', linkAttribute: 'to' },
            { name: 'NavLink', linkAttribute: 'to' },
        ],
    },
    env: {
        browser: true,
        es6: true,
    },
    plugins: [
        'react',
        'react-hooks',
        'prettier',
        '@typescript-eslint',
        'unused-imports',
    ],
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:jest-dom/recommended',
    ],
    rules: {
        eqeqeq: 'error',
        'prettier/prettier': ['error', {}, { usePrettierrc: true }],

        // React
        'react/prop-types': 0,
        'react/display-name': 0,
        'react/no-unknown-property': ['error', { ignore: ['css'] }],

        // TypeScript
        '@typescript-eslint/no-explicit-any': 0,
        '@typescript-eslint/no-non-null-assertion': 0,
        '@typescript-eslint/ban-ts-comment': [
            'error',
            { 'ts-expect-error': 'allow-with-description' },
        ],

        // Required to avoid React before defined spam
        'no-use-before-define': 0,
        '@typescript-eslint/no-use-before-define': 'warn',

        // Disable default unused rules
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'off',

        // Auto-remove unused imports on --fix
        'unused-imports/no-unused-imports': 'error',

        // Keep _ prefix ignore behaviour
        'unused-imports/no-unused-vars': [
            'warn',
            {
                vars: 'all',
                varsIgnorePattern: '^_',
                args: 'after-used',
                argsIgnorePattern: '^_',
            },
        ],
    },
};
