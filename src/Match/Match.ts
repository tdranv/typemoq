import * as _ from 'lodash';
import { Constants } from '../Consts';

export class Match {

    static isMatcher(x: any): boolean {
        return !_.isNil(x) &&
            !_.isUndefined(x[Constants.MATCH_NAME_MATCHES]) &&
            !_.isUndefined(x[Constants.MATCH_NAME_ID]) &&
            x[Constants.MATCH_NAME_ID] === Constants.MATCH_VALUE_ID;
    }

}
