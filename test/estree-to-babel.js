'use strict';

const {join} = require('path');
const {
    readFileSync,
    writeFileSync,
} = require('fs');

const test = require('tape');
const espree = require('espree');

const estreeToBabel = require('..');

const parse = (source) => {
    return espree.parse(source, {
        ecmaVersion: 2018,
        loc: true,
        comment: true,
    });
};

const fixtureDir = join(__dirname, 'fixture');

const isUpdate = process.env.UPDATE_FIXTURE;
const update = (a, json) => {
    if (!isUpdate)
        return;
    
    writeFileSync(`${fixtureDir}/${a}.json`, JSON.stringify(json, null, 4));
};

const readJS = (a) => readFileSync(join(`${fixtureDir}/${a}`), 'utf8');
const readJSON = (a) => require(`${fixtureDir}/${a}`);
const fixture = {
    ast: {
        property: readJSON('property.json'),
        objectMethod: readJSON('object-method.json'),
        stringLiteral: readJSON('string-literal.json'),
        numericLiteral: readJSON('numeric-literal.json'),
        nullLiteral: readJSON('null-literal.json'),
        comments: readJSON('comments.json'),
        classMethod: readJSON('class-method.json'),
    },
    js: {
        property: readJS('property.js'),
        objectMethod: readJS('object-method.js'),
        stringLiteral: readJS('string-literal.js'),
        numericLiteral: readJS('numeric-literal.js'),
        nullLiteral: readJS('null-literal.js'),
        comments: readJS('comments.js'),
        classMethod: readJS('class-method.js'),
    },
};

test('estree-to-babel: property', (t) => {
    const ast = parse(fixture.js.property);
    const result = estreeToBabel(ast);
    
    update('property', result);
    
    t.deepEqual(result, fixture.ast.property, 'should equal');
    t.end();
});

test('estree-to-babel: object-method', (t) => {
    const ast = parse(fixture.js.objectMethod);
    const result = estreeToBabel(ast);
    
    update('object-method', result);
    
    t.deepEqual(result, fixture.ast.objectMethod, 'should equal');
    t.end();
});

test('estree-to-babel: string-literal', (t) => {
    const ast = parse(fixture.js.stringLiteral);
    const result = estreeToBabel(ast);
    
    update('string-literal', result);
    
    t.deepEqual(result, fixture.ast.stringLiteral, 'should equal');
    t.end();
});

test('estree-to-babel: numeric-literal', (t) => {
    const ast = parse(fixture.js.numericLiteral);
    const result = estreeToBabel(ast);
    
    update('numeric-literal', result);
    
    t.deepEqual(result, fixture.ast.numericLiteral, 'should equal');
    t.end();
});

test('estree-to-babel: null literal', (t) => {
    const ast = parse(fixture.js.nullLiteral);
    const result = estreeToBabel(ast);
    
    update('null-literal', result);
    
    t.deepEqual(result, fixture.ast.nullLiteral, 'should equal');
    t.end();
});

test('estree-to-babel: comments', (t) => {
    const ast = parse(fixture.js.comments);
    const result = estreeToBabel(ast);
    
    update('comments', result);
    
    t.deepEqual(result, fixture.ast.comments, 'should equal');
    t.end();
});

test('estree-to-babel: class method', (t) => {
    const ast = parse(fixture.js.classMethod);
    const result = estreeToBabel(ast);
    
    update('class-method', result);
    
    t.deepEqual(result, fixture.ast.classMethod, 'should equal');
    t.end();
});

