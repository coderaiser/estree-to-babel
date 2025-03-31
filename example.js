import cherow from 'espree';
import {traverse} from '@putout/babel';
import toBabel from './index.js';

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
