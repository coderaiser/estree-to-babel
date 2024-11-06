import {ParseResult, types} from '@putout/babel';

declare function toBabel(ast: types.Node, src?: string): ParseResult<types.File>;
export = toBabel;
