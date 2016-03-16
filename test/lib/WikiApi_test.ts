
import * as chai from 'chai';
import {fetchWikiMarkup} from '../../visapp/lib/WikiApi';

const { assert } = chai;

describe('test fetching wiki pages', () => {
    it('fetches a wiktionary page', () => {
        return fetchWikiMarkup('en', 'word')
            // .tap(markup => console.log(markup))
            .tap(markup => assert.match(markup, /==English==/))
            .toArray()
            .toPromise();
    });

    it('fail to load a wiktionary page', (done) => {
        return fetchWikiMarkup('en', '')
            // .tapOnError(error => console.log(error))
            .toArray()
            .subscribe(
                noError => {
                    assert.fail();  // We were expecting an error.
                },
                onError => {
                    assert.instanceOf(onError, Error);
                    done();
                },
                done
            );
    });
});