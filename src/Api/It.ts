﻿import * as common from '../Common/_all';
import * as match from '../Match/_all';

export class It {

    static isValue<T>(x: T): T {
        const matcher: match.IMatch = new match.MatchValue(x);
        return <any>matcher;
    }

    static isObjectWith<T>(x: { [P in keyof T]?: T[P] }): T {
        const matcher: match.IMatch = new match.MatchObjectWith(x);
        return <any>matcher;
    }

    static isAnyObject<T>(x: common.Ctor<T>): T {
        const matcher: match.IMatch = new match.MatchAnyObject(x);
        return <any>matcher;
    }

    static isAny(): any {
        const matcher: match.IMatch = new match.MatchAny();
        return <any>matcher;
    }

    static isAnyString(): string {
        const matcher: match.IMatch = new match.MatchAnyString();
        return <any>matcher;
    }

    static isAnyNumber(): number {
        const matcher: match.IMatch = new match.MatchAnyNumber();
        return <any>matcher;
    }

    static is<T>(predicate: common.IFunc2<T, boolean>): T {
        const matcher: match.IMatch = new match.MatchPred(predicate);
        return <any>matcher;
    }
}
