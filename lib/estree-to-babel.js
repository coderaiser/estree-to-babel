import {traverse, types} from '@putout/babel';
import traverseObjectExpression from './traverse-object-expression.js';
import setClassMethod from './set-class-method.js';
import setClassPrivateProperty from './set-class-private-property.js';
import setClassPrivateName from './set-class-private-name.js';
import setDirectives from './set-directives.js';
import convertChainExpression from './convert-chain-expression.js';
import convertImportDeclaration from './convert-import-declaration.js';
import convertExportDeclaration from './convert-export-declaration.js';
import {convertParenthesizedExpression} from './parenthesized-expression.js';
import {convertTSParenthesizedType} from './ts-parenthesized-type.js';
import {convertNodeComments} from './comments.js';
import setLiteral from './set-literal.js';
import getAST from './get-ast.js';
import {
    convertTSInterfaceHeritage,
    convertTSAbstractMethodDefinition,
    convertPropertyDefinition,
    convertPrivateIdentifier,
} from './ts.js';

const {
    isObjectExpression,
    isExportDeclaration,
} = types;

const defaultOptions = {
    convertParens: true,
};

export default (node, options) => {
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
