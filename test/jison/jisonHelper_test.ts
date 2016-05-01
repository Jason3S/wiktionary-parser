
import * as chai from 'chai';
import { missingParam, leaf, node, addChild, content, CONTENT } from '../../jison/jisonHelper';
import { normalizeParams, normalizePageName } from '../../jison/jisonHelper';
import * as jisonHelper from '../../jison/jisonHelper';
import * as _ from 'lodash';
import df = require('deep-freeze');
import {merge} from 'tsmerge';

const { assert, expect } = chai;

describe('test jisonHelper functions', () => {
    it('missingParam', () => {
        assert.deepEqual(missingParam(), { v: undefined });
    });

    it('leaf', () => {
        assert.deepEqual(leaf('hello'), { v: 'hello' });
    });

    it('node', () => {
        assert.deepEqual(node('text', [leaf('hello')]), { t: 'text', c: [{v: 'hello'}]});
        assert.deepEqual(node('text', []), { t: 'text', c: []});
        assert.deepEqual(node('text'), { t: 'text', c: []});
    });

    it('addChild', () => {
        const n = node('text');
        const n2 = addChild(n, leaf('hello'));
        assert.deepEqual(n2, { t: 'text', c: [{v: 'hello'}]});
        const n3 = addChild(n2, leaf('there'));
        assert.deepEqual(n2, { t: 'text', c: [{v: 'hello'}]});
        assert.deepEqual(n3, { t: 'text', c: [{v: 'hello'}, {v: 'there'}]});
    });

    it('content', () => {
        assert.deepEqual(content(leaf('hello')), { t: CONTENT, c: [{v: 'hello'}]});
        assert.deepEqual(content(leaf('hello'), leaf(' there')), { t: CONTENT, c: [{v: 'hello'}, {v: ' there'}]});
        const a = content(leaf('hello'), leaf(' there'));
        const b = content(leaf('.'));
        assert.deepEqual(content(a, b), { t: CONTENT, c: [{v: 'hello'}, {v: ' there'}, {v: '.'}]});
        assert.deepEqual(content(a), { t: CONTENT, c: [{v: 'hello'}, {v: ' there'}]});
        assert.deepEqual(content(leaf('>'), a), { t: CONTENT, c: [{v: '>'}, {v: 'hello'}, {v: ' there'}]});
        assert.deepEqual(content(null), { t: CONTENT, c: []});
    });

    it('normalizeParams', () => {
        assert.deepEqual(normalizeParams('a&b&c&d'.split('&')), { [1]: 'a', [2]: 'b', [3]: 'c', [4]: 'd' });
        assert.deepEqual(normalizeParams('name=joe'.split('&')), { name: 'joe' });
        assert.deepEqual(normalizeParams('25&name=joe'.split('&')), { [1]: '25', name: 'joe' });
        assert.deepEqual(normalizeParams('page=age&25&name=joe'.split('&')), { [1]: '25', name: 'joe', page: 'age' });
        assert.deepEqual(normalizeParams('page=age&25&name=joe&second'.split('&')), { [1]: '25', name: 'joe', page: 'age', [2]: 'second' });
    });

    it('normalizePageName', () => {
        assert.equal(normalizePageName('walk'), 'walk');
        assert.equal(normalizePageName('Wiktionary:walk'), 'walk');
    });

    it('isContentNode', () => {
        expect(jisonHelper.isContentNode({t: jisonHelper.CONTENT, c: []})).to.be.true;
        expect(jisonHelper.isContentNode({t: 'content', c: []})).to.be.true;
        expect(jisonHelper.isContentNode({t: 'text', c: []})).to.be.false;
    });

    it('trimParam', () => {
        const a = df(leaf('a'));
        const b = df(leaf('b'));
        const c = df(leaf('c'));
        const _a = df(leaf(' a'));
        const b_ = df(leaf('b '));
        const s = df(leaf('  '));

        const tests: {test: jisonHelper.Node, toMatch: jisonHelper.Node}[] = [
            {test: content(leaf('a'), leaf('b')), toMatch: content(a, b)},
            {test: content(a, b), toMatch: content(a, b)},
            {test: content(_a, b_), toMatch: content(a, b)},
            {test: content(a, content(b)), toMatch: content(a, b)},
            {test: content(content(a), b), toMatch: content(a, b)},
            {test: content(content(a), content(b)), toMatch: content(a, b)},
            {test: content(content(content(a), content(b))), toMatch: content(leaf('a'), leaf('b'))},
            {test: content(a, b), toMatch: node(jisonHelper.CONTENT, [a, b])},
            {test: content(a, content(b, c)), toMatch: node(jisonHelper.CONTENT, [a, b, c])},
            {test: content(content(a), content(b, c)), toMatch: node(jisonHelper.CONTENT, [a, b, c])},
            {test: content(content(a, b), content(c)), toMatch: node(jisonHelper.CONTENT, [a, b, c])},
            {test: content(_a, content(b_, content(s, s))), toMatch: content(a, b)},
            {test: content(s, content(s, content(_a, b_))), toMatch: content(a, b)},
            {test: df(content(leaf('a'), leaf('b'))), toMatch: content(a, b)},
            {test: df(content(_a, b_)), toMatch: content(a, b)},
        ];

        _.forEach(tests, ({test, toMatch}, index) => {
            expect(jisonHelper.trimParam(test), 'test #' + index).to.be.deep.equal(toMatch);
        });
    });

    it('', () => {
        const defaults = { timeout: 30000, retries: 3 };
        const customizations = { retries: 10 };
        const options = merge(defaults, customizations);
        console.log(options);
    });
});