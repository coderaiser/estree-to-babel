'use strict';

module.exports = (path) => {
    const expressionPath = path.get('expression');
    const {expression} = path.node;
    
    if (expressionPath.isCallExpression()) {
        const calleePath = expressionPath.get('callee');
        
        expression.type = 'OptionalCallExpression';
        
        if (calleePath.isMemberExpression())
            expression.callee.type = 'OptionalMemberExpression';
    } else {
        expression.type = 'OptionalMemberExpression';
    }
    
    path.replaceWith(expression);
};
