const {assign} = Object;

export default (path) => {
    const {attributes = []} = path.node;
    
    assign(path.node, {
        attributes,
    });
};
