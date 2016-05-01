import * as _ from 'lodash';
import {merge} from 'tsmerge';

export interface ParamDictionary {
    [index: string]: string;
    [index: number]: string;
}

const namedParamRegEx = /^([a-zA-Z0-9]+)[=](.*)$/;

/**
 * Covert the page params in to a dicitonary of key/value pairs.
 *
 * @param {string[]} pageParams array of strings passed to the template, this strings can have two forms
 *                              just a value or key=value, the ones with out a value will be assigned a numeric key
 *                              in the order in which they are in the list.
 * @returns {ParamDictionary}
 */
export function normalizeParams(pageParams: string[]): ParamDictionary {
    interface ParamSet { last: number; params: ParamDictionary; }
    const paramSet: ParamSet = _(pageParams)
        .map(p => '' + p)   // force a string
        .reduce((ps: ParamSet, value: string): ParamSet => {
            const match = value.match(namedParamRegEx);
            if (match) {
                const params: ParamDictionary = merge(ps.params, { [match[1]]: match[2] });
                return { last: ps.last, params };
            }
            const params: ParamDictionary = merge(ps.params, { [ps.last]: value });
            return { last: ps.last + 1, params };
        }, { last: 1, params: {} } as ParamSet);

    return paramSet.params;
}

export function normalizePageName(pageName) {
    return pageName.replace(/^[^:]+[:]/, '');
}
