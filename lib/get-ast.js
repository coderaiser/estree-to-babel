'use strict';

module.exports = (node) => {
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
        comments: comments.map(transformComment),
        tokens,
    };
    
    return ast;
};

function transformComment(comment) {
    if (comment.type === 'Line') {
        comment.type = 'CommentLine';
    } else if (comment.type === 'Block') {
        comment.type = 'CommentBlock';
    }
    
    return comment;
}
