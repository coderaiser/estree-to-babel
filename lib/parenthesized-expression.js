'use strict';

module.exports.ParenthesizedExpression = (path) => {
    const {expression} = path.node;
    
    expression.extra = expression.extra || {};
    expression.extra.parenthesized = true;
    
    path.replaceWith(expression);
};
