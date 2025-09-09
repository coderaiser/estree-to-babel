'use strict';

const {types} = require('@putout/babel');
const {
    directive,
    directiveLiteral,
} = types;

module.exports = (path) => {
    const {node} = path;
    
    if (node.directives)
        return;
    
    node.directives = [];
    for (const statementPath of path.get('body')) {
        if (statementPath.type !== 'ExpressionStatement')
            continue;
        
        const statement = statementPath.node;
        
        if (!('directive' in statement))
            continue;
        
        if (!statement.directive)
            continue;
        
        const literal = directiveLiteral(statement.directive);
        const currentDirective = directive(literal);
        
        node.directives.push(currentDirective);
        statementPath.remove();
    }
};
