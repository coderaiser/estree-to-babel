export default (path) => {
    const {attributes = []} = path.node;
    path.node.attributes = attributes;
};
