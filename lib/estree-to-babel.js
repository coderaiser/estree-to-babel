'use strict';

const traverse = require('@babel/traverse').default;
const {
    isObjectExpression,
    isLiteral,
    classMethod,
} = require('@babel/types');

const traverseObjectExpression = require('./traverse-object-expression');

const isString = (a) => typeof a === 'string';
const isNumber = (a) => typeof a === 'number';

const {assign} = Object;

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
            
            if (isObjectExpression(node))
                return traverseObjectExpression(path.get('properties'));
            
            if (isLiteral(node))
                return setLiteral(node);
            
            if (type === 'Property')
                return setObjectProperty(node);
            
            if (type === 'MethodDefinition')
                return setClassMethod(path);
        },
    });
    
    return ast;
};

function setClassMethod(path) {
    const {node} = path;
    const {
        key,
        kind,
        computed,
    } = node;
    
    const {
        body,
        params,
        expression,
        generator,
    } = node.value;
    
    path.replaceWith(classMethod(
        kind,
        key,
        params,
        body,
        computed,
        node.static,
    )
    );
    
    assign(path.node, {
        expression,
        generator,
    });
}

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
}

