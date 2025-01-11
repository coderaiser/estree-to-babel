'use strict';

const cherow = require('espree');

const {traverse} = require('@putout/babel');
const toBabel = require('.');

const ast = toBabel(cherow.parse(`
    const f = ({a}) => a;
`));

traverse(ast, {
    noScope: false,
    ObjectProperty(path) {
        console.log(`variable is "${path.node.value.name}"`);
        // output
        'a';
    },
});
