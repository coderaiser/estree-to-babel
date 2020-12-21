'use strict';

const {join} = require('path');
const {
    readFileSync,
    writeFileSync,
} = require('fs');

const {extend} = require('supertape');
const espree = require('espree');
const babel = require('@babel/parser');
const attachComments = require('estree-util-attach-comments');

const estreeToBabel = require('..');

const json = (a) => JSON.parse(JSON.stringify(a));

const test = extend({
    jsonEqual: (operator) => (actual, expected, message = 'should jsonEqual') => {
        const {is, output} = operator.deepEqual(json(actual), json(expected));
        
        return {
            is,
            message,
            actual,
            expected,
            output,
        };
    },
});

const parse = (source) => {
    return espree.parse(source, {
        ecmaVersion: 2020,
        loc: true,
        comment: true,
    });
};

const acornParse = (source) => {
    const acorn = require('acorn');
    
    // fix acorn plugins
    // https://github.com/acornjs/acorn/issues/862
    acorn.version = '6.3.0';
    
    const {Parser} = acorn;
    const stage3 = require('acorn-stage3');
    
    const parser = Parser.extend(stage3);
    
    return parser.parse(source, {
        locations: true,
        comment: true,
        ecmaVersion: 2020,
        sourceType: 'module',
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
        boolLiteral: readJSON('bool-literal.json'),
        regexpLiteral: readJSON('regexp-literal.json'),
        comments: readJSON('comments.json'),
        commentsAttached: readJSON('comments-attached.json'),
        classMethod: readJSON('class-method.json'),
        classPrivateMethod: readJSON('class-private-method.json'),
        classPrivateProperty: readJSON('class-private-property.json'),
        strictMode: readJSON('strict-mode.json'),
        classMethodBabel: readJSON('class-method-babel.json'),
    },
    js: {
        property: readJS('property.js'),
        objectMethod: readJS('object-method.js'),
        stringLiteral: readJS('string-literal.js'),
        numericLiteral: readJS('numeric-literal.js'),
        nullLiteral: readJS('null-literal.js'),
        boolLiteral: readJS('bool-literal.js'),
        regexpLiteral: readJS('regexp-literal.js'),
        comments: readJS('comments.js'),
        commentsAttached: readJS('comments-attached.js'),
        strictMode: readJS('strict-mode.js'),
        classMethod: readJS('class-method.js'),
        classPrivateMethod: readJS('class-private-method.js'),
        classPrivateProperty: readJS('class-private-property.js'),
    },
};

test('estree-to-babel: property', (t) => {
    const ast = parse(fixture.js.property);
    const result = estreeToBabel(ast);
    
    update('property', result);
    
    t.jsonEqual(result, fixture.ast.property, 'should equal');
    t.end();
});

test('estree-to-babel: object-method', (t) => {
    const ast = parse(fixture.js.objectMethod);
    const result = estreeToBabel(ast);
    
    update('object-method', result);
    
    t.jsonEqual(result, fixture.ast.objectMethod, 'should equal');
    t.end();
});

test('estree-to-babel: string-literal', (t) => {
    const ast = parse(fixture.js.stringLiteral);
    const result = estreeToBabel(ast);
    
    update('string-literal', result);
    
    t.jsonEqual(result, fixture.ast.stringLiteral, 'should equal');
    t.end();
});

test('estree-to-babel: null-literal', (t) => {
    const ast = parse(fixture.js.nullLiteral);
    const result = estreeToBabel(ast);
    
    update('null-literal', result);
    
    t.jsonEqual(result, fixture.ast.nullLiteral, 'should equal');
    t.end();
});

test('estree-to-babel: numeric-literal', (t) => {
    const ast = parse(fixture.js.numericLiteral);
    const result = estreeToBabel(ast);
    
    update('numeric-literal', result);
    
    t.jsonEqual(result, fixture.ast.numericLiteral, 'should equal');
    t.end();
});

test('estree-to-babel: bool literal', (t) => {
    const ast = parse(fixture.js.boolLiteral);
    const result = estreeToBabel(ast);
    
    update('bool-literal', result);
    
    t.jsonEqual(result, fixture.ast.boolLiteral, 'should equal');
    t.end();
});

test('estree-to-babel: regexp literal', (t) => {
    const ast = parse(fixture.js.regexpLiteral);
    const result = estreeToBabel(ast);
    
    update('regexp-literal', result);
    
    t.jsonEqual(result, fixture.ast.regexpLiteral, 'should equal');
    t.end();
});

test('estree-to-babel: comments', (t) => {
    const ast = parse(fixture.js.comments);
    const result = estreeToBabel(ast);
    
    update('comments', result);
    
    t.jsonEqual(result, fixture.ast.comments, 'should equal');
    t.end();
});

test('estree-to-babel: attached comments', (t) => {
    const ast = parse(fixture.js.commentsAttached);
    const {comments} = ast;
    
    // Some estree parsers support only a top-level `comments` array.
    // Others support only attached comment nodes.
    // Babel has both.
    attachComments(ast, comments);
    ast.comments = comments;
    
    const result = estreeToBabel(ast);
    
    update('comments-attached', result);
    
    t.jsonEqual(result, fixture.ast.commentsAttached, 'should equal');
    t.end();
});

test('estree-to-babel: class method', (t) => {
    const ast = parse(fixture.js.classMethod);
    const result = estreeToBabel(ast);
    
    update('class-method', result);
    
    t.jsonEqual(result, fixture.ast.classMethod, 'should equal');
    t.end();
});

test('estree-to-babel: class method: babel.parse', (t) => {
    const ast = babel.parse(fixture.js.classMethod);
    const result = estreeToBabel(ast);
    
    update('class-method-babel', result);
    
    t.jsonEqual(result, fixture.ast.classMethodBabel, 'should equal');
    t.end();
});

test('estree-to-babel: class private method: babel.parse', (t) => {
    const ast = babel.parse(fixture.js.classPrivateMethod, {
        plugins: [
            'estree',
            'classPrivateMethods',
        ],
    });
    const result = estreeToBabel(ast);
    
    update('class-private-method', result);
    
    t.jsonEqual(result, fixture.ast.classPrivateMethod, 'should equal');
    t.end();
});

test('estree-to-babel: babel.parse: strict mode', (t) => {
    const ast = babel.parse(fixture.js.strictMode, {
        plugins: [
            'estree',
            'classPrivateMethods',
        ],
    });
    const result = estreeToBabel(ast);
    
    update('strict-mode', result);
    
    t.jsonEqual(result, fixture.ast.strictMode, 'should equal');
    t.end();
});

test('estree-to-babel: acorn.parse: private property', (t) => {
    const ast = acornParse(fixture.js.classPrivateProperty);
    const result = estreeToBabel(ast);
    
    update('class-private-property', result);
    
    t.jsonEqual(result, fixture.ast.classPrivateProperty, 'should equal');
    t.end();
});

