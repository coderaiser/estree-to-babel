'use strict';

const {CallExpression, Import} = require('@putout/babel').types;
const setLiteral = require('./set-literal');

const IMPORT_LENGTH = 'import'.length;

module.exports = (path) => {
    const {loc, source} = path.node;
    const calleeNode = Import();
    
    calleeNode.loc = {
        start: loc.start,
        end: {
            line: loc.start.line,
            column: loc.start.column + IMPORT_LENGTH,
        },
    };
    
    setLiteral(source);
    
    const callNode = CallExpression(calleeNode, [source]);
    
    callNode.loc = loc;
    
    path.replaceWith(callNode);
};
