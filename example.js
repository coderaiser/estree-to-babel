'use strict';

const cherow = require('cherow');
const toBabel = require('.');
const traverse = require('@babel/traverse').default;

const ast = toBabel(cherow.parse(`
    const f = ({a}) => a;
`));

traverse(ast, {
    noScope: false,
    ObjectProperty(path) {
        console.log(`variable is "${path.node.value.name}"`);
        // output
        'a';
    }
});

