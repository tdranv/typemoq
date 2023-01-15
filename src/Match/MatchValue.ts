import isEqual from "lodash/isEqual";
import cloneDeep from "lodash/cloneDeep";
import { IMatch } from "./IMatch";
import { Constants as Constants } from "../Consts";
import { argsName } from "../Common/Utils";

export class MatchValue<T = IArguments> implements IMatch {

    readonly ___id = Constants.MATCH_VALUE_ID;

    private readonly _value: T;

    constructor(value: T) {
        this._value = cloneDeep(value);
    }

    ___matches(object: any): boolean {
        return isEqual(this._value, object);
    }

    toString(): string {
        let valueName = argsName(<any>[this._value]);
        return valueName;
    }
}
