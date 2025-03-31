import {convertProgramComments} from './comments.js';

export default (node) => {
    if (node.type === 'File')
        return node;
    
    const {
        comments = [],
        tokens,
        ...program
    } = node;
    
    const ast = {
        type: 'File',
        program: {
            ...program,
            directives: [],
        },
        comments: convertProgramComments(comments),
        tokens,
    };
    
    return ast;
};
