'use strict';

const traverse = require('@babel/traverse').default;
const {
    isProgram,
    isFile,
    isFunctionExpression,
    isObjectExpression,
    File,
    ObjectMethod,
} = require('@babel/types');

module.exports = (ast) => {
    traverse(ast, {
        noScope: true,
        enter(path) {
            const {node} = path;
            const {type} = node;
            
            if (isProgram(node)) {
                path.replaceWith(
                    File(path.node),
                );
                return
            }
            
            if (isObjectExpression(node)) {
                traverseObjectExpression(path.get('properties'));
                return;
            }
            
            if (type === 'Property') {
                node.type = 'ObjectProperty';
                return;
            }
        },
    });
    
    return ast;
};

function traverseObjectExpression(propertiesPaths) {
    for (const propPath of propertiesPaths) {
        const {
            computed,
            key,
            value,
        } = propPath.node;
        
        if (isFunctionExpression(value)) {
            propPath.replaceWith(
                ObjectMethod('method', key, value.params, value.body, computed),
            );
            
            const {
                type,
                ...props
            } = value;
            
            Object.assign(propPath.node, props);
        }
    }
}

