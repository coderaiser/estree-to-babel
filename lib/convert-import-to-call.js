'use strict';

const {CallExpression, Import} = require('@babel/types');
const setLiteral = require('./set-literal');

module.exports = (path) => {
    const {loc, source} = path.node;
    
    setLiteral(source);
    
    const callNode = CallExpression(Import(), [source]);
    
    path.replaceWith(callNode);
};
