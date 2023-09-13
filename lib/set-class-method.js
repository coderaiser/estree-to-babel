'use strict';

const {
    classPrivateMethod,
    classMethod,
    PrivateName,
    Identifier,
} = require('@putout/babel').types;

const {assign} = Object;

module.exports = (path) => {
    const {node} = path;
    const {
        key,
        kind,
        computed,
        loc,
    } = node;
    
    const {
        body,
        params,
        expression,
        generator,
    } = node.value;
    
    const method = getClassMethod({
        kind,
        key,
        params,
        body,
        computed,
        nodeStatic: node.static,
    });
    
    path.replaceWith(method);
    assign(path.node, {
        loc,
        expression,
        generator,
    });
};

const isPrivateIdentifier = ({type}) => type === 'PrivateIdentifier';

function getClassMethod({kind, key, params, body, computed, nodeStatic}) {
    if (isPrivateIdentifier(key)) {
        const newKey = convertPrivateIdentifier(key);
        return classPrivateMethod(kind, newKey, params, body, computed);
    }
    
    return classMethod(kind, key, params, body, computed, nodeStatic);
}

function convertPrivateIdentifier(node) {
    return PrivateName(Identifier(node.name));
}
