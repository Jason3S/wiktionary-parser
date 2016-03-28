
import * as chai from 'chai';
import { missingParam, leaf, node, addChild, content, CONTENT } from '../../jison/jisonHelper';
import { normalizeParams, normalizePageName } from '../../jison/jisonHelper';

const { assert } = chai;

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

    it('', () => {});
});