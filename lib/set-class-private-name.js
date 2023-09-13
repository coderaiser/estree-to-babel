'use strict';

const {Identifier} = require('@putout/babel').types;

// acorn stores name in PrivateName.name
// babel stores name in PrivateName.id.name
module.exports = ({node}) => {
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
