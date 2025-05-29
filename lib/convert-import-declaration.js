'use strict';

module.exports = (path) => {
    const {attributes = []} = path.node;
    path.node.attributes = attributes;
};
