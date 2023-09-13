'use strict';

const {
    Directive,
    DirectiveLiteral,
} = require('@putout/babel').types;

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
        
        const directiveLiteral = DirectiveLiteral(statement.directive);
        const directive = Directive(directiveLiteral);
        
        node.directives.push(directive);
        statementPath.remove();
    }
};
