'use strict';

module.exports = (node) => {
    if (node.type === 'File')
        return fixBabel(node);
    
    const {
        comments = [],
        tokens,
        ...program
    } = node;
    
    const ast = {
        type: 'File',
        program: {
            ...program,
            directives: [],
        },
        comments,
        tokens,
    };
    
    return ast;
};

function fixBabel(node) {
    return {
        ...node,
        program: {
            ...node.program,
            directives: [],
        },
    };
}

