'use strict';

const {defineConfig} = require('eslint/config');
const {safeAlign} = require('eslint-plugin-putout');

module.exports = defineConfig([
    safeAlign, {
        rules: {
            'no-useless-return': 'off',
        },
    },
]);
