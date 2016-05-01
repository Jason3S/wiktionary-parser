
import * as chai from 'chai';
import { normalizeParams, normalizePageName } from '../../jison/wikiAstAnalyzer';

const { assert } = chai;

describe('test jisonHelper functions', () => {

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

});