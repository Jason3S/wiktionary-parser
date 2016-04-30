
import * as chai from 'chai';
import {WikiParser} from '../../visapp/lib/WikiParser';

const { assert } = chai;

describe('test fetching and parsing wiki pages', function() {
    this.timeout(15000);

    const parser = new WikiParser();

    it('fetches a wiktionary page', () => {
        return parser.requestPage('en', 'walk')
            .tap(ast =>  {
                assert.property(ast, 't');
                assert.equal(ast.t, 'wiki-page');
            })
            .toArray()
            .toPromise();
    });
});