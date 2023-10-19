import {
    ParseResult,
    types,
} from '@putout/babel';

/**
 * Convert an SWC ast to a babel ast
 * @param ast {Module} SWC ast
 * @param {string} [src=""] Source code
 * @returns {ParseResult<File>} Babel ast
 */
export default function toBabel(ast: types.Node, src?: string): ParseResult<types.File>;
