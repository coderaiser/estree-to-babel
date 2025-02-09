'use strict';

const {traverse, types} = require('@putout/babel');

const traverseObjectExpression = require('./traverse-object-expression');
const setClassMethod = require('./set-class-method');
const setClassPrivateProperty = require('./set-class-private-property');
const setClassPrivateName = require('./set-class-private-name');
const setDirectives = require('./set-directives');
const convertChainExpression = require('./convert-chain-expression');
const convertImportDeclaration = require('./convert-import-declaration');
const convertExportDeclaration = require('./convert-export-declaration');
const {convertParenthesizedExpression} = require('./parenthesized-expression');
const {convertTSParenthesizedType} = require('./ts-parenthesized-type');

const {
    convertTSInterfaceHeritage,
    convertTSAbstractMethodDefinition,
    convertPropertyDefinition,
    convertPrivateIdentifier,
} = require('./ts');

const {convertNodeComments} = require('./comments');

const setLiteral = require('./set-literal');
const getAST = require('./get-ast');

const {
    isObjectExpression,
    isExportDeclaration,
} = types;

const defaultOptions = {
    convertParens: true,
};

module.exports = (node, options) => {
    const ast = getAST(node);
    
    const allOptions = {
        ...defaultOptions,
        ...options,
    };
    
    traverse(ast, {
        noScope: true,
        ParenthesizedExpression: convertParenthesizedExpression(allOptions),
        TSParenthesizedType: convertTSParenthesizedType(allOptions),
        enter(path) {
            const {node} = path;
            const {type} = node;
            
            if (type.endsWith('Literal')) {
                setLiteral(node);
                return setEsprimaRaw(node);
            }
            
            if (type === 'JSXText')
                return setEsprimaRaw(node);
            
            if (type === 'BlockStatement' || type === 'Program')
                return setDirectives(path);
            
            if (type === 'Property')
                return setObjectProperty(node);
            
            if (type === 'MethodDefinition')
                return setClassMethod(path);
            
            if (type === 'FieldDefinition')
                return setClassPrivateProperty(path);
            
            if (type === 'PrivateName')
                return setClassPrivateName(path);
            
            if (type === 'ImportDeclaration')
                return convertImportDeclaration(path);
            
            if (isExportDeclaration(path))
                return convertExportDeclaration(path);
            
            if (type === 'ChainExpression')
                return convertChainExpression(path);
            
            if (type === 'TSAbstractMethodDefinition')
                return convertTSAbstractMethodDefinition(path);
            
            if (type === 'TSInterfaceHeritage')
                return convertTSInterfaceHeritage(path);
            
            if (type === 'PropertyDefinition')
                return convertPropertyDefinition(path);
            
            if (type === 'PrivateIdentifier')
                return convertPrivateIdentifier(path);
        },
        exit(path) {
            const {node} = path;
            
            convertNodeComments(node);
            
            if (isObjectExpression(node))
                return traverseObjectExpression(path.get('properties'));
        },
    });
    return ast;
};

function setObjectProperty(node) {
    node.type = 'ObjectProperty';
}

// avoid additional traversing in @putout/engine-parser
// add "raw" field, that exists in all ESTree AST
// but located in "extra.raw" in Babel AST
// which makes writing transforms more long and error prone
function setEsprimaRaw(node) {
    const {raw} = node;
    
    node.raw = raw || node.extra?.raw;
    node.extra = node.extra || {
        raw,
    };
}
