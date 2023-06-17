'use strict';

module.exports = (node) => {
    if (!('loc' in node)) {
        node.loc = null;
    }
};
