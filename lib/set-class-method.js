'use strict';

const {
    classMethod,
} = require('@babel/types');

const {assign} = Object;

module.exports = (path) => {
    const {node} = path;
    const {
        key,
        kind,
        computed,
    } = node;
    
    const {
        body,
        params,
        expression,
        generator,
    } = node.value;
    
    path.replaceWith(classMethod(
        kind,
        key,
        params,
        body,
        computed,
        node.static,
    )
    );
    
    assign(path.node, {
        expression,
        generator,
    });
};

