'use strict';

const getDirectives = require('./get-directives');

module.exports = (node) => {
    if (node.type === 'File')
        return fixBabel(node);
    
    const {
        comments = [],
        tokens,
        interpreter,
        ...program
    } = node;
    
    const directives = getDirectives(node);
    
    if (interpreter)
        tokens.unshift(getShebangToken(interpreter.value))
    
    const ast = {
        type: 'File',
        program: {
            ...program,
            directives,
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

function getShebangToken(value) {
    return {
    "type": {
        "label": "#!...",
        "beforeExpr": false,
        "startsExpr": false,
        "rightAssociative": false,
        "isLoop": false,
        "isAssign": false,
        "prefix": false,
        "postfix": false,
        "binop": null,
        "updateContext": null
    },
    "value": value,
    "start": 0,
    "end": 19,
    "loc": {
        "start": {
            "line": 1,
            "column": 0
        },
        "end": {
            "line": 1,
            "column": 19
        }
    }
}
}

