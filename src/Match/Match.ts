import * as _ from "lodash";
import { Constants } from "../Consts";

export class Match {

    static isMatcher(x: any): boolean {
        return !_.isNil(x) &&
            !_.isUndefined(x[Constants.IMATCH_MATCHES_NAME]) &&
            !_.isUndefined(x[Constants.IMATCH_ID_NAME]) &&
            x[Constants.IMATCH_ID_NAME] === Constants.MATCH_VALUE_ID;
    }

}
