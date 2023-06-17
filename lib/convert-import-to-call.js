'use strict';

const {
    CallExpression,
    Import,
} = require('@babel/types');

const setLiteral = require('./set-literal');

module.exports = (path) => {
    const {loc, source} = path.node;
    
    setLiteral(source);
    
    const calleeNode = Import();
    calleeNode.loc = {
        start: loc.start,
        end: {
            line: loc.start.line,
            column: loc.start.column + 'import'.length,
        },
    };
    
    const callNode = CallExpression(calleeNode, [
        source,
    ]);
    callNode.loc = loc;
    
    path.replaceWith(callNode);
};

