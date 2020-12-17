'use strict';

const isString = (a) => typeof a === 'string';
const isNumber = (a) => typeof a === 'number';
const isNull = (a) => a === null;
const isBool = (a) => typeof a === 'boolean';

module.exports = (node) => {
    const {value} = node;
    
    if (isNull(value)) {
        node.type = 'NullLiteral';
        return;
    }
    
    if (node.regex) {
        node.type = 'RegExpLiteral';
        return;
    }
    
    if (isString(value)) {
        node.type = 'StringLiteral';
        return;
    }
    
    if (isNumber(value)) {
        node.type = 'NumericLiteral';
        return;
    }
    
    if (isBool(value)) {
        node.type = 'BooleanLiteral';
        return;
    }
};

