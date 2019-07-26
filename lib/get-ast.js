'use strict';

const getDirectives = require('./get-directives');

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
            interpreter: null,
            directives: getDirectives(node),
        },
        comments,
        tokens,
    };
    
    return ast;
};

function fixBabel(node) {
    const {
        directives = [],
    } = node.program;
    
    return {
        ...node,
        program: {
            ...node.program,
            directives,
        },
    };
}
