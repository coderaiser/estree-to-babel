'use strict';

const cherow = require('cherow');
const toBabel = require('.');
const traverse = require('@babel/traverse').default;

const ast = toBabel(cherow.parse(`
    const f = ({a}) => a;
`));

console.log(ast);

traverse({
    noScope: false,
    ObjectProperty(path) {
        console.log(path.value.name);
        // output
        'a';
    }
});

