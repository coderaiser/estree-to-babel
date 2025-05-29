'use strict';

module.exports.convertParenthesizedExpression = ({convertParens}) => (path) => {
    if (!convertParens)
        return;
    
    const {expression} = path.node;
    
    expression.extra = expression.extra || {};
    expression.extra.parenthesized = true;
    
    path.replaceWith(expression);
};
