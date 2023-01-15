import * as all from './_all';
import { IUsingResult } from './IUsing';
import { GlobalScope as GScope } from '../GlobalScope';

export class GlobalScopeApi {

    static using(...args: all.IGlobalMock<any>[]): IUsingResult {
        const scope = new GScope(args);
        return scope;
    }

}