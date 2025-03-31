import {types} from '@putout/babel';

const {Identifier} = types;

// acorn stores name in PrivateName.name
// babel stores name in PrivateName.id.name
export default ({node}) => {
    if (!node.name)
        return;
    
    node.id = Identifier(node.name);
    node.id.loc = {
        start: {
            line: node.loc.start.line,
            column: node.loc.start.column + 1,
        },
        end: node.loc.end,
    };
    delete node.name;
};
