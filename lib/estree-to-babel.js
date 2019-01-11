'use strict';

const traverse = require('@babel/traverse').default;
const {
    isObjectExpression,
    isLiteral
} = require('@babel/types');

const traverseObjectExpression = require('./traverse-object-expression');
const setClassMethod = require('./set-class-method');

const isString = (a) => typeof a === 'string';
const isNumber = (a) => typeof a === 'number';
const isNull = (a) => a === null;

module.exports = (node) => {
    const {
        comments = [],
        ...program
    } = node;
    
    const ast = {
        type: 'File',
        program,
        comments,
    };
    
    traverse(ast, {
        noScope: true,
        enter(path) {
            const {node} = path;
            const {type} = node;
            
            if (isLiteral(node))
                return setLiteral(node);
            
            if (type === 'Property')
                return setObjectProperty(node);
            
            if (type === 'MethodDefinition')
                return setClassMethod(path);
        },
        exit(path) {
            const {node} = path;
            
            if (isObjectExpression(node))
                return traverseObjectExpression(path.get('properties'));
        }
    });
    
    return ast;
};

function setObjectProperty(node) {
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
    
    if (isNull(value)) {
        node.type = 'NullLiteral';
        return;
    }
}

