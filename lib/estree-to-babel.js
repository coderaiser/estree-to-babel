'use strict';

const traverse = require('@babel/traverse').default;
const {
    isObjectExpression,
    isLiteral
} = require('@babel/types');

const traverseObjectExpression = require('./traverse-object-expression');

const isString = (a) => typeof a === 'string';
const isNumber = (a) => typeof a === 'number';

module.exports = (program) => {
    const ast = {
        type: 'File',
        program,
    };
    
    traverse(ast, {
        noScope: true,
        enter(path) {
            const {node} = path;
            const {type} = node;
            
            if (isObjectExpression(node))
                return traverseObjectExpression(path.get('properties'));
            
            if (isLiteral(node))
                return setLiteral(node);
            
            if (type === 'Property')
                return setProperty(node);
        },
    });
    
    return ast;
};

function setProperty(node) {
    node.type = 'ObjectProperty';
}

function setLiteral(node) {
    const {value} = node;
    
    if (isString(value)) {
        node.type = 'StringLiteral';
        return;
    }
    
    if (isNumber(value)) {
        node.type = 'NumericLiteral';
        return;
    }
}

