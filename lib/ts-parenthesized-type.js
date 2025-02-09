'use strict';

module.exports.convertTSParenthesizedType = ({convertParens}) => (path) => {
    if (!convertParens)
        return;
    
    const {typeAnnotation} = path.node;
    
    typeAnnotation.extra = typeAnnotation.extra || {};
    typeAnnotation.extra.parenthesized = true;
    
    path.replaceWith(typeAnnotation);
};
