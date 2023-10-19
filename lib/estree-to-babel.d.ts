import {
    ParseResult,
    types,
} from '@putout/babel';

export default function toBabel(ast: types.Node, src?: string): ParseResult<types.File>;
