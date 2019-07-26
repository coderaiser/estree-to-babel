'use strict';

const traverse = require('@babel/traverse').default;
const {
    isObjectExpression,
    isExpressionStatement,
    isLiteral,
    Directive,
    DirectiveLiteral,
} = require('@babel/types');

const traverseObjectExpression = require('./traverse-object-expression');
const setClassMethod = require('./set-class-method');
const setClassPrivateMethod = require('./set-class-private-method');
const setLiteral = require('./set-literal');
const getDirectives = require('./get-directives');

module.exports = (node) => {
    const ast = getAST(node);
    
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
            
            if (type === 'ClassPrivateMethod')
                return setClassPrivateMethod(path);
        },
        exit(path) {
            const {node} = path;
            
            if (isObjectExpression(node))
                return traverseObjectExpression(path.get('properties'));
        },
    });
    
    return ast;
};

function setObjectProperty(node) {
    node.type = 'ObjectProperty';
}

function getAST(node) {
    if (node.type === 'File')
        return node;
    
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
}

