'use strict';

module.exports.convertTSClassImplements = (path) => {
    path.node.type = 'TSExpressionWithTypeArguments';
};
