import * as chai from 'chai';
import {combine} from '../../visapp/lib/StateHelper';

const { assert } = chai;

describe('Validate Combine', () => {
    it('fetches a wiktionary page', () => {
        interface A { a: string; }
        interface B { b: string; }
        interface AB { a: string; b: string; }

        const a: A = { a: 'a' };
        const b: B = { b: 'b' };
        const ab: AB = combine(a, b);
        assert.equal(ab.a, a.a);
        assert.equal(ab.b, b.b);
    });
});