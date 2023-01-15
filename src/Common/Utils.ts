import * as _ from 'lodash';
import { ConstructorWithArgs } from './Ctor';
import { PropertyRetriever } from './PropertyRetriever';
import { Match } from '../Match/Match';

const getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key, value) => {
        if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) {
                return;
            }
            seen.add(value);
        }
        return value;
    };
};

export const functionName = <T extends object>(fun: T): string => {
    let res: string;
    if ((<any>fun).name !== 'Function') {
        res = (<any>fun).name;
    } else {
        let repr = fun.toString();
        repr = repr.substring('function '.length);
        res = repr.substring(0, repr.indexOf('('));
    }
    return res;
};

export const objectName = <T extends object>(obj: T): string => functionName(obj.constructor);

export const argsName = (args: IArguments): string => {
    const argsArray: any[] = Array.prototype.slice.call(args);
    const sargs = argsArray.map((x: any) => {
        let res = '';
        if (Match.isMatcher(x)) {
            res = x.toString();
        } else {
            const replacer = (key: string, value: any) => {
                if (value === undefined) {
                    return 'undefined';
                }
                if (_.isFunction(value)) {
                    return 'Function';
                }
                return value;
            };
            res = JSON.stringify(x, getCircularReplacer());
        }
        return res;
    });
    const res = _.join(sargs);
    return res;
};


export class Utils {

    static conthunktor<U>(ctor: ConstructorWithArgs<U>, args: any[]): U {
        const ret: U = new ctor(...args);
        return ret;
    }

    static clone(target: Object, source: Object) {
        const sourceProps =
            PropertyRetriever.getOwnAndPrototypeEnumerablesAndNonenumerables(
                source
            );
        for (const p of sourceProps) {
            Object.defineProperty(target, p.name, p.desc);
        }
    }
}
