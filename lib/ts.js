'use strict';

module.exports.convertTSClassImplements = (path) => {
    path.node.type = 'TSExpressionWithTypeArguments';
};

module.exports.convertPropertyDefinition = (path) => {
    const {node} = path;
    
    if (node.key.type === 'PrivateIdentifier') {
        const {key} = node;
        
        node.type = 'ClassPrivateProperty';
        node.key = createPrivateName(key);
        
        return;
    }
    
    path.node.type = 'ClassProperty';
};

module.exports.convertPrivateIdentifier = (path) => {
    path.replaceWith(createPrivateName(path.node));
};

function createPrivateName(node) {
    return {
        type: 'PrivateName',
        id: {
            ...node,
            type: 'Identifier',
        },
    };
}
