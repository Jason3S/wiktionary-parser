import * as _ from 'lodash';

export function hashKeyForQuery(query: AstQuery) {
    const { lang, page, site } = query;
    return [ lang, page, site ].join('|');
}

export function combine1<A>(a: A): A {
    return _.assign({}, a) as A;
}

export function combine2<A, B>(a: A, b: B): A & B {
    return _.assign({}, a, b) as A & B;
}

export function combine3<A, B, C>(a: A, b: B, c: C): A & B & C {
    return _.assign({}, a, b, c) as A & B & C;
}


export const combine = combine2;
