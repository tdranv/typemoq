import * as _ from 'lodash';
import { IMatch } from './IMatch';
import { Constants } from '../Consts';
import { argsName } from '../Common/Utils';

export class MatchObjectWith<T> implements IMatch {

    readonly ___id = Constants.MATCH_VALUE_ID;

    private readonly _value: T;

    constructor(value: T) {
        this._value = <any>_.cloneDeep(value);
    }

    ___matches(object: Object): boolean {
        let match = false;
        const partial = _.pick(object, _.keys(this._value));
        if (_.isEqual(this._value, partial)) {
            match = true;
        }
        return match;
    }

    toString(): string {
        const valueName = argsName(<any>[this._value]);
        const res = `It.isObjectWith(${valueName})`;
        return res;
    }
}
