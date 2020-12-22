'use strict';

exports.convertNodeComments = convertNodeComments;
exports.convertProgramComments = convertProgramComments;

function convertNodeComments(node) {
    const {comments} = node;
    
    if (!comments)
        return;
    
    delete node.comments;
    node.leadingComments = undefined;
    node.trailingComments = undefined;
    node.innerComments = undefined;
    
    for (const comment of comments) {
        // Default to leading comment.
        const group = getCommentGroup(comment);
        
        if (!node[group])
            node[group] = [];
        
        delete comment.leading;
        delete comment.trailing;
        comment.type = getCommentType(comment);
        node[group].push(comment);
    }
}

function convertProgramComments(comments) {
    return comments.map((comment) => {
        comment.type = getCommentType(comment);
        return comment;
    });
}

function getCommentType({type}) {
    if (type === 'Line')
        return 'CommentLine';
    
    if (type === 'Block')
        return 'CommentBlock';
    
    // Assume an unknown type, or that it’s already a Babel type.
    return type;
}

function getCommentGroup({trailing, leading}) {
    if (trailing)
        return 'trailingComments';
    
    if (leading)
        return 'leadingComments';
    
    // Dangling comments, such as `[/* a */]`.
    return 'innerComments';
}

