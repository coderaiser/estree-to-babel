'use strict';

const traverse = require('@babel/traverse').default;
const {
    isFunctionExpression,
    isObjectExpression,
    ObjectMethod,
} = require('@babel/types');

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
            
            Object.assign(propPath.node, value, {
                type: 'ObjectMethod'
            });
        }
    }
}

