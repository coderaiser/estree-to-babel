'use strict';

const {classPrivateMethod} = require('@babel/types');

const {assign} = Object;

module.exports = (path) => {
    const {node} = path;
    const {
        key,
        kind,
        loc,
        value,
    } = node;
    
    const isAlreadyProcessed = !value;
    
    if (isAlreadyProcessed)
        return;
    
    const {
        body,
        params,
        expression,
        generator,
    } = value;
    
    path.replaceWith(classPrivateMethod(
        kind,
        key,
        params,
        body,
        node.static,
    ));
    
    assign(path.node, {
        loc,
        expression,
        generator,
    });
};

