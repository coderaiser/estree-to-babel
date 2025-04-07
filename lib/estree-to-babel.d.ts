import {ParseResult, types} from '@putout/babel';

export function toBabel(ast: types.Node, src?: string): ParseResult<types.File>;
