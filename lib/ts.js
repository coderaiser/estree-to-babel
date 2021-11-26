'use strict';

module.exports.convertTSClassImplements = (path) => {
    path.node.type = 'TSExpressionWithTypeArguments';
};

module.exports.convertPropertyDefinition = (path) => {
    const {node} = path;
    
    if (node.key.type === 'PrivateIdentifier') {
        const {key} = node;
        
        node.type = 'ClassPrivateProperty';
        node.key = {
            type: 'PrivateName',
            id: {
                ...key,
                type: 'Identifier',
            },
        };
        
        return;
    }
    
    path.node.type = 'ClassProperty';
};

