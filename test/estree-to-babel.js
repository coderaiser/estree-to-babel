'use strict';

const {join} = require('path');
const {
    readFileSync,
    writeFileSync,
} = require('fs');

const test = require('tape');
const cherow = require('cherow');

const estreeToBabel = require('..');

const fixtureDir = join(__dirname, 'fixture');

const isUpdate = process.env.UPDATE_FIXTURE;
const update = (a, json) => {
    if (!isUpdate)
        return;
    
    writeFileSync(`${fixtureDir}/${a}.json`, JSON.stringify(json, null, 4));
}

const readJS = (a) => readFileSync(join(`${fixtureDir}/${a}`), 'utf8');
const readJSON = (a) => require(`${fixtureDir}/${a}`);
const fixture = {
    ast: {
        property: readJSON('property.json'),
        objectMethod: readJSON('object-method.json'),
    },
    js: {
        property: readJS('property.js'),
        objectMethod: readJS('object-method.js'),
    },
};

test('estree-to-babel: property', (t) => {
    const ast = cherow.parse(fixture.js.property);
    estreeToBabel(ast);
    
    t.deepEqual(ast, fixture.ast.property, 'should equal');
    t.end();
});

test('estree-to-babel: object-method', (t) => {
    const ast = cherow.parse(fixture.js.objectMethod);
    
    estreeToBabel(ast);
    update('object-method', ast);
    
    t.deepEqual(ast, fixture.ast.objectMethod, 'should equal');
    t.end();
});

