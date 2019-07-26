'use strict';

const {
    isObjectExpression,
    isExpressionStatement,
    isLiteral,
    Directive,
    DirectiveLiteral,
} = require('@babel/types');

module.exports = (node) => {
    const strict = node.body.shift();
    
    if (!isExpressionStatement(strict))
        return [];
    
    const {expression} = strict;
    
    if (!isLiteral(expression, {value: 'use strict'}))
        return [];
    
    const {raw} = expression;
    const literal = getDirectiveLiteral(raw);
    
    return [
        getDirective(literal),
    ];
}

function getDirectiveLiteral(raw) {
    return {
        ...DirectiveLiteral('use strict'),
        start: 0,
        end: 12,
        loc: {
            start: {
                line: 1,
                column: 0,
            },
            end: {
                line: 1,
                column: 12,
            },
        },
        extra: {
            raw,
            rawValue: 'use strict',
        },
    };
}

function getDirective(literal) {
    return {
            ...Directive(literal),
            start: 0,
            end: 12,
            loc: {
                start: {
                    line: 1,
                    column: 0,
                },
                end: {
                    line: 1,
                    column: 13,
                },
            },
        };
}

