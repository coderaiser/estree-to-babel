'use strict';

module.exports = (path) => {
    const expressionPath = path.get('expression');
    const {expression} = path.node;
    
    if (expressionPath.isCallExpression())
        expression.type = 'OptionalCallExpression';
    else
        expression.type = 'OptionalMemberExpression';
    
    path.replaceWith(expression);
};

