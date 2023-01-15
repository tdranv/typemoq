import * as _ from "lodash";
import * as common from "../Common/_all";
import { IMatch } from "./IMatch";
import { Constants } from "../Consts";
import { functionName } from "../Common/_all";

export class MatchAnyObject<T> implements IMatch {

    readonly ___id = Constants.MATCH_VALUE_ID;

    constructor(private readonly _ctor: common.Ctor<T>) {
    }

    ___matches(object: Object): boolean {
        let match = false;
        if (object && object.constructor.prototype == this._ctor.prototype)
            match = true;
        return match;
    }

    toString(): string {
        let res = `It.isAnyObject(${functionName(this._ctor)})`;
        return res;
    }
}

export class MatchAny implements IMatch {

    readonly ___id = Constants.MATCH_VALUE_ID;

    ___matches(object: Object): boolean {
        let match = true;
        return match;
    }

    toString(): string {
        return `any`;
    }
}

export class MatchAnyString implements IMatch {

    readonly ___id = Constants.MATCH_VALUE_ID;

    ___matches(object: Object): boolean {
        let match = false;
        if (_.isString(object))
            match = true;
        return match;
    }

    toString(): string {
        return `It.isAnyString()`;
    }
}

export class MatchAnyNumber implements IMatch {

    readonly ___id = Constants.MATCH_VALUE_ID;

    ___matches(object: Object): boolean {
        let match = false;
        if (_.isNumber(object))
            match = true;
        return match;
    }

    toString(): string {
        return `It.isAnyNumber()`;
    }
}
