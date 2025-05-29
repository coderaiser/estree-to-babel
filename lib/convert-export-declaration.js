'use strict';

const {assign} = Object;

module.exports = (path) => {
    const {attributes = []} = path.node;
    
    assign(path.node, {
        attributes,
    });
};
