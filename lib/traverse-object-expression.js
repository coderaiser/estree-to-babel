import {types} from '@putout/babel';

const {
    isFunctionExpression,
    ObjectMethod,
} = types;

const {assign} = Object;

export default (propertiesPaths) => {
    for (const propPath of propertiesPaths) {
        const {
            computed,
            key,
            method,
            value,
        } = propPath.node;
        
        if (method && isFunctionExpression(value)) {
            propPath.replaceWith(ObjectMethod('method', key, value.params, value.body, computed));
            
            assign(propPath.node, {
                id: null,
                method: true,
                generator: value.generator,
                loc: getObjectMethodLoc(key, value),
                async: value.async,
                type: 'ObjectMethod',
            });
        }
    }
};

function getObjectMethodLoc(key, value) {
    if (key.loc && value.loc)
        return {
            start: key.loc.start,
            end: value.loc.end,
        };
    
    return null;
}
