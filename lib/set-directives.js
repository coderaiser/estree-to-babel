'use strict';

const {
    Directive,
    DirectiveLiteral,
} = require('@babel/types');

module.exports = (path) => {
    const {node} = path;
    
    if (!node.directives) {
        node.directives = [];
    }
    
    for (const statementPath of path.get('body')) {
        if (statementPath.type !== 'ExpressionStatement')
            continue;
        
        const statement = statementPath.node;
        
        if (!('directive' in statement))
            continue;
        
        const directiveLiteral = DirectiveLiteral(statement.directive);
        const directive = Directive(directiveLiteral);
        
        node.directives.push(directive);
        statementPath.remove();
    }
};
