'use strict';

module.exports.TSParenthesizedType = (path) => {
    const {typeAnnotation} = path.node;
    
    typeAnnotation.extra = typeAnnotation.extra || {};
    typeAnnotation.extra.parenthesized = true;
    
    path.replaceWith(typeAnnotation);
};
