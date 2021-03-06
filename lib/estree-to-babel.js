'use strict';

const traverse = require('@babel/traverse').default;
const {isObjectExpression} = require('@babel/types');

const traverseObjectExpression = require('./traverse-object-expression');
const setClassMethod = require('./set-class-method');
const setClassPrivateProperty = require('./set-class-private-property');
const setClassPrivateName = require('./set-class-private-name');
const convertImportToCall = require('./convert-import-to-call');

const {convertNodeComments} = require('./comments');

const setLiteral = require('./set-literal');
const getAST = require('./get-ast');

module.exports = (node) => {
    const ast = getAST(node);
    
    traverse(ast, {
        noScope: true,
        enter(path) {
            const {node} = path;
            const {type} = node;
            
            if (/Literal$/.test(type)) {
                setLiteral(node);
                return setEsprimaRaw(node);
            }
            
            if (type === 'Property')
                return setObjectProperty(node);
            
            if (type === 'MethodDefinition')
                return setClassMethod(path);
            
            if (type === 'FieldDefinition')
                return setClassPrivateProperty(path);
            
            if (type === 'PrivateName')
                return setClassPrivateName(path);
            
            if (type === 'ImportExpression')
                return convertImportToCall(path);
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
// add "raw" field, that exists in all ESTREE AST
// but located in "extra.raw" in BABEL AST
// which makes code transform more long and compilicated

function setEsprimaRaw(node) {
    const {raw} = node;
    
    node.raw = raw || node.extra?.raw;
    node.extra = node.extra || {
        raw,
    };
}
