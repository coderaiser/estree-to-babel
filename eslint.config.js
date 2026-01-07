import {defineConfig} from 'eslint/config';
import {safeAlign} from 'eslint-plugin-putout';

export default defineConfig([
    safeAlign, {
        rules: {
            'no-useless-return': 'off',
        },
    },
]);
